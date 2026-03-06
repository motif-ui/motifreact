import { Children, ReactElement } from "react";
import styles from "./ListView.module.scss";
import ListViewItem from "./Item/ListViewItem";
import { ListViewProvider } from "@/components/ListView/ListViewProvider";
import { ListViewItemProps, ListViewProps } from "./types";
import { PropsWithRef } from "../../types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";

const ListViewComponent = (props: PropsWithRef<ListViewProps, HTMLUListElement>) => {
  const {
    children,
    size = "md",
    disableAvatars,
    enableDividers,
    selectable,
    onSelectionChange,
    enableMultiLine,
    className,
    style,
    ref,
  } = usePropsWithThemeDefaults("ListView", props);

  const items = Children.toArray(children) as ReactElement<ListViewItemProps>[];
  const classNames = sanitizeModuleRootClasses(styles, className, [size]);

  return (
    <ul className={classNames} style={style} ref={ref}>
      <ListViewProvider
        size={size}
        selectable={!!selectable}
        enableDividers={!!enableDividers}
        disableAvatars={!!disableAvatars}
        onSelectionChange={onSelectionChange}
        enableMultiLine={enableMultiLine}
      >
        {items}
      </ListViewProvider>
    </ul>
  );
};

const ListView = Object.assign(ListViewComponent, { Item: ListViewItem, displayName: "ListView" });
export default ListView;
