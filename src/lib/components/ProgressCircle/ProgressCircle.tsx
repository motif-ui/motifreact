"use client";

import styles from "./ProgressCircle.module.scss";
import { useEffect, useRef } from "react";
import { PropsWithRef } from "../../types";
import { ProgressCircleProps } from "./types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";

const ProgressCircle = (props: PropsWithRef<ProgressCircleProps, SVGSVGElement>) => {
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
  } = usePropsWithThemeDefaults("ProgressCircle", props);

  const percentage = indeterminate ? 30 : progress < 0 ? 0 : progress > maxProgress ? 100 : Math.floor((progress / maxProgress) * 100);
  const circleRef = useRef<SVGCircleElement>(null);
  useEffect(() => {
    circleRef.current?.style.setProperty("--percentage", percentage.toString());
  }, [maxProgress, percentage, progress, indeterminate]);

  useEffect(() => {
    countdown && circleRef.current?.style.setProperty("--countdown-duration", countdown.duration + "ms");
  }, [countdown]);

  const percentageVisible = (size === "lg" || size === "xl") && !indeterminate && showPercentage;

  const classNames = sanitizeModuleRootClasses(styles, className, [
    variant,
    size,
    indeterminate ? "indeterminate" : countdown && "countdown" + (countdown.paused ? " " + "paused" : ""),
  ]);

  return (
    <svg
      ref={ref}
      className={classNames}
      style={style}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={maxProgress}
      aria-valuenow={percentage}
      data-testid="progressCircle"
    >
      <circle className={styles.track} fill="transparent" />
      <circle ref={circleRef} className={styles.circle} fill="transparent" />
      {!countdown && percentageVisible && (
        <text className={styles.text} x="50%" y="50%" dy="0.4em" textAnchor="middle">
          {percentage + "%"}
        </text>
      )}
    </svg>
  );
};

ProgressCircle.displayName = "ProgressCircle";
export default ProgressCircle;
