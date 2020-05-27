import CoreClient from '../CoreClient.ts';
import { API } from '../../Constants.ts';
import Request, { HttpMethod } from './Request.ts';
import Logger from '../Logger.ts';

const { Endpoints } = API;

export default class RestHandler {
  private client: CoreClient;

  constructor(client: CoreClient) {
    this.client = client;
  }

  async sendChannelMessage(channelId: string, messageContent: string) {
    const res = await new Request(HttpMethod.POST, Endpoints.Message.Create(channelId), {
      token: this.client.token,
      body: {
        content: messageContent,
        tts: false,
      },
    }).execute();
    const json = await res.json();
    Logger.eventDebug('REST', 'Created message :', json.id);
  }

  async reactToMessage(channelId: string, messageId: string, emoji: string): Promise<any> {
    await new Request(HttpMethod.PUT, Endpoints.Message.React(channelId, messageId, encodeURIComponent(emoji)), {
      token: this.client.token,
    }).execute();
    Logger.eventDebug('REST', `Reacted with ${emoji} to message`, messageId);
  }
}
