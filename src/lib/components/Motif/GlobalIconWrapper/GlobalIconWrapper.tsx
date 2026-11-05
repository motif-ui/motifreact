import type { CSSProperties } from "react";
import Icon from "../../Icon";
import { IconGlobalType, Size8LG, Variant } from "../../../types";

type GlobalIconWrapperProps = {
  icon: IconGlobalType;
  size?: Size8LG;
  variant?: Variant;
  className?: string;
  style?: CSSProperties;
  iconClass?: string;
};

const GlobalIconWrapper = ({ icon, className, style, size, variant, iconClass }: GlobalIconWrapperProps) => (
  <Icon
    size={size}
    variant={variant}
    className={className}
    style={style}
    iconClass={iconClass}
    {...(!icon || typeof icon === "string" ? { name: icon } : { children: icon })}
  />
);

export default GlobalIconWrapper;
