const LAYER_NAME = "motif-ui";

const wrapLayerPlugin = () => ({
  postcssPlugin: "postcss-wrap-layer",

  Once(root, { atRule }) {
    let alreadyLayered = false;
    root.walkAtRules("layer", () => {
      alreadyLayered = true;
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

wrapLayerPlugin.postcss = true;

export default wrapLayerPlugin;
