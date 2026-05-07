import { HTMLAttributes, PropsWithChildren, useContext } from "react";
import { TabContext } from "../TabProvider";
import { TabPanelProps } from "../types";
import styles from "../Tab.module.scss";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";

const TabPanel = (props: PropsWithChildren<TabPanelProps & HTMLAttributes<HTMLDivElement>>) => {
  const { id, children, className, style } = props;
  const { selectedTabId } = useContext(TabContext);

  const classNames = sanitizeModuleClasses(styles, "panelWrapper");

  return id === selectedTabId ? (
    <div className={`${classNames} ${className ?? ""}`.trim()} style={style}>
      {children}
    </div>
  ) : null;
};

TabPanel.displayName = "TabPanel";
export default TabPanel;
