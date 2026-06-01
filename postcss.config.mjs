import { createRequire } from "module";

const require = createRequire(import.meta.url);

export default {
  plugins: [require.resolve("./src/scripts/postcssWrapLayer.cjs")],
};
