import { memo, type CSSProperties } from "react";
import Icon from "../../Icon";
import { IconGlobalType, Size10LG, VariantV2 } from "../../../types";
import { createElementPropsComparator } from "../../../../utils/reactUtils";

type GlobalIconWrapperProps = {
  icon: IconGlobalType;
  size?: Size10LG;
  variant?: VariantV2;
  className?: string;
  style?: CSSProperties;
  iconClass?: string;
};

const arePropsEqual = createElementPropsComparator<GlobalIconWrapperProps>("icon");

const GlobalIconWrapper = memo(
  ({ icon, className, style, size, variant, iconClass }: GlobalIconWrapperProps) => (
    <Icon
      size={size}
      variant={variant}
      className={className}
      style={style}
      iconClass={iconClass}
      {...(!icon || typeof icon === "string" ? { name: icon } : { children: icon })}
    />
  ),
  arePropsEqual,
);

GlobalIconWrapper.displayName = "GlobalIconWrapper";

export default GlobalIconWrapper;
