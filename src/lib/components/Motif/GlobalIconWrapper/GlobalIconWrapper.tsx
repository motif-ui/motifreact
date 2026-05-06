import { ReactElement } from "react";
import Icon from "../../Icon/Icon";
import styles from "./GlobalIconWrapper.module.scss";
import { sanitizeModuleRootClasses } from "../../../../utils/cssUtils";

type GlobalIconWrapperProps = {
  icon: string | ReactElement;
  className?: string;
  color?: string;
};

const GlobalIconWrapper = ({ icon, className, color }: GlobalIconWrapperProps) =>
  typeof icon === "string" ? (
    <Icon name={icon} className={className} color={color} />
  ) : (
    <span className={sanitizeModuleRootClasses(styles, className)} style={color ? { color } : undefined}>
      {icon}
    </span>
  );

export default GlobalIconWrapper;
