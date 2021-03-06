import { Socket } from './WebSocket.ts';
import {
  API,
  calcIntents,
  GatewayInfo,
  HttpMethod,
  IdentityProps,
  WS,
} from '../../utils/mod.ts';
import type { Cord } from '../mod.ts';
import { EventHandler } from './events/mod.ts';
import type { UserStatus } from '../../entities/mod.ts';
import { ApiRequest } from '../rest/mod.ts';
import { eventLogger as logger } from '../Logger.ts';

export class Gateway {
  private client: Cord;

  private socket: Socket | undefined;

  private heartbeatIntervalId: number | undefined;

  private heartbeatResponded: boolean;

  private sequenceKey: number | undefined;

  public sessionId: string;

  public identified: boolean;

  public eventHandler: EventHandler;

  constructor(client: Cord) {
    this.client = client;

    this.sessionId = '';
    this.identified = false;
    this.heartbeatResponded = false;

    this.eventHandler = new EventHandler(this.client);
  }

  private get identifyPayload() {
    const intents = calcIntents(this.client.options.intents);
    return {
      op: WS.OP.IDENTIFY,
      d: {
        intents,
        token: this.client.token,
        properties: IdentityProps,
      },
    };
  }

  initListeners() {
    if (this.socket) {
      this.socket.on(
        'open',
        () => logger.debug(
          `Connected to websocket at ${this.socket?.url}`,
          'GATEWAY:OPEN',
        ),
      );
      this.socket.on('close', (event: CloseEvent) => {
        logger.debug(
          'Closing websocket connection',
          'GATEWAY:CLOSE',
          `Reason: ${event.reason}`,
        );
        if (this.heartbeatIntervalId) clearInterval(this.heartbeatIntervalId);
      });
      this.socket.on(
        'message',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => this.handle(JSON.parse(payload)),
      );
      this.socket.on(
        'error',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err: any) => logger.error('Something went wrong', err),
      );
    }
  }

  async connect(resume = false) {
    const res = await new ApiRequest(HttpMethod.GET, API.Endpoints.GatewayBot, {
      token: this.client.token,
    }).execute();

    const json = await res.json();
    const wsurl = `${json.url}/?v=${GatewayInfo.version}&encoding=${GatewayInfo.encoding}`;
    this.socket = new Socket(wsurl);

    this.initListeners();

    if (resume) this.resume();
  }

  close() {
    this.socket?.close();
  }

  resume() {
    this.socket?.send({
      op: WS.OP.RESUME,
      d: {
        token: this.client.token,
        session_id: this.sessionId,
        seq: this.sequenceKey,
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle(payload: any) {
    if (!this.socket) return;

    switch (payload.op) {
      case WS.OP.DISPATCH: {
        logger.debug('Event received', 'GATEWAY:DISPATCH', payload.t);
        this.sequenceKey = payload.s;
        this.eventHandler.handle(payload.t, payload);
        break;
      }
      case WS.OP.HEARTBEAT: {
        logger.debug(
          'Heartbeat request, sending heartbeat',
          'GATEWAY:HEARTBEAT',
        );
        this.socket.send({
          op: WS.OP.HEARTBEAT,
          d: this.sequenceKey,
        });
        break;
      }
      case WS.OP.INVALID_SESSION: {
        logger.debug('Attempting to re-identify', 'GATEWAY:INVALID_SESSION');
        this.identified = false;
        setTimeout(() => {
          this.socket?.send(this.identifyPayload);
        }, 4000);
        break;
      }
      case WS.OP.HELLO: {
        logger.debug('Starting heartbeats', 'GATEWAY:HELLO');
        const hbPayload = {
          op: WS.OP.HEARTBEAT,
          d: this.sequenceKey || null,
        };

        if (!this.heartbeatIntervalId) {
          this.heartbeatIntervalId = setInterval(() => {
            logger.debug(
              'Sending heartbeat',
              'GATEWAY:HEARTBEAT',
            );
            this.socket?.send(hbPayload);
          }, payload.d.heartbeat_interval);
        }

        this.socket.send(hbPayload);

        logger.debug(
          'Sending heartbeat',
          'GATEWAY:HEARTBEAT',
        );

        if (!this.identified) {
          this.socket.send(this.identifyPayload);
          logger.debug(
            'Identifying bot',
            'GATEWAY:HELLO:IDENTIFY',
          );
        } else {
          this.resume();
        }
        break;
      }
      case WS.OP.HEARTBEAT_ACK: {
        this.heartbeatResponded = true;
        logger.debug('Heartbeat acknowledged', 'GATEWAY:HEARTBEAT_ACK');
        break;
      }
      default: {
        if (!this.socket.isConnected) {
          this.connect(true);
        } else {
          logger.debug(payload, 'GATEWAY:DEFAULT_HANDLER');
        }
        break;
      }
    }
  }

  updateStatus(status: UserStatus) {
    this.socket?.send({
      op: WS.OP.UPDATE_STATUS,
      d: status,
    });
  }
}
