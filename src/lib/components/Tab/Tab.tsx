"use client";

import styles from "./Tab.module.scss";
import TabPanel from "./components/TabPanel";
import { TabProps } from "./types";
import TabItem from "@/components/Tab/components/TabItem";
import { PropsWithRef } from "../../types";
import TabProvider from "@/components/Tab/TabProvider";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";

const TabComponent = (props: PropsWithRef<TabProps, HTMLDivElement>) => {
  const {
    tabs,
    children,
    onTabChange,
    defaultTabId,
    type = "underline",
    position = "fill",
    ref,
    style,
    className,
  } = usePropsWithThemeDefaults("Tab", props);

  const initalSelectedTabId = defaultTabId || tabs[0]?.id;
  const classNames = sanitizeModuleRootClasses(styles, className, [type, position]);

  return (
    <div className={classNames} ref={ref} style={style}>
      <TabProvider initialSelectedTabId={initalSelectedTabId} onTabChange={onTabChange}>
        <div className={styles.tabHeader}>
          {tabs.map(item => (
            <TabItem {...item} key={item.id} />
          ))}
        </div>
        <div>{children}</div>
      </TabProvider>
    </div>
  );
};

const Tab = Object.assign(TabComponent, { Panel: TabPanel, displayName: "Tab" });
export default Tab;
