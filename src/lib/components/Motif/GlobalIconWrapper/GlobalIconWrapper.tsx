import type { CSSProperties } from "react";
import Icon from "../../Icon";
import type { IconGlobalType } from "../../../types";

type GlobalIconWrapperProps = {
  icon: IconGlobalType;
  className?: string;
  style?: CSSProperties;
};

const GlobalIconWrapper = ({ icon, className, style }: GlobalIconWrapperProps) => (
  <Icon className={className} style={style} {...(!icon || typeof icon === "string" ? { name: icon } : { children: icon })} />
);

export default GlobalIconWrapper;
