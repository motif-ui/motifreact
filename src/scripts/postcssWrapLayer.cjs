const LAYER_NAME = "motif-ui";

const plugin = () => ({
  postcssPlugin: "postcss-wrap-layer",

  Once(root, { atRule }) {
    let alreadyLayered = false;

    root.walkAtRules("layer", rule => {
      if (rule.params === LAYER_NAME) {
        alreadyLayered = true;
        return false;
      }
    });

    if (!alreadyLayered) {
      const nodes = [...root.nodes];
      root.removeAll();

      const layerRule = atRule({ name: "layer", params: LAYER_NAME });
      nodes.forEach(node => layerRule.append(node));
      root.append(layerRule);
    }
  },
});

plugin.postcss = true;

module.exports = plugin;
