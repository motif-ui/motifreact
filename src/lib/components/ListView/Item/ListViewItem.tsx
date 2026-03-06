import { useContext } from "react";
import styles from "../ListView.module.scss";
import { ListViewContext } from "../ListViewProvider";
import CenterContent from "@/components/ListView/Item/components/CenterContent";
import LeftContent from "@/components/ListView/Item/components/LeftContent";
import Icon from "@/components/Icon";
import { ListViewItemProps } from "@/components/ListView/types";
import { PropsWithRefAndChildren } from "../../../types";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";

const ListViewItem = (props: PropsWithRefAndChildren<ListViewItemProps, HTMLLIElement>) => {
  const { id, title, description, alternateText, icon, image, abbr, iconRight, href, onClick, disabled, ref, style } = props;
  const { size, enableDividers, enableMultiLine } = useContext(ListViewContext);

  const renderItemContent = () => (
    <>
      <LeftContent id={id} icon={icon} image={image} abbr={abbr} />
      <CenterContent title={title} description={description} alternateText={alternateText} />
      {iconRight && (
        <Icon className={styles.iconRight} variant="secondary" name={iconRight} size={size === "sm" ? "md" : size === "lg" ? "xl" : "lg"} />
      )}
    </>
  );

  const baseClassNames = sanitizeModuleClasses(
    styles,
    "listItem",
    enableDividers && "divider",
    disabled && "disabled",
    enableMultiLine && "multiLine",
    href ? "link" : onClick && "button",
  );

  return (
    <li ref={ref} className={baseClassNames} data-testid="listViewItem" style={style}>
      {href && !disabled ? (
        <a href={href} className={styles.baseContent}>
          {renderItemContent()}
        </a>
      ) : (
        <div className={styles.baseContent} {...(onClick && !disabled && { onClick, role: "button", tabIndex: 0 })}>
          {renderItemContent()}
        </div>
      )}
    </li>
  );
};

ListViewItem.displayName = "ListViewItem";
export default ListViewItem;
