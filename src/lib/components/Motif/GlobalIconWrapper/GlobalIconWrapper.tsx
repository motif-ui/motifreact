import { ReactElement } from "react";
import Icon from "../../Icon/Icon";
import styles from "./GlobalIconWrapper.module.scss";

type GlobalIconWrapperProps = {
  icon: string | ReactElement;
  className?: string;
};

const GlobalIconWrapper = ({ icon, className }: GlobalIconWrapperProps) =>
  typeof icon === "string" ? (
    <Icon name={icon} className={className} />
  ) : (
    <span className={`${styles.externalIcon}${className ? ` ${className}` : ""}`}>{icon}</span>
  );

export default GlobalIconWrapper;
