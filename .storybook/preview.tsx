import type { Preview } from "@storybook/nextjs";
import type { ArgTypesEnhancer } from "storybook/internal/types";
import { MotifProvider } from "../src/lib";
import { useInsertionEffect } from "react";
import { MotifDocContainer } from "./MotifDoc/MotifDocContainer";
import { iconOptions, iconDecorator } from "./utils.tsx";

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
    iconDecorator,
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

/**
 * Storybook reads this named export automatically at boot — do not remove or rename it.
 *
 * For every story, this runs after docgen collects argTypes. Any prop whose type is
 * `IconGlobalType` automatically gets the icon selector control (options + mapping),
 * so individual story files don't need to configure it themselves.
 */
export const argTypesEnhancers: ArgTypesEnhancer[] = [
  context =>
    Object.fromEntries(
      Object.entries(context.argTypes).map(([key, argType]) => {
        if ((argType as { table?: { type?: { summary?: string } } }).table?.type?.summary === "IconGlobalType") {
          return [key, { ...argType, options: Object.keys(iconOptions), mapping: iconOptions, control: { type: "select" } }];
        }
        return [key, argType];
      }),
    ) as ReturnType<ArgTypesEnhancer>,
];

export default preview;
