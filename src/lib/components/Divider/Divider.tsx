"use client";

import styles from "./Divider.module.scss";
import { PropsWithRef } from "../../types";
import { DividerProps } from "../Divider/types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";

const Divider = (props: PropsWithRef<DividerProps, HTMLDivElement>) => {
  const {
    size = "md",
    orientation = "horizontal",
    gap = "md",
    shape = "solid",
    style,
    className,
    ref,
  } = usePropsWithThemeDefaults("Divider", props);

  const classNames = sanitizeModuleRootClasses(styles, className, [size, orientation, `gap-${gap}`, shape]);

  return <div ref={ref} className={classNames} data-testid="dividerItem" style={style} />;
};

Divider.displayName = "Divider";
export default Divider;
