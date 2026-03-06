import { createElement } from "react";
import styles from "./Text.module.scss";
import { PropsWithRefAndChildren } from "../../types";
import { TextProps } from "./types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { textVariantsMappings } from "@/components/Text/constants";

const Text = (props: PropsWithRefAndChildren<TextProps, HTMLParagraphElement | HTMLSpanElement | HTMLHeadingElement>) => {
  const {
    variant = "body2",
    text,
    children,
    ref,
    style,
    className: classNames,
    italic,
    underline,
  } = usePropsWithThemeDefaults("Text", props);

  const Component = textVariantsMappings[variant] || "span";
  const className = sanitizeModuleRootClasses(styles, classNames, [variant, italic && "italic", underline && "underline"]);

  return createElement(Component, { ref, className, style }, text ?? children);
};

Text.displayName = "Text";
export default Text;
