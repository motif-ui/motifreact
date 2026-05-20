import styles from "../Tab.module.scss";
import GlobalIconWrapper from "../../Motif/GlobalIconWrapper/GlobalIconWrapper";
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
      {icon && <GlobalIconWrapper icon={icon} className={styles["tabItem-icon"]} />}
      {title && <span className={styles["tabItem-title"]}>{title}</span>}
    </button>
  );
};

export default TabItem;
