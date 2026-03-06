import { addons, types } from "storybook/manager-api";
import motifTheme from "./motifTheme";
import ExternalLinksToolbar from "./toolbar/CustomButtons";

addons.add("external-links/toolbar", {
  type: types.TOOLEXTRA,
  title: "GitHub & NPM",
  render: ExternalLinksToolbar,
});

addons.setConfig({
  theme: motifTheme,
  sidebar: {
    showRoots: false,
    collapsedRoots: ["Integrations", "Customization", "Design", "Blocks", "Components", "Icons", "Form", "Hooks", "Utility", "Support"],
  },
});
