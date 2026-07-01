import { JSX, FC, useInsertionEffect } from "react";
import { MotifProvider } from "../src/lib";
import { RESET_THEME_BUTTON_VAL } from "./constants";

export const DEFAULT_THEME = "default-theme";

const ThemeWrapper: FC<{ story: FC; theme: string }> = ({ story: Story, theme }) => {
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
