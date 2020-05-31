import Request from './Request.ts';
import { Deferred } from '../../Utils.ts';

interface RateLimit {
  limit: number;
  remaining: number;
  reset: number;
  resetAfter: number;
  bucket: string;
}

export default class RestLimiter {
  private queue: { deferred: Deferred; request: Request }[];
  private limits: { [key: string]: RateLimit };
  private throttle: boolean;
  private timeout: any;

  constructor() {
    this.queue = [];
    this.limits = {};
    this.throttle = false;
    this.timeout = null;
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

  enqueue(request: Request): Promise<any> {
    const deferred = new Deferred();
    this.queue.push({
      request,
      deferred,
    });

    this.handle();
    return deferred.promise;
  }

  async handle() {
    if (this.throttle || this.queue.length === 0) return;

    const item = this.queue.shift();
    if (item && item.request) {
      const route = item.request.route;

      // make sure we're not hitting a ratelimit before calling
      if (this.limits[route]?.remaining === 0) {
        const timeout = this.limits[route].reset;
        this.queue.unshift(item);
        this.throttle = true;

        // wait until the route resets and then call this again
        this.timeout = setTimeout(() => {
          this.throttle = false;
          this.limits[route].remaining = 1;
          this.handle();
        }, timeout);
        return;
      }

      let res;
      try {
        res = await item.request.execute();
      } catch (err) {
        this.throttle = false;
        return item.deferred.reject(err);
      }

      // we should hopefully never hit this
      if (res.status === 429) {
        const json = await res.json();
        const timeout = json.retry_after || this.limits[route].resetAfter;
        this.throttle = true;
        this.queue.unshift(item);

        this.timeout = setTimeout(() => {
          this.throttle = false;
          this.limits[route].remaining = 1;
          this.handle();
        }, timeout);
      }

      const limits = this.parseLimits(res.headers);
      this.limits[route] = limits;

      if (res.headers.get('content-type')?.startsWith('application/json')) {
        const json = await res.json();
        item.deferred.resolve(json);
      } else {
        item.deferred.resolve();
      }
    }
  }
}
