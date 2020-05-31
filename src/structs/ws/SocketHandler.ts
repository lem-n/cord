import Socket from './Socket.ts';
import { WS, IdentityProps, API, HttpMethod } from '../../Constants.ts';
import CoreClient from '../CoreClient.ts';
import EventHandler from './events/EventHandler.ts';
import UserStatus from '../../entities/UserStatus.ts';
import Request from '../rest/Request.ts';
import { eventLogger as logger } from '../Logger.ts';

export default class SocketHandler {
  private client: CoreClient;
  private socket: Socket | null;
  private heartbeatInterval: any;
  private sequenceKey: number | null;

  public sessionId: string;
  public identified: boolean;

  public eventHandler: EventHandler;

  constructor(client: CoreClient) {
    this.client = client;
    this.socket = null;
    this.heartbeatInterval = null;
    this.sequenceKey = null;

    this.sessionId = '';
    this.identified = false;

    this.eventHandler = new EventHandler(this.client);
  }

  initListeners() {
    if (this.socket) {
      this.socket.on('open', () => logger.debug('Connected to websocket', 'WS:OPEN'));
      this.socket.on('close', () => {
        logger.debug('Closing websocket connection', 'WS:CLOSE');
        if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
      });
      this.socket.on('message', (payload: any) => this.handle(JSON.parse(payload)));
      this.socket.on('error', (err: any) => logger.error('Something went wrong', err));
    }
  }

  async connect() {
    const res = await new Request(HttpMethod.GET, API.Endpoints.GatewayBot, {
      token: this.client.token,
    }).execute();

    const wsurl = (await res.json()).url;
    this.socket = new Socket(wsurl);

    this.initListeners();
  }

  close() {
    this.socket?.close();
  }

  async resume() {
    this.socket?.send({
      op: WS.OP.RESUME,
      d: {
        token: this.client.token,
        session_id: this.sessionId,
        seq: this.sequenceKey,
      },
    });
  }

  async handle(payload: any) {
    if (!this.socket) return;

    switch (payload.op) {
      case WS.OP.DISPATCH: {
        logger.debug('Event received', 'WS:DISPATCH', payload.t);
        this.sequenceKey = payload.s;
        this.eventHandler.handle(payload.t, payload);
        break;
      }
      case WS.OP.HEARTBEAT: {
        logger.debug('Heartbeat request, sending heartbeat', 'WS:HEARTBEAT');
        this.socket.send({
          op: WS.OP.HEARTBEAT,
          d: this.sequenceKey,
        });
      }
      case WS.OP.INVALID_SESSION: {
        logger.debug('Attempting to re-identify', 'WS:INVALID_SESSION');
        this.identified = false;
        setTimeout(() => {
          this.socket?.send({
            op: WS.OP.IDENTIFY,
            d: {
              token: this.client.token,
              properties: IdentityProps,
            },
          });
        }, 4000);
        break;
      }
      case WS.OP.HELLO: {
        logger.debug('Starting heartbeats', 'WS:HELLO');
        const hbPayload = {
          op: WS.OP.HEARTBEAT,
          d: this.sequenceKey || null,
        };

        if (!this.heartbeatInterval) {
          this.heartbeatInterval = setInterval(() => {
            logger.debug('Sending heartbeat', 'WS:HEARTBEAT_INTERVAL');
            this.socket?.send(hbPayload);
          }, payload.d.heartbeat_interval);
        }

        this.socket.send(hbPayload);

        if (!this.identified) {
          logger.debug('Identifying bot', 'WS:HELLO:IDENTIFY');
          this.socket.send({
            op: WS.OP.IDENTIFY,
            d: {
              token: this.client.token,
              properties: IdentityProps,
            },
          });
        }
        break;
      }
      case WS.OP.HEARTBEAT_ACK: {
        logger.debug('Heartbeat acknowledged', 'WS:HEARTBEAT_ACK');
        break;
      }
      default: {
        logger.debug(payload, 'WS:DEFAULT_HANDLER');
        break;
      }
    }
  }

  private sendGatewayIntents() {
    // send what events not to subscribe to
  }

  updateStatus(status: UserStatus) {
    this.socket?.send({
      op: WS.OP.UPDATE_STATUS,
      d: status,
    });
  }
}
