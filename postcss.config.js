import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = async () => {
  const wrapLayer = (await import(path.join(__dirname, "src/scripts/postcss-wrap-layer.js"))).default;

  return {
    plugins: [wrapLayer()],
  };
};

export default config;
