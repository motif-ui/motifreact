import { isValidElement } from "react";
import { PropsWithRefAndChildren } from "../../types";
import styles from "./Icon.module.scss";
import stylesMotifIcon from "@/components/Motif/Icon/MotifIcon.module.scss";
import { useMotifContext } from "../../motif/context/MotifProvider";
import { IconProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";

const Icon = (props: PropsWithRefAndChildren<IconProps, HTMLSpanElement>) => {
  const { iconClass, name, svgColorType, children, ref, color, size, variant, className, style } = usePropsWithThemeDefaults("Icon", props);
  const { baseIconClass } = useMotifContext();
  // An Icon or MotifIcon child is unwrapped, so this element sizes it. Matched by reference and by MotifIcon's flag, not
  // by displayName: Storybook's docgen rewrites displayNames
  const isChildMotifIcon =
    isValidElement(children) && (children.type === Icon || (children.type as { isMotifIcon?: boolean }).isMotifIcon === true);

  const iconClassToUse = isChildMotifIcon ? stylesMotifIcon.motifIconsDefault : (iconClass ?? baseIconClass);
  const iconName = name ?? (isChildMotifIcon ? (children.props as IconProps).name : typeof children === "string" && children.trim());

  const classNames = sanitizeModuleRootClasses(styles, `${iconName ? iconClassToUse : ""} ${className ?? ""}`, [
    size,
    variant,
    svgColorType,
  ]);

  return (
    <span className={classNames} style={{ ...(color && { color }), ...style }} ref={ref} lang="en" translate="no">
      {iconName || (!isChildMotifIcon && children)}
    </span>
  );
};

Icon.displayName = "Icon";
export default Icon;
