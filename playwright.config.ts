import { defineConfig } from "@playwright/test";

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./src",
  testMatch: "**/*.e2e.spec.ts",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  // The GitHub hosted runners of public repos have 4 vCPUs. Locally, Playwright's default of half the cores is used.
  workers: isCI ? 4 : undefined,
  // On CI, annotates the failures on the PR and keeps an HTML report, which is uploaded when a test fails
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://localhost:6006",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run storybook",
    url: "http://localhost:6006",
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
