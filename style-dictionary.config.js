import StyleDictionary from "style-dictionary";
import { transforms } from "style-dictionary/enums";

StyleDictionary.registerTransformGroup({
  name: "motif-ui-css",
  transforms: [transforms.attributeCti, transforms.nameKebab, transforms.sizePxToRem],
});

export default {
  platforms: {
    css: {
      transformGroup: "motif-ui-css",
      files: [
        {
          format: "css/variables",
          options: {
            outputReferences: true,
            showFileHeader: false,
          },
        },
      ],
    },
  },
};
