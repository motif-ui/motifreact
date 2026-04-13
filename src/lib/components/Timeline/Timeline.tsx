"use client";

import styles from "./Timeline.module.scss";
import { PropsWithRef } from "../../types";
import { TimelineProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import TimelineItem from "./TimelineItem";

const Timeline = (props: PropsWithRef<TimelineProps, HTMLDivElement>) => {
  const {
    items,
    markerType = "dot",
    orientation = "vertical",
    textAlign = "start",
    contentPosition = "after",
    variant = "primary",
    className,
    ref,
    style,
  } = usePropsWithThemeDefaults("Timeline", props);

  const classNames = sanitizeModuleRootClasses(styles, className, [orientation, contentPosition, markerType, textAlign, variant]);

  return (
    <div className={classNames} style={style} ref={ref}>
      {items.map((item, idx) => (
        <TimelineItem key={idx} markerType={markerType} order={idx + 1} {...item} />
      ))}
    </div>
  );
};

Timeline.displayName = "Timeline";
export default Timeline;
