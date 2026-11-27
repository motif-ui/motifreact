import styles from "../TabBaseline.module.scss";
import GlobalIconWrapper from "../../../../../../components/Motif/GlobalIconWrapper/GlobalIconWrapper";
import { TabItemProps } from "../types";
import { useContext } from "react";
import { TabContext } from "../TabProvider";
import { sanitizeModuleClasses } from "src/utils/cssUtils.ts";

const TabItem = (props: TabItemProps) => {
  const { title, id, icon, disabled } = props;
  const { selectedTabId, tabClickHandler } = useContext(TabContext);

  const tabItemClass = sanitizeModuleClasses(styles, "tabItem", !disabled && selectedTabId === id && "active");

  return (
    <button key={id} className={tabItemClass} disabled={disabled} onClick={() => tabClickHandler?.(id)}>
      {icon && <GlobalIconWrapper icon={icon} className={styles["tabItem-icon"]} size="md" />}
      {title && <span className={styles["tabItem-title"]}>{title}</span>}
    </button>
  );
};

export default TabItem;
