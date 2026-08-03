import type { NextConfig } from "next";
import type { Configuration } from "webpack";
import { applyCustomCSSModuleNaming } from "@styles/scripts/build";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  turbopack: {},
  compiler: {
    reactRemoveProperties:
      process.env.STORYBOOK === "true" && process.env.NODE_ENV === "production" ? { properties: ["^data-testid$"] } : false,
  },
  webpack: (config: Configuration): Configuration => {
    // Find the rule for CSS Modules and update getLocalIdent
    return applyCustomCSSModuleNaming(config, { rootDir: __dirname });
  },
};

export default nextConfig;
