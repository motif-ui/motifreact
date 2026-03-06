import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const colorPrint = {
  red: s => `\x1b[31m${s}\x1b[0m`,
  green: s => `\x1b[32m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
  blue: s => `\x1b[34m${s}\x1b[0m`,
  cyan: s => `\x1b[35m${s}\x1b[0m`,
};
const isMainModule = metaUrl => {
  const currentFilePath = resolve(fileURLToPath(metaUrl));
  // eslint-disable-next-line no-undef
  const entryFilePath = resolve(process.argv[1]);
  return currentFilePath === entryFilePath || currentFilePath === `${entryFilePath}.js`;
};

export { colorPrint, isMainModule };
