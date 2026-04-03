import styles from "@/components/DataView/DataView.module.scss";
import Icon from "@/components/Icon";
import { sanitizeModuleClasses } from "../../../utils/cssUtils";
import { DataViewItemProps } from "@/components/DataView/types";
import { PropsWithRefAndChildren } from "../../types";

const DataViewItem = (props: PropsWithRefAndChildren<DataViewItemProps, HTMLDivElement>) => {
  const { label, value, icon, variant, style, className, children, ref } = props;
  const classNames = sanitizeModuleClasses(styles, "item", variant, className);

  return (
    <div className={classNames} ref={ref} style={style}>
      <span className={styles.title}>
        {icon && (typeof icon === "string" ? <Icon name={icon} className={styles.icon} /> : <span className={styles.icon}>{icon}</span>)}
        {label}
      </span>
      {children ? <div className={styles.value}>{children}</div> : <span className={styles.value}>{value}</span>}
    </div>
  );
};

DataViewItem.displayName = "DataView.Item";
export default DataViewItem;
