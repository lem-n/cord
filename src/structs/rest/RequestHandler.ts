import type CoreClient from '../CoreClient.ts';
import type { EndpointOptions } from '../../Constants.ts';
import { API } from '../../Constants.ts';
import { ApiRequest } from './ApiRequest.ts';
import { RateLimiter } from './RateLimiter.ts';
import { eventLogger as logger } from '../Logger.ts';
import Message from '../../entities/Message.ts';
import type Embed from '../../entities/Embed.ts';

const { Endpoints } = API;

export class RequestHandler {
  private client: CoreClient;

  private limiter: RateLimiter;

  constructor(client: CoreClient) {
    this.client = client;
    this.limiter = new RateLimiter();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async request(endpoint: EndpointOptions, body?: any): Promise<any> {
    try {
      const req = new ApiRequest(endpoint.method, endpoint.url, {
        route: endpoint.route,
        token: this.client.token,
        body,
      });

      logger.debug(`Executing request: ${endpoint.route}`, 'REST:REQUEST');
      const res = await this.limiter.enqueue(req);
      if (res.headers.get('content-type') === 'application/json') {
        const json = await res.json();
        return json;
      }
      const text = await res.text();
      return text;
    } catch (err) {
      logger.error(
        'Something went wrong when processing the request',
        'REST:REQUEST',
        err,
      );
      return Promise.reject(err);
    }
  }

  async sendMessage(
    channelId: string,
    content: string,
    embed?: Embed,
  ): Promise<Message> {
    try {
      const data = await this.request(Endpoints.Message.Create(channelId), {
        content,
        embed,
        tts: false,
      });
      logger.debug('Created message', 'REST:CREATE_MESSAGE', data.id);
      return new Message(this.client, data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async editMessage(
    channelId: string,
    messageId: string,
    newContent: string,
    embed?: Embed,
  ): Promise<Message> {
    try {
      const data = await this.request(
        Endpoints.Message.Edit(channelId, messageId),
        {
          content: newContent,
          embed,
        },
      );
      logger.debug('Edited message', 'REST:EDIT_MESSAGE', data.id);
      return new Message(this.client, data);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async reactToMessage(
    channelId: string,
    messageId: string,
    emoji: string,
  ): Promise<void> {
    try {
      await this.request(
        Endpoints.Message.React(
          channelId,
          messageId,
          encodeURIComponent(emoji),
        ),
      );
      logger.debug(
        'Reacted to message',
        'REST:CREATE_REACTION',
        messageId,
        `with ${emoji}`,
      );
      return undefined;
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
