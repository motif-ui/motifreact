import type { CSSProperties } from "react";
import Icon from "../../Icon/Icon";
import styles from "./GlobalIconWrapper.module.scss";
import { sanitizeModuleRootClasses } from "../../../../utils/cssUtils";
import type { IconGlobalType } from "../../../types";

type GlobalIconWrapperProps = {
  icon: IconGlobalType;
  className?: string;
  style?: CSSProperties;
};

const GlobalIconWrapper = ({ icon, className, style }: GlobalIconWrapperProps) =>
  typeof icon === "string" ? (
    <Icon name={icon} className={className} style={style} />
  ) : (
    <span className={sanitizeModuleRootClasses(styles, className)} style={style}>
      {icon}
    </span>
  );

export default GlobalIconWrapper;
