import type { Cord } from '../mod.ts';
import type { EndpointOptions } from '../../utils/mod.ts';
import { API } from '../../utils/mod.ts';
import { ApiRequest, RateLimiter } from './mod.ts';
import { eventLogger as logger } from '../Logger.ts';
import { Message } from '../../entities/mod.ts';
import type { Embed } from '../../entities/mod.ts';

const { Endpoints } = API;

export class RequestHandler {
  private client: Cord;

  private limiter: RateLimiter;

  constructor(client: Cord) {
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

      let data = null;

      if (res.headers.get('content-type') === 'application/json') {
        data = await res.json();
      } else {
        data = await res.text();
      }

      if (!res.ok) {
        return Promise.reject(data);
      }

      return data;
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
      const data = await this.request(Endpoints.Channel.Create(channelId), {
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
        Endpoints.Channel.Edit(channelId, messageId),
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
        Endpoints.Channel.React(
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

  async getMessage(channelId: string, messageId: string): Promise<Message | null> {
    try {
      const json = await this.request(Endpoints.Channel.GetMessage(channelId, messageId));
      if (!json) {
        return null;
      }
      console.dir(json);
      return json;
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
