"use client";

import { useEffect, type ReactNode } from "react";
import styles from "./Button.module.scss";
import GlobalIconWrapper from "../Motif/GlobalIconWrapper/GlobalIconWrapper";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import type { ButtonProps } from "./types";

const hasRenderableContent = (value: ReactNode) =>
  value !== null && value !== undefined && value !== false && value !== true && value !== "";

const Button = (props: ButtonProps) => {
  const {
    label,
    children,
    shape = "solid",
    variant = "primary",
    size = "md",
    pill,
    fluid,
    icon,
    iconPosition = "left",
    disabled,
    htmlType = "button",
    className,
    ref,
    style,
    "aria-label": ariaLabel,
    ...rest
  } = usePropsWithThemeDefaults("Button", props);

  const content = children ?? label;
  const hasContent = hasRenderableContent(content);
  const isIconOnly = Boolean(icon && !hasContent);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && isIconOnly && !ariaLabel) {
      console.warn("Button: Icon-only buttons must provide an accessible name with `aria-label`.");
    }
  }, [isIconOnly, ariaLabel]);

  if (!icon && !hasContent) return null;

  const classNames = sanitizeModuleRootClasses(styles, className, [
    variant,
    shape,
    size,
    pill && "pill",
    fluid && "fluid",
    isIconOnly && "icon-only",
    icon && hasContent ? `icon-${iconPosition}` : undefined,
  ]);

  const iconElement = icon ? <GlobalIconWrapper icon={icon} className={styles.icon} aria-hidden="true" /> : null;

  const contentElement = hasContent ? <span>{content}</span> : null;

  return (
    <button
      {...rest}
      ref={ref}
      className={classNames}
      type={htmlType}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      aria-label={isIconOnly ? ariaLabel : undefined}
      style={style}
    >
      {iconPosition === "left" && iconElement}
      {contentElement}
      {iconPosition === "right" && iconElement}
    </button>
  );
};

Button.displayName = "Button";

export default Button;
