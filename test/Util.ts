/* eslint-disable @typescript-eslint/no-explicit-any */
export function objectString(obj: any) {
  const str = Deno.inspect(obj, { depth: 1 });
  return str;
}

export function codeblock(lang: string, content: string) {
  return `\`\`\`${lang}\n${content}\n\`\`\``;
}

export function flattenObject(obj: { [i: string]: any }) {
  const toReturn: { [i: string]: any } = {};

  for (const i in obj) {
    if (!(i in obj)) continue;

    if (typeof obj[i] === 'object' && obj[i] !== null) {
      const flatObject = flattenObject(obj[i]);
      for (const x in flatObject) {
        if (!(x in flatObject)) continue;

        toReturn[`${i}.${x}`] = flatObject[x];
      }
    } else {
      toReturn[i] = obj[i];
    }
  }
  return toReturn;
}
