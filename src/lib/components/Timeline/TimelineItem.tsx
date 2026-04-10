import { memo } from "react";
import Icon from "../Icon";
import styles from "./Timeline.module.scss";
import { TimelineItemProps, TimelineMarkerType } from "./types";
import { sanitizeModuleClasses } from "../../../utils/cssUtils";

type Props = TimelineItemProps & {
  markerType: TimelineMarkerType;
  order: number;
};

const TimelineItem = memo((props: Props) => {
  const { title, content, icon = "motif_ui", variant, disabled, markerType, order, appearance = "filled" } = props;

  const itemClasses = sanitizeModuleClasses(styles, "item", variant, appearance, disabled && "disabled");

  return (
    <div className={itemClasses}>
      <div className={styles.marker}>
        {markerType === "icon" ? (
          <Icon name={icon} className={styles.markerIcon} />
        ) : markerType === "number" ? (
          <span className={styles.markerNumber}>{order}</span>
        ) : (
          <span className={styles.markerDot} />
        )}
      </div>
      {(title || content) && (
        <div className={styles.section}>
          {title && <span className={styles.title}>{title}</span>}
          {content && <span className={styles.content}>{content}</span>}
        </div>
      )}
    </div>
  );
});

export default TimelineItem;
