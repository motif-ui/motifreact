"use client";

import styles from "./Button.module.scss";
import Icon from "@/components/Icon/Icon";
import { PropsWithRef } from "../../types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import type { ButtonProps } from "./types";

const Button = (props: PropsWithRef<ButtonProps, HTMLButtonElement>) => {
  const {
    label,
    shape = "solid",
    variant = "primary",
    size = "md",
    pill,
    fluid,
    icon,
    iconPosition = "left",
    disabled,
    onClick,
    htmlType = "button",
    className,
    ref,
    style,
  } = usePropsWithThemeDefaults("Button", props);

  const classNames = sanitizeModuleRootClasses(styles, className, [
    variant,
    shape,
    size,
    pill && "pill",
    fluid && "fluid",
    !!icon && `icon-${iconPosition}`,
  ]);

  return (
    (icon || label) && (
      <button className={classNames} onClick={onClick} {...(disabled && { disabled })} type={htmlType} ref={ref} style={style}>
        {icon &&
          (typeof icon === "string" ? (
            <Icon name={icon} className={styles.icon} size={size} />
          ) : (
            <span className={styles.icon}>{icon}</span>
          ))}
        {label && <span>{label}</span>}
      </button>
    )
  );
};

Button.displayName = "Button";
export default Button;
