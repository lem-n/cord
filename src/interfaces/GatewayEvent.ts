import type { Cord } from '../structs/mod.ts';
import type { Payload } from './mod.ts';

export interface GatewayEventDef {
  name: string;
  handle(client: Cord, payload: Payload): void;
}
