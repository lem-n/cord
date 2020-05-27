import { EventEmitter } from 'https://deno.land/std/node/events.ts';
import {
  WebSocket,
  connectWebSocket,
  isWebSocketPingEvent,
  isWebSocketPongEvent,
  isWebSocketCloseEvent,
} from 'https://deno.land/std/ws/mod.ts';
import Logger from '../Logger.ts';

function encode(data: any) {
  if (typeof data === 'object') return JSON.stringify(data);
  else return data;
}

export default class Socket extends EventEmitter {
  private socketUrl: string;
  private socket: WebSocket | null;

  constructor(url: string) {
    super();
    this.socketUrl = url;
    this.socket = null;
    this.connect();
  }

  get url() {
    return this.socketUrl;
  }

  async connect() {
    this.socket = await connectWebSocket(this.url);
    this.emit('open');

    try {
      for await (const msg of this.socket) {
        if (isWebSocketPingEvent(msg)) {
          this.emit('ping', msg);
        } else if (isWebSocketPongEvent(msg)) {
          this.emit('pong', msg);
        } else if (isWebSocketCloseEvent(msg)) {
          this.emit('close', msg);
          this.close();
        } else {
          // is regular message
          this.emit('message', msg);
        }
      }
    } catch (err) {
      Logger.error(err.message, err);
      this.emit('error', err);
    }
  }

  send(data: any) {
    this.socket?.send(encode(data));
  }

  ping(data: any) {
    this.socket?.ping(encode(data));
  }

  close(code = 1000) {
    this.socket?.close(code);
    this.emit('close');
  }
}
