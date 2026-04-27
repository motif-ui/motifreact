import { PropsWithRefAndChildren } from "../../types";
import { AlertProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { useToggle } from "../../hooks";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import styles from "@/components/Alert/Alert.module.scss";
import { MotifIcon, MotifIconButton } from "@/components/Motif/Icon";

const Alert = (props: PropsWithRefAndChildren<AlertProps, HTMLDivElement>) => {
  const {
    variant = "secondary",
    title,
    message,
    hideIcon,
    closable,
    children,
    ref,
    className,
    style,
  } = usePropsWithThemeDefaults("Alert", props);

  const { visible, hide, toggleState } = useToggle(true, 300);
  const classes = sanitizeModuleRootClasses(styles, className, [variant, toggleState]);
  const iconName = variant === "danger" ? "error" : variant === "warning" ? "warning" : variant === "success" ? "check_circle" : "info";

  return (
    visible && (
      <div className={classes} style={style} ref={ref}>
        {!hideIcon && <MotifIcon name={iconName} variant={variant} size="lg" />}
        <div className={styles.contentBox}>
          {title && <span className={styles.title}>{title}</span>}
          {message && <span className={styles.message}>{message}</span>}
          {children}
        </div>
        {closable && <MotifIconButton name="close" size="lg" onClick={hide} />}
      </div>
    )
  );
};

Alert.displayName = "Alert";
export default Alert;
