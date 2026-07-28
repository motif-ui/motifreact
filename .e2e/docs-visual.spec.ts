import { test, expect } from "@chromatic-com/playwright";

const docsPages = [
  { name: "MotifProvider", path: "/?path=/docs/getting-started-motifprovider--docs" },
  { name: "Table", path: "/?path=/docs/components-table--docs" },
];

docsPages.forEach(({ name, path }) =>
  test(`${name} docs page renders`, async ({ page }) => {
    await page.goto(path);
    const docsRoot = page.frameLocator("#storybook-preview-iframe").locator("#storybook-docs");
    await expect(docsRoot).toBeVisible();
  }),
);
