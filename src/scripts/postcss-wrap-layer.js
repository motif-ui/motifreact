const LAYER_NAME = "motif-ui";

/** @type {function(): {postcssPlugin: string, Once(*, {postcss: *}): void}} */
const wrapLayerPlugin = () => {
  return {
    postcssPlugin: "postcss-wrap-layer",
    Once(root, { postcss }) {
      const from = root.source?.input?.file || "";
      if (!from.includes(".module.scss") && !from.includes(".module.css")) return;
      if (root.first?.name === "layer" || !root.nodes.length) return;

      const layer = postcss.atRule({
        name: "layer",
        params: LAYER_NAME,
      });

      const nodes = root.nodes.slice();
      root.removeAll();
      layer.append(nodes);
      root.append(layer);
    },
  };
};

wrapLayerPlugin.postcss = true;
export default wrapLayerPlugin;
