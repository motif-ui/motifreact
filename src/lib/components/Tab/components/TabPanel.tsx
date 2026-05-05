import { PropsWithChildren, useContext } from "react";
import { TabContext } from "../TabProvider";
import { TabPanelProps } from "../types";
import styles from "../Tab.module.scss";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";

const TabPanel = (props: PropsWithChildren<TabPanelProps>) => {
  const { id, children, className, style } = props;
  const { selectedTabId } = useContext(TabContext);

  const classNames = sanitizeModuleClasses(styles, "panelWrapper", className);

  return id === selectedTabId ? (
    <div className={classNames} style={style}>
      {children}
    </div>
  ) : null;
};

TabPanel.displayName = "TabPanel";
export default TabPanel;
