import type { ApiRequest } from './ApiRequest.ts';
import { Deferred } from '../../utils/mod.ts';
import { eventLogger as logger } from '../Logger.ts';

interface RateLimit {
  limit: number;
  remaining: number;
  reset: number;
  resetAfter: number;
  bucket: string;
}

type LimitMap = { [key: string]: RateLimit };

export class RateLimiter {
  private queue: { deferred: Deferred; request: ApiRequest }[];

  private limits: LimitMap;

  private throttle: boolean;

  private timeoutId: number;

  constructor() {
    this.queue = [];
    this.limits = {};
    this.throttle = false;
    this.timeoutId = -1;
  }

  private parseLimits(headers: Headers): RateLimit {
    return {
      reset: Number(headers.get('x-ratelimit-reset')) * 1000 - Date.now() + 250,
      resetAfter: Number(headers.get('x-ratelimit-reset-after')),
      remaining: Number(headers.get('x-ratelimit-remaining')),
      limit: Number(headers.get('x-ratelimit-limit')),
      bucket: headers.get('x-ratelimit-bucket')!,
    };
  }

  enqueue(request: ApiRequest): Promise<Response> {
    const deferred = new Deferred();
    this.queue.push({
      request,
      deferred,
    });

    this.handle();
    return deferred.promise;
  }

  async handle(): Promise<void> {
    if (this.throttle || this.queue.length === 0) return;

    const item = this.queue.shift();
    if (item && item.request) {
      const { route } = item.request;

      // make sure we're not hitting a ratelimit before calling
      if (this.limits[route]?.remaining === 0) {
        const timeout = this.limits[route].reset;
        this.queue.unshift(item);
        this.throttle = true;
        logger.debug('Throttling requests', 'REST:RATELIMITER');

        // wait until the route resets and then call this again
        this.timeoutId = setTimeout(() => {
          this.throttle = false;
          this.limits[route].remaining = 1;
          logger.debug('Retrying request', 'REST:RATELIMITER');
          this.handle();
        }, timeout);
        return;
      }

      let res;
      try {
        res = await item.request.execute();
      } catch (err) {
        this.throttle = false;
        item.deferred.reject(err);
        return;
      }

      // we should hopefully never hit this
      if (res.status === 429) {
        const json = await res.json();
        const timeout = json.retry_after || this.limits[route].resetAfter;
        this.throttle = true;
        this.queue.unshift(item);
        logger.debug('Ratelimit hit, throttling', 'REST:RATELIMITER');

        this.timeoutId = setTimeout(() => {
          this.throttle = false;
          this.limits[route].remaining = 1;
          logger.debug('Retrying request', 'REST:RATELIMITER');
          this.handle();
        }, timeout);
      }

      const limits = this.parseLimits(res.headers);
      this.limits[route] = limits;
      item.deferred.resolve(res);
    }
  }
}
