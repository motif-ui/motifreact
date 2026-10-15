/**
 * @jest-environment node
 */
import path from "node:path";
import { describe, expect, test } from "@jest/globals";
import { RuleTester } from "eslint";
import typescriptParser from "@typescript-eslint/parser";
import { createNoRedundantDefaultProps, extractDefaults } from "./noRedundantDefaultProps";

const defaults = {
  Button: { size: "md", variant: "primary" },
  Chip: { pill: true },
  Badge: { max: 999 },
  Grid: { gutter: "md" },
  "Grid.Row": { justifyCols: "start" },
};

const ruleTester = new RuleTester({
  languageOptions: { parser: typescriptParser, parserOptions: { ecmaFeatures: { jsx: true } } },
});

const error = (prop, component, value) => ({
  message: `"${prop}" of <${component}> is already ${JSON.stringify(value)} by default. Remove the redundant prop.`,
});

ruleTester.run(
  "no-redundant-default-props",
  createNoRedundantDefaultProps(() => defaults),
  {
    valid: [
      `import { Button } from "@motif-ui/react"; <Button size="lg" />;`,
      `import { Button } from "@motif-ui/react"; <Button size={size} />;`,
      `import { Button } from "@motif-ui/react"; <Button size={\`\${size}\`} />;`,
      `import { Chip } from "@motif-ui/react"; <Chip pill={false} />;`,
      // Not a motif component
      `import { Button } from "other-lib"; <Button size="md" />;`,
      `const Button = () => null; <Button size="md" />;`,
      `import Button from "@/components/Alert"; <Button size="md" />;`,
    ],
    invalid: [
      {
        code: `import { Button } from "@motif-ui/react"; <Button label="Save" size="md" />;`,
        output: `import { Button } from "@motif-ui/react"; <Button label="Save" />;`,
        errors: [error("size", "Button", "md")],
      },
      {
        code: `import { Button } from "@motif-ui/react"; <Button size={"md"} variant={\`primary\`} />;`,
        // Adjacent fixes are applied in the next pass of eslint --fix
        output: `import { Button } from "@motif-ui/react"; <Button variant={\`primary\`} />;`,
        errors: [error("size", "Button", "md"), error("variant", "Button", "primary")],
      },
      {
        code: `import { Chip as C, Badge } from "@motif-ui/react"; <><C pill /><Badge max={999} /></>;`,
        output: `import { Chip as C, Badge } from "@motif-ui/react"; <><C /><Badge /></>;`,
        errors: [error("pill", "Chip", true), error("max", "Badge", 999)],
      },
      {
        code: `import * as M from "@motif-ui/react"; <M.Grid gutter="md"><M.Grid.Row justifyCols="start" /></M.Grid>;`,
        output: `import * as M from "@motif-ui/react"; <M.Grid><M.Grid.Row /></M.Grid>;`,
        errors: [error("gutter", "Grid", "md"), error("justifyCols", "Grid.Row", "start")],
      },
      {
        code: `import { Grid } from "@motif-ui/react"; <Grid.Row justifyCols="start" />;`,
        output: `import { Grid } from "@motif-ui/react"; <Grid.Row />;`,
        errors: [error("justifyCols", "Grid.Row", "start")],
      },
      {
        // The spread before may contain another size which the attribute overrides, so it is not auto fixed
        code: `import { Button } from "@motif-ui/react"; <Button {...rest} size="md" />;`,
        output: null,
        errors: [error("size", "Button", "md")],
      },
      {
        code: `import Button from "@/components/Button"; import Btn from "../../lib/components/Button/Button"; <><Button size="md" /><Btn size="md" /></>;`,
        output: `import Button from "@/components/Button"; import Btn from "../../lib/components/Button/Button"; <><Button /><Btn /></>;`,
        errors: [error("size", "Button", "md"), error("size", "Button", "md")],
      },
      {
        code: `import { Button } from "../lib"; <Button size="md" />;`,
        output: `import { Button } from "../lib"; <Button />;`,
        errors: [error("size", "Button", "md")],
      },
    ],
  },
);

describe("extractDefaults", () => {
  const extracted = extractDefaults(path.resolve("src/lib/components"));

  test("reads defaults destructured from usePropsWithThemeDefaults", () => {
    expect(extracted.Button).toMatchObject({ size: "md", variant: "primary", shape: "solid" });
  });

  test("reads defaults of props aliases", () => {
    expect(extracted.Switch).toEqual({ checked: false });
  });

  test("reads defaults of compound components", () => {
    expect(extracted["Grid.Row"]).toEqual({ justifyCols: "start" });
    expect(extracted["Panel.Title"]).toEqual({ size: "md" });
  });

  test("does not include components without primitive defaults", () => {
    expect(extracted.InputText).toBeUndefined();
  });
});
