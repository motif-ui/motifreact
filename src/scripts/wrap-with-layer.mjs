import { readFileSync, writeFileSync } from "fs";
import { glob } from "glob";

const LAYER_NAME = "motif-ui";

export function wrapCssWithLayer() {
  return {
    name: "wrap-css-with-layer",

    async closeBundle() {
      const files = await glob("dist/**/*.css", {
        ignore: ["dist/themes/**"],
      });

      for (const file of files) {
        const content = readFileSync(file, "utf8");
        if (content.includes(`@layer ${LAYER_NAME}`)) continue;

        const wrapped = `@layer ${LAYER_NAME} {\n${content
          .split("\n")
          .map(l => (l.trim() ? `  ${l}` : ""))
          .join("\n")}\n}\n`;

        writeFileSync(file, wrapped, "utf8");
        console.log(`✅ Wrapped: ${file}`);
      }
    },
  };
}
