import CoreClient from '../CoreClient.ts';
import { API } from '../../Constants.ts';
import Request, { HttpMethod } from './Request.ts';
import { eventLogger as logger } from '../Logger.ts';
import Message from '../../entities/Message.ts';
import Embed from '../../entities/Embed.ts';

const { Endpoints } = API;

export default class RestHandler {
  private client: CoreClient;

  constructor(client: CoreClient) {
    this.client = client;
  }

  async sendChannelMessage(channelId: string, messageContent: string, embed?: Embed) {
    const res = await new Request(HttpMethod.POST, Endpoints.Message.Create(channelId), {
      token: this.client.token,
      body: {
        content: messageContent,
        tts: false,
        embed,
      },
    }).execute();

    const json = await res.json();
    logger.debug('Created message', 'REST:CREATE_MESSAGE', json.id);
    return new Message(json);
  }

  async editMessageText(channelId: string, messageId: string, newContent: string) {
    const res = await new Request(HttpMethod.PATCH, Endpoints.Message.Edit(channelId, messageId), {
      token: this.client.token,
      body: { content: newContent },
    }).execute();

    const json = await res.json();
    logger.debug('Edited message', 'REST:EDIT_MESSAGE', json.id);
    return new Message(json);
  }

  async reactToMessage(channelId: string, messageId: string, emoji: string): Promise<any> {
    await new Request(HttpMethod.PUT, Endpoints.Message.React(channelId, messageId, encodeURIComponent(emoji)), {
      token: this.client.token,
    }).execute();
    logger.debug('Reacted to message', 'REST:CREATE_REACTION', messageId, `with ${emoji}`);
  }
}
