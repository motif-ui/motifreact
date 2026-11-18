"use client";

import styles from "./Timeline.module.scss";
import { PropsWithRef } from "../../types";
import { TimelineProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import { capitalizeFirstLetter } from "../../../utils/utils";
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

  // Orientation combined with the content position and the text alignment, so the layout rules need one class each
  const classNames = sanitizeModuleRootClasses(styles, className, [
    orientation,
    contentPosition,
    markerType,
    textAlign,
    variant,
    orientation + capitalizeFirstLetter(contentPosition),
    orientation + capitalizeFirstLetter(textAlign),
  ]);

  return (
    <div className={classNames} style={style} ref={ref}>
      {items.map((item, idx) => (
        <TimelineItem
          key={idx}
          markerType={markerType}
          order={idx + 1}
          textAlign={textAlign}
          first={idx === 0}
          last={idx === items.length - 1}
          {...item}
        />
      ))}
    </div>
  );
};

Timeline.displayName = "Timeline";
export default Timeline;
