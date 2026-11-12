import type { StorybookConfig } from "@storybook/nextjs";
import path from "path";
import webpack from "webpack";
import { applyCustomCSSModuleNaming } from "../src/lib/styles/scripts/build.ts";
import { buildScssClassNamesManifest } from "../src/lib/styles/scripts/cssClassNamesManifest.ts";

// The token compare screens are an internal debug tool for the token migration: only `storybook dev` shows them, never the
// published Storybook or Chromatic. They are removed with the whole compare folder once every component has migrated.
const compareStories = process.env.NODE_ENV === "production" ? [] : ["../src/lib/styles/tokens/compare/*.compare-stories.tsx"];

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    // Scenes of the Playwright tests, kept out of the published Storybook. Storybook is used for
    // those scenes just to run them in a real browser environment.
    ...(process.env.NODE_ENV === "production" ? [] : ["../src/**/*.e2e.story.tsx"]),
    ...compareStories,
  ],
  typescript: { reactDocgen: "react-docgen-typescript" },
  features: {
    interactions: process.env.NODE_ENV === "development",
    backgrounds: false,
    measure: false,
    outline: false,
    sidebarOnboardingChecklist: false,
  },
  staticDirs: [
    { from: "../src/lib/styles/themes", to: "/themes" },
    { from: "../src/lib/styles/tokens/generated/themes", to: "/tokens" },
    "./public",
  ],
  core: { disableTelemetry: true },

  addons:
    process.env.NODE_ENV === "production"
      ? ["@storybook/addon-links", "@storybook/addon-docs", "msw-storybook-addon"]
      : ["@storybook/addon-links", "@storybook/addon-docs", "msw-storybook-addon", "@chromatic-com/storybook"],

  framework: {
    name: "@storybook/nextjs",
    options: {},
  },

  webpackFinal: config => {
    if (config.resolve?.alias) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@/components": path.resolve(process.cwd(), "src/lib/components"),
        "@styles": path.resolve(process.cwd(), "src/lib/styles"),
      };
    }

    config.module?.rules?.push({
      test: /\.browserslistrc$/,
      type: "asset/source",
    });

    // Keep "?raw" imports (e.g. a block's source shown in docs) away from the code loaders, so that the raw rule
    // returns the original file content instead of the compiled output.
    config.module?.rules?.forEach(rule => {
      if (rule && typeof rule === "object" && !rule.resourceQuery) rule.resourceQuery = { not: [/raw/] };
    });

    // Baked at config time so MotifDoc's CSSClassNames.tsx can read it as a static value instead of a
    // computed dynamic import (see cssClassNamesManifest.ts for why that broke Chromatic's TurboSnap).
    const scssClassNamesManifest = buildScssClassNamesManifest(
      path.resolve(process.cwd(), "src/lib/components"),
      path.resolve(process.cwd(), "src/lib/styles"),
    );
    config.plugins?.push(
      new webpack.DefinePlugin({
        __SCSS_CLASS_NAMES_MANIFEST__: JSON.stringify(scssClassNamesManifest),
      }),
    );

    // Find the rule for CSS Modules and update getLocalIdent
    return applyCustomCSSModuleNaming(config, { rootDir: process.cwd() });
  },
};
export default config;
