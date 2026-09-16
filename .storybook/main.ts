import type { StorybookConfig } from "@storybook/nextjs";
import path from "path";
import webpack from "webpack";
import { applyCustomCSSModuleNaming } from "../src/lib/styles/scripts/build.ts";
import { buildScssClassNamesManifest } from "../src/lib/styles/scripts/cssClassNamesManifest.ts";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  typescript: { reactDocgen: "react-docgen-typescript" },
  features: {
    interactions: process.env.NODE_ENV === "development",
    backgrounds: false,
    measure: false,
    outline: false,
    sidebarOnboardingChecklist: false,
  },
  staticDirs: [{ from: "../src/lib/styles/themes", to: "/themes" }, "./public"],
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
