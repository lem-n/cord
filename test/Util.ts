export function objectString(obj: any) {
  const str = Deno.inspect(obj, { depth: 1 });
  return str;
}

export function codeblock(lang: string, content: string) {
  return `\`\`\`${lang}\n${content}\n\`\`\``;
}

export function flattenObject(ob: { [i: string]: any }) {
  /* eslint-disable no-prototype-builtins, no-continue */
  const toReturn: { [i: string]: any } = {};

  for (const i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if (typeof ob[i] === 'object' && ob[i] !== null) {
      const flatObject = flattenObject(ob[i]);
      for (const x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[`${i}.${x}`] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
}
