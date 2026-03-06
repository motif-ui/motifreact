import { SelectGroupItem, SelectItem, SelectOrGroupItem } from "@/components/Select/types";

export const filterItems = (items: SelectOrGroupItem[], q: string) => {
  const query = q.toLowerCase();

  const filterItem = (item: SelectItem) => (item.label ?? item.value).toLowerCase().includes(query);

  const filterGroup = (group: SelectGroupItem) => {
    const inGroupLabel = group.groupLabel.toLowerCase().includes(query);
    if (inGroupLabel) {
      return group;
    }

    const filteredItems = group.items.filter(filterItem);
    return filteredItems.length ? { ...group, items: filteredItems } : null;
  };

  return items.reduce<SelectOrGroupItem[]>((acc, item) => {
    if ("groupLabel" in item) {
      const filteredGroup = filterGroup(item);
      return filteredGroup ? [...acc, filteredGroup] : acc;
    } else {
      return filterItem(item) ? [...acc, item] : acc;
    }
  }, []);
};

export const getFilterableValue = ({ label, value }: SelectItem) => label || value;
