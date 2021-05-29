import { API, Headers, HttpMethod } from "../../Constants.ts";

const { Base } = API;

export interface RequestOptions {
  token?: string;
  route?: string;
  body?: BodyInit | null | undefined;
  headers?: { [k: string]: string };
}

export class ApiRequest {
  public method: HttpMethod;
  public url: string;
  public route: string;
  public options: RequestOptions;

  constructor(method: HttpMethod, url: string, options: RequestOptions = {}) {
    this.method = method;
    this.url = `${Base}/${url}`;
    this.options = options;
    this.route = options.route!;
  }

  execute() {
    let headers: { [k: string]: string } = {};
    headers["User-Agent"] = Headers["User-Agent"];

    if (this.options.token) headers.Authorization = `Bot ${this.options.token}`;
    if (this.options.headers) headers = { ...headers, ...this.options.headers };

    let body;
    if (this.options.body) {
      body = JSON.stringify(this.options.body);
      headers["Content-Type"] = "application/json";
    }

    return fetch(this.url, {
      method: this.method,
      headers,
      body,
    });
  }
}
