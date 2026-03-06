"use client";

import { useEffect, useRef } from "react";
import styles from "./ProgressBar.module.scss";
import { PropsWithRef } from "../../types";
import { ProgressBarProps } from "./types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";

const ProgressBar = (props: PropsWithRef<ProgressBarProps, HTMLDivElement>) => {
  const {
    variant = "primary",
    size = "sm",
    progress = 0,
    showPercentage,
    indeterminate,
    style,
    className,
    maxProgress = 100,
    countdown,
    ref,
  } = usePropsWithThemeDefaults("ProgressBar", props);

  const percentage = progress < 0 ? 0 : progress > maxProgress ? 100 : Math.floor((progress / maxProgress) * 100);
  const progressRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    progressRef.current?.style.setProperty("--percentage", percentage.toString());
  }, [maxProgress, percentage, progress]);

  useEffect(() => {
    countdown && progressRef.current?.style.setProperty("--countdown-duration", countdown.duration + "ms");
  }, [countdown]);

  const classNames = sanitizeModuleRootClasses(styles, className, [
    variant,
    size,
    indeterminate ? "indeterminate" : countdown && "countdown" + (countdown.paused ? " " + "paused" : ""),
  ]);

  return (
    <div
      className={classNames}
      ref={ref}
      aria-valuemin={0}
      aria-valuemax={maxProgress}
      aria-valuenow={percentage}
      role="progressbar"
      style={style}
      data-testid="progressBar"
    >
      <div className={styles.bar} ref={progressRef} />
      {!countdown && !indeterminate && showPercentage && <span className={styles.text}>{percentage + "%"}</span>}
    </div>
  );
};

ProgressBar.displayName = "ProgressBar";
export default ProgressBar;
