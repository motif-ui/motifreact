import { memo, useContext } from "react";
import Checkbox from "@/components/Checkbox";
import Icon from "@/components/Icon";
import styles from "../../ListView.module.scss";
import { ListViewContext } from "@/components/ListView/ListViewProvider";
import { sanitizeModuleClasses } from "../../../../../utils/cssUtils";

type Props = {
  id?: string;
  icon?: string;
  image?: string;
  abbr?: string;
};

const LeftContent = memo((props: Props) => {
  const { id, icon, image, abbr } = props;
  const { size, selectable, disableAvatars, selectHandler } = useContext(ListViewContext);

  if (selectable && !id) {
    throw new Error("id is required when selectable is true");
  }

  const baseClasses = sanitizeModuleClasses(
    styles,
    "leftContent",
    !disableAvatars && "avatar",
    !selectable && (icon ? "icon" : image ? "image" : abbr && "abbr"),
  );

  return selectable ? (
    <Checkbox className={baseClasses} size={size} onChange={val => selectHandler?.(id!, Boolean(val))} />
  ) : icon ? (
    <div className={baseClasses}>
      <Icon className={`${styles.icon}`} name={icon} size={size} />
    </div>
  ) : image ? (
    <div className={baseClasses}>
      <img src={image} alt={id} />
    </div>
  ) : abbr ? (
    <span className={baseClasses}>{abbr.substring(0, 2)}</span>
  ) : null;
});

export default LeftContent;
