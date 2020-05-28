import Socket from './Socket.ts';
import { WS, IdentityProps, API } from '../../Constants.ts';
import CoreClient from '../CoreClient.ts';
import EventHandler from './events/EventHandler.ts';
import Logger from '../Logger.ts';
import UserStatus from '../../entities/UserStatus.ts';
import Request, { HttpMethod } from '../rest/Request.ts';

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
      this.socket.on('open', () => console.log('Connected to DAPI websocket'));
      this.socket.on('close', () => {
        console.log('Closing DAPI websocket connection');
        if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
      });
      this.socket.on('message', (payload: any) => this.handle(JSON.parse(payload)));
      this.socket.on('error', (err: any) => console.error(err));
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
        Logger.eventDebug('WS:DISPATCH', 'Event', payload.t);
        this.sequenceKey = payload.s;
        this.eventHandler.handle(payload.t, payload);
        break;
      }
      case WS.OP.HEARTBEAT: {
        Logger.eventDebug('WS:HEARTBEAT', 'Heartbeat request, sending heartbeat');
        this.socket.send({
          op: WS.OP.HEARTBEAT,
          d: this.sequenceKey,
        });
      }
      case WS.OP.INVALID_SESSION: {
        Logger.eventDebug('WS:INVALID_SESSION', 'Attemption to re-identify');
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
        Logger.eventDebug('WS:HELLO', 'Starting heartbeats');
        const hbPayload = {
          op: WS.OP.HEARTBEAT,
          d: this.sequenceKey || null,
        };

        if (!this.heartbeatInterval) {
          this.heartbeatInterval = setInterval(() => {
            Logger.eventDebug('HEARTBEAT_INTERVAL', 'Sending heartbeat');
            this.socket?.send(hbPayload);
          }, payload.d.heartbeat_interval);
        }

        this.socket.send(hbPayload);

        if (!this.identified) {
          console.log('HELLO:IDENTIFY', 'identifying bot');
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
        Logger.eventDebug('HEARTBEAT_ACK', 'Heartbeat acknowledged');
        break;
      }
      default: {
        console.log('DEFAULT', payload);
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
