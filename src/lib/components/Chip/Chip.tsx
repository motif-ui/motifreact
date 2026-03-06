"use client";

import { useState, useCallback } from "react";
import styles from "./Chip.module.scss";
import Icon from "@/components/Icon/Icon";
import { MotifIconButton } from "@/components/Motif/Icon";
import { PropsWithRef } from "../../types";
import { ChipProps } from "./types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";

const Chip = (props: PropsWithRef<ChipProps, HTMLDivElement>) => {
  const {
    pill = true,
    shape = "solid",
    size = "md",
    label,
    icon,
    variant = "secondary",
    onClose,
    closable,
    ref,
    style,
    className,
  } = usePropsWithThemeDefaults("Chip", props);
  const [deleted, setDeleted] = useState<boolean>(false);

  const deleteHandler = useCallback(() => {
    setDeleted(true);
    onClose && onClose();
  }, [onClose]);

  const classNames = sanitizeModuleRootClasses(styles, className, [variant, shape, size, pill && "pill", closable && "closable"]);

  return (
    !deleted && (
      <div className={classNames} data-testid="chipItem" ref={ref} style={style}>
        {icon && <Icon name={icon} size={size} className={styles["icon-left"]} />}
        <span className={styles.label}>{label}</span>
        {closable && <MotifIconButton name="cancel" size={size} onClick={deleteHandler} className={styles["icon-close"]} />}
      </div>
    )
  );
};

Chip.displayName = "Chip";
export default Chip;
