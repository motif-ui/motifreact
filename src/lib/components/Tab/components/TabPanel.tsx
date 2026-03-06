import { PropsWithChildren, useContext } from "react";
import { TabContext } from "../TabProvider";

export type Props = {
  id: string;
};

const TabPanel = (props: PropsWithChildren<Props>) => {
  const { id, children } = props;
  const { selectedTabId } = useContext(TabContext);

  return id === selectedTabId ? children : null;
};

TabPanel.displayName = "TabPanel";
export default TabPanel;
