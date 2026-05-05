import { FunctionComponent, isValidElement } from "react";
import { PropsWithRefAndChildren } from "../../types";
import styles from "./Icon.module.scss";
import stylesMotifIcon from "@/components/Motif/Icon/MotifIcon.module.scss";
import { useMotifContext } from "../../motif/context/MotifProvider";
import { IconProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";

const Icon = (props: PropsWithRefAndChildren<IconProps, HTMLSpanElement>) => {
  const {
    iconClass,
    name,
    svgColorType,
    children,
    ref,
    color,
    size = "md",
    variant,
    className,
    style,
  } = usePropsWithThemeDefaults("Icon", props);
  const { baseIconClass } = useMotifContext();
  const isChildMotifIcon = isValidElement(children) && (children.type as FunctionComponent<IconProps>).displayName === "Icon";

  const iconClassToUse = isChildMotifIcon ? stylesMotifIcon.motifIconsDefault : (iconClass ?? baseIconClass);
  const iconName = name ?? (isChildMotifIcon ? (children.props as IconProps).name : typeof children === "string" && children.trim());

  const classNames = sanitizeModuleRootClasses(styles, `${iconName ? iconClassToUse : ""} ${className ?? ""}`, [
    size,
    variant,
    svgColorType,
  ]);

  return (
    <span className={classNames} style={{ ...(color && { color }), ...style }} ref={ref}>
      {iconName || (!isChildMotifIcon && children)}
    </span>
  );
};

Icon.displayName = "Icon";
export default Icon;
