import styles from "@/components/DataView/DataView.module.scss";
import Icon from "@/components/Icon";
import { sanitizeModuleClassesWithOptions } from "../../../utils/cssUtils";
import { DataViewItemProps } from "@/components/DataView/types";
import { PropsWithRefAndChildren } from "../../types";

const DataViewItem = (props: PropsWithRefAndChildren<DataViewItemProps, HTMLDivElement>) => {
  const { label, value, icon, variant, style, className, children, ref } = props;
  const classNames = sanitizeModuleClassesWithOptions(styles, { externalClasses: [className] }, "item", variant);

  return (
    <div className={classNames} ref={ref} style={style}>
      <span className={styles.title}>
        {icon && <Icon name={icon} className={styles.icon} />}
        {label}
      </span>
      {children ? <div className={styles.value}>{children}</div> : <span className={styles.value}>{value}</span>}
    </div>
  );
};

DataViewItem.displayName = "DataView.Item";
export default DataViewItem;
