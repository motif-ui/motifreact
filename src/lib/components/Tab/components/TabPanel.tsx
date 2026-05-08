import { useContext } from "react";
import { TabContext } from "../TabProvider";
import { TabPanelProps } from "../types";
import styles from "../Tab.module.scss";
import { sanitizeModuleClassesWithOptions } from "../../../../utils/cssUtils";
import { StandardPropsWithChildren } from "src/lib/types.ts";

const TabPanel = (props: StandardPropsWithChildren<TabPanelProps>) => {
  const { id, children, className, style } = props;
  const { selectedTabId } = useContext(TabContext);

  const classNames = sanitizeModuleClassesWithOptions(styles, { externalClasses: [className] }, "panelWrapper");

  return id === selectedTabId ? (
    <div className={classNames} style={style}>
      {children}
    </div>
  ) : null;
};

TabPanel.displayName = "TabPanel";
export default TabPanel;
