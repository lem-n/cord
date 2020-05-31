import CoreClient from '../CoreClient.ts';
import { API } from '../../Constants.ts';
import Request from './Request.ts';
import RestLimiter from './RestLimiter.ts';
import { eventLogger as logger } from '../Logger.ts';
import Message from '../../entities/Message.ts';
import Embed from '../../entities/Embed.ts';

const { Endpoints } = API;

export default class RestHandler {
  private client: CoreClient;
  private limiter: RestLimiter;

  constructor(client: CoreClient) {
    this.client = client;
    this.limiter = new RestLimiter();
  }

  private request(endpoint: any, body?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const req = new Request(endpoint.method, endpoint.url, {
        route: endpoint.route,
        token: this.client.token,
        body,
      });

      this.limiter
        .enqueue(req)
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  }

  sendMessage(channelId: string, content: string, embed?: Embed): Promise<Message> {
    return this.request(Endpoints.Message.Create(channelId), {
      content,
      embed,
      tts: false,
    })
      .then((data) => {
        logger.debug('Created message', 'REST:CREATE_MESSAGE', data.id);
        return new Message(data);
      })
      .catch((err) => Promise.reject(err));
  }

  editMessage(channelId: string, messageId: string, newContent: string, embed?: Embed): Promise<Message> {
    return this.request(Endpoints.Message.Edit(channelId, messageId), {
      content: newContent,
      embed,
    })
      .then((data) => {
        logger.debug('Edited message', 'REST:EDIT_MESSAGE', data.id);
        return new Message(data);
      })
      .catch((err) => Promise.reject(err));
  }

  reactToMessage(channelId: string, messageId: string, emoji: string): Promise<void> {
    return this.request(Endpoints.Message.React(channelId, messageId, encodeURIComponent(emoji)))
      .then((data) => {
        logger.debug('Reacted to message', 'REST:CREATE_REACTION', messageId, `with ${emoji}`);
      })
      .catch((err) => Promise.reject(err));
  }
}
