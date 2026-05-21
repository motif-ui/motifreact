const plugin = () => ({
  postcssPlugin: "postcss-wrap-layer",

  Once(root, { atRule }) {
    let alreadyLayered = false;

    root.walkAtRules("layer", () => {
      alreadyLayered = true;
    });

    if (!alreadyLayered) {
      const nodes = [...root.nodes];
      root.removeAll();

      const layerRule = atRule({ name: "layer", params: "motif-ui" });
      nodes.forEach(node => layerRule.append(node));
      root.append(layerRule);
    }
  },
});

plugin.postcss = true;

module.exports = plugin;
