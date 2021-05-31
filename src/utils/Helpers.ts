export function calcIntents(intents: number[]) {
  return intents.reduce((acc, intent) => acc + intent, 0);
}
