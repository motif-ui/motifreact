import { memo } from "react";
import GlobalIconWrapper from "../Motif/GlobalIconWrapper/GlobalIconWrapper";
import styles from "./Timeline.module.scss";
import { TimelineDefaultableProps, TimelineItemProps, TimelineMarkerType } from "./types";
import { sanitizeModuleClasses } from "../../../utils/cssUtils";

type Props = TimelineItemProps & {
  markerType: TimelineMarkerType;
  order: number;
  textAlign: NonNullable<TimelineDefaultableProps["textAlign"]>;
  first: boolean;
  last: boolean;
};

const TimelineItem = memo((props: Props) => {
  const { title, content, icon = "motif_ui", variant, disabled, markerType, order, appearance = "filled", textAlign, first, last } = props;

  const itemClasses = sanitizeModuleClasses(styles, "item", variant, appearance, disabled && "disabled", order % 2 === 1 && "odd");
  // The connection line: after the marker when the text starts there (not on the last item), before it when the text ends
  // there (not on the first), half lines on both sides when centered (the outer halves of the ends stay empty)
  const markerClasses = sanitizeModuleClasses(
    styles,
    "marker",
    textAlign === "start" && !last && "lineAfter",
    textAlign === "end" && !first && "lineBefore",
    textAlign === "center" && "halfLines",
    textAlign === "center" && first && "fadeStart",
    textAlign === "center" && last && "fadeEnd",
  );
  const sectionClasses = sanitizeModuleClasses(
    styles,
    "section",
    textAlign === "start" && !last && "spaceAfter",
    textAlign === "end" && !first && "spaceBefore",
  );

  return (
    <div className={itemClasses}>
      <div className={markerClasses}>
        {markerType === "icon" ? (
          <span className={styles.markerIconWrapper}>
            <GlobalIconWrapper icon={icon} className={styles.markerIcon} />
          </span>
        ) : markerType === "number" ? (
          <span className={styles.markerNumber}>{order}</span>
        ) : (
          <span className={styles.markerDot} />
        )}
      </div>
      {(title || content) && (
        <div className={sectionClasses}>
          {title && <span className={styles.title}>{title}</span>}
          {content && <span className={styles.content}>{content}</span>}
        </div>
      )}
    </div>
  );
});

export default TimelineItem;
