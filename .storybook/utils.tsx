import { JSX, FC, useInsertionEffect } from "react";
import MotifProvider from "../src/lib/motif/context/MotifProvider";
import { RESET_THEME_BUTTON_VAL } from "./constants";

export const DEFAULT_THEME = "legacy";

// Each toolbar theme: the old theme variables (/themes) and the design tokens (/tokens), like the shipped theme files.
// The legacy tokens come with their hand-written additions (/token-themes/legacy-compat.css).
const THEMES: Record<string, { base: string; tokens: string }> = {
  legacy: { base: "default-theme", tokens: "legacy" },
  basic: { base: "default-theme", tokens: "basic" },
  papyrus: { base: "papyrus", tokens: "legacy" },
};

const ThemeWrapper: FC<{ story: FC; theme: string }> = ({ story: Story, theme }) => {
  useInsertionEffect(() => {
    document.querySelectorAll("link[data-theme-css]").forEach(link => link.remove());

    const { base, tokens } = THEMES[theme] ?? THEMES[DEFAULT_THEME];
    const compat = tokens === "legacy" ? ["/token-themes/legacy-compat.css"] : [];
    const links = [`/themes/${base}.css`, `/tokens/${tokens}.css`, ...compat].map(href => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.setAttribute("data-theme-css", "true");
      link.href = href;
      document.head.appendChild(link);
      return link;
    });

    return () => links.forEach(link => link.remove());
  }, [theme]);

  return (
    <MotifProvider>
      <Story />
    </MotifProvider>
  );
};

export const themeChangeDecorator = (Story: FC, context: { globals: { theme?: string } }): JSX.Element => {
  const themeProp = context.globals.theme as string;
  const theme = !themeProp || themeProp === RESET_THEME_BUTTON_VAL ? DEFAULT_THEME : themeProp;
  return <ThemeWrapper story={Story} theme={theme} />;
};

export const iconObjects = {
  string: "folder",
  "<i>": <i className="bi bi-airplane" />,
  "<span>": <span className="material-symbols">mood</span>,
  "<svg>": (
    <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 1.5 3 4v4c0 3 2 5 5 6 3-1 5-3 5-6V4z" />
    </svg>
  ),
};

export const iconOptions = {
  undefined: undefined,
  ...iconObjects,
} as const;

export const iconDecorator = (StoryComponent: FC): JSX.Element => (
  <>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols" />
    <StoryComponent />
  </>
);
