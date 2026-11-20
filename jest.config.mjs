import nextJest from "next/jest.js";

// Force the process to use UTC Timezone immediately
// eslint-disable-next-line no-undef
process.env.TZ = "UTC";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/src/lib/components/$1",
  },
  testEnvironment: "jest-environment-jsdom",
  // Playwright tests run with "npm run test:e2e"
  testPathIgnorePatterns: ["/node_modules/", "\\.e2e\\.spec\\.ts$"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async.
// next/jest maps *.module.scss to its own mock under this exact key; overriding the value keeps the key's first position.
export default async () => {
  const { moduleNameMapper, ...rest } = await createJestConfig(config)();
  return { ...rest, moduleNameMapper: { ...moduleNameMapper, ["^.+\\.module\\.(css|sass|scss)$"]: "<rootDir>/jest.cssModuleMock.cjs" } };
};
