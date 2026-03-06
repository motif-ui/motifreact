import styles from "../Tab.module.scss";
import Icon from "@/components/Icon";
import { TabItemProps } from "@/components/Tab/types";
import { useContext } from "react";
import { TabContext } from "@/components/Tab/TabProvider";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";

const TabItem = (props: TabItemProps) => {
  const { title, id, icon, disabled } = props;
  const { selectedTabId, tabClickHandler } = useContext(TabContext);

  const tabItemClass = sanitizeModuleClasses(styles, "tabItem", !disabled && selectedTabId === id && "active");

  return (
    <button key={id} className={tabItemClass} disabled={disabled} onClick={() => tabClickHandler?.(id)}>
      {icon && <Icon className={styles["tabItem-icon"]} name={icon} size="md" />}
      {title && <span className={styles["tabItem-title"]}>{title}</span>}
    </button>
  );
};

export default TabItem;
