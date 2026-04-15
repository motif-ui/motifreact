import { create } from "storybook/theming/create";
import { ThemeVars } from "storybook/theming";
import { LOGO_URL } from "../src/utils/constants";

const motifTheme: ThemeVars = create({
  base: "light",
  brandTitle: "Motif UI",
  brandUrl: "https://motif-ui.com",
  brandImage: LOGO_URL,
  brandTarget: "_self",
});

export default motifTheme;
