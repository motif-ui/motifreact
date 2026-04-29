import type { Preview } from "@storybook/nextjs";
import { MotifProvider } from "../src/lib";
import { useInsertionEffect } from "react";
import { MotifDocContainer } from "./MotifDoc/MotifDocContainer";

const DEFAULT_THEME = "default-theme";
const RESET_THEME_BUTTON_VAL = "_reset";

const preview: Preview = {
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for components",
      defaultValue: RESET_THEME_BUTTON_VAL,
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: RESET_THEME_BUTTON_VAL, title: "Default Theme", right: "🔵" },
          { value: "papyrus", title: "Papyrus", right: "📜" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const themeProp = context.globals.theme as string;
      const theme = !themeProp || themeProp === RESET_THEME_BUTTON_VAL ? DEFAULT_THEME : themeProp;

      useInsertionEffect(() => {
        document.querySelectorAll("link[data-theme-css]").forEach(link => link.remove());

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.setAttribute("data-theme-css", "true");
        link.href = `/themes/${theme}.css`;
        document.head.appendChild(link);

        return () => link.remove();
      }, [theme]);

      return (
        <MotifProvider>
          <Story />
        </MotifProvider>
      );
    },
  ],
  parameters: {
    options: {
      storySort: {
        method: "alphabetical",
        order: [
          "Getting Started",
          ["Overview", "Installation", "Element Access", "MotifProvider", "Localization", "Accessibility", "Browser Support"],
          "Integrations",
          "Customization",
          ["Guide"],
          "Design",
          ["Themes", "Figma", "Design Tokens", "Color Palette"],
          "Blocks",
          "Components",
          "Icons",
          "Form",
          "Hooks",
          "Utility",
          "Support",
        ],
        locales: "en-US",
      },
    },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      container: MotifDocContainer,
      codePanel: true,
      toc: {
        title: "On this page",
        headingSelector: "h2, h3",
        // ignoreSelector: ".sbdocs-content h2[id='Stories']", // CSS selector to ignore specific elements
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default preview;
