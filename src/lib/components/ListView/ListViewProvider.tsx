"use client";

import { createContext, PropsWithChildren, useCallback, useState } from "react";
import { ListViewContextType, ListViewProviderProps } from "@/components/ListView/types";

export const ListViewContext = createContext<ListViewContextType>({ size: "md" });

export const ListViewProvider = (props: PropsWithChildren<ListViewProviderProps>) => {
  const { size, selectable, enableDividers, disableAvatars, children, onSelectionChange, enableMultiLine } = props;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectHandler = useCallback(
    (id: string, selected: boolean) => {
      const updatedIds = selected ? [...selectedIds, id] : selectedIds.filter(i => i !== id);
      setSelectedIds(updatedIds);
      onSelectionChange?.({
        current: { id, selected },
        selectedIds: updatedIds,
      });
    },
    [onSelectionChange, selectedIds],
  );

  return (
    <ListViewContext value={{ size, selectable, enableDividers, disableAvatars, selectHandler, enableMultiLine }}>
      {children}
    </ListViewContext>
  );
};
