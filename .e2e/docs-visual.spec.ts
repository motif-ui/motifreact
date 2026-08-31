import { test, expect } from "@chromatic-com/playwright";

const docsPages = [
  { name: "MotifProvider", path: "/?path=/docs/getting-started-motifprovider--docs" },
  { name: "ColorPalette", path: "/?path=/docs/design-color-palette--docs" },
  { name: "UploadInput", path: "/?path=/docs/components-upload-input--docs" },
];

docsPages.forEach(({ name, path }) =>
  test(`${name} docs page renders`, async ({ page }) => {
    await page.goto(path);
    const docsRoot = page.frameLocator("#storybook-preview-iframe").locator("#storybook-docs");
    await expect(docsRoot).toBeVisible();
  }),
);
