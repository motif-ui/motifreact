import type { Preview } from "@storybook/nextjs";
import type { ArgTypesEnhancer } from "storybook/internal/types";
import { MotifDocContainer } from "./MotifDoc/MotifDocContainer";
import { iconOptions, iconDecorator, themeChangeDecorator, localeChangeDecorator } from "./utils.tsx";

export const RESET_THEME_BUTTON_VAL = "_reset";

const preview: Preview = {
  globalTypes: {
    locale: {
      name: "Language",
      description: "Language",
      defaultValue: "en",
    },
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
  decorators: [iconDecorator, themeChangeDecorator, localeChangeDecorator],
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
