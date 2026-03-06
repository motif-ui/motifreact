import { createContext, PropsWithChildren, useState } from "react";
import { TabContextProps, TabProviderProps } from "@/components/Tab/types";

export const TabContext = createContext<TabContextProps>({});

const TabProvider = (props: PropsWithChildren<TabProviderProps>) => {
  const { children, initialSelectedTabId, onTabChange } = props;

  const [selectedTabId, setSelectedTabId] = useState(initialSelectedTabId);

  const tabClickHandler = (tabId: string) => {
    setSelectedTabId(tabId);
    onTabChange?.(tabId);
  };

  return <TabContext value={{ selectedTabId, tabClickHandler }}>{children}</TabContext>;
};

export default TabProvider;
