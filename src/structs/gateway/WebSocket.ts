import { EventEmitter } from 'https://deno.land/std/node/events.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function encode(data: any) {
  if (typeof data === 'object') return JSON.stringify(data);
  return data;
}

export class Socket extends EventEmitter {
  private socketUrl: string;

  private socket: WebSocket | undefined;

  constructor(url: string) {
    super();
    this.socketUrl = url;
    this.connect();
  }

  public get url() {
    return this.socketUrl;
  }

  connect() {
    this.socket = new WebSocket(this.socketUrl);

    if (!this.socket) {
      this.emit('error', 'Could not connect');
      return;
    }

    this.socket.binaryType = 'arraybuffer';
    this.socket.onopen = this.onOpen.bind(this);
    this.socket.onmessage = this.onMessage.bind(this);
    this.socket.onclose = this.onClose.bind(this);
    this.socket.onerror = this.onError.bind(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send(data: any) {
    this.socket?.send(encode(data));
  }

  close(code = 1000) {
    this.socket?.close(code);
    this.emit('close');
  }

  /// event handlers

  private onOpen() {
    this.emit('open');
  }

  private onMessage(event: MessageEvent) {
    this.emit('message', event.data);
  }

  private onClose(event: CloseEvent) {
    this.emit('close', event);
  }

  private onError(event: ErrorEvent | Event) {
    if (event instanceof ErrorEvent) {
      this.emit('error', event.error);
    } else {
      this.emit('error', event.type);
    }
  }
}
