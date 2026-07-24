import { create } from "storybook/theming/create";
import { ThemeVars } from "storybook/theming";
import { LOGO_URL } from "../src/utils/constants";

/**
 * Even though most of theming is done via css in preview and manager, the keys below still matter:
 *
 * They feed surfaces the CSS doesn't touch — docs controls widgets, toolbar dropdown menus, tooltips, the mobile layout
 * — and the docs pages via parameters.docs.theme.
 */
const motifTheme: ThemeVars = create({
  base: "light",
  brandTitle: "Motif UI",
  brandUrl: "https://motif-ui.com",
  brandImage: LOGO_URL,
  brandTarget: "_self",

  // Actual Primary Color that matches => --mtfdocs-purple
  //
  // "number of control" chip in a story
  // Border color of the inputs in stories
  // Text color of custom buttons in toolbar
  // Border hover color of the main layout
  // etc.
  colorSecondary: "#975a9d",
  // Not in too much places after css overrides. Used as fallback here
  colorPrimary: "#7f4588",
  // Font Base
  fontBase: "Inter, ui-sans-serif, sans-serif",
  // Background of the app
  appBg: "#f6f7fb",
  // Border color of sidebar, navigation bar, etc.
  appBorderColor: "#e7e6ef",
  // Common base radius (search box in sidebar, etc.)
  appBorderRadius: 12,
  // Sidebar menu (first level) color, etc.
  textColor: "#454c64",
  // Scrollbar color, etc.
  textMutedColor: "#67718b",
  // Various places like search bar filter button, "number of control" chip in a story, etc.
  appHoverBg: "rgba(151, 90, 157, 0.08)",
  // Common buttons in bars
  buttonBg: "#ffffff",
  barHoverColor: "#7f4588",
});

export default motifTheme;
