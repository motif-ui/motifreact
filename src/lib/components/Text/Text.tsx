import { createElement } from "react";
import styles from "./Text.module.scss";
import { PropsWithRefAndChildren } from "../../types";
import { TextProps } from "./types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { textVariantsMappings, typeMappings } from "@/components/Text/constants";

const Text = (props: PropsWithRefAndChildren<TextProps, HTMLParagraphElement | HTMLSpanElement | HTMLHeadingElement>) => {
  const {
    variant,
    type = "body",
    size = "md",
    weight,
    text,
    children,
    ref,
    style,
    className: classNames,
    italic,
    underline,
    center,
    tone,
    marginless,
    uppercase,
  } = usePropsWithThemeDefaults("Text", props);

  /*
   * @deprecated. The `variant` prop is deprecated and will be removed in future versions.
   * */
  const Component = variant ? textVariantsMappings[variant] : typeMappings[type === "heading" ? (`heading_${size}` as const) : type];
  const className = sanitizeModuleRootClasses(styles, classNames, [
    variant,
    tone,
    type,
    size,
    weight,
    italic && "italic",
    underline && "underline",
    center && "center",
    marginless && "marginless",
    uppercase && "uppercase",
  ]);

  return createElement(Component, { ref, className, style }, text ?? children);
};

Text.displayName = "Text";
export default Text;
