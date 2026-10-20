import styles from "../Dropdown.module.scss";
import { DropdownMenuItemProps, Spacing } from "@/components/Dropdown/types";
import DropdownMenuItem from "@/components/Dropdown/components/DropdownMenuItem";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";

type Props = {
  items: DropdownMenuItemProps[];
  spacing: Spacing;
};

const DropdownMenu = ({ items, spacing }: Props) => {
  const classNames = sanitizeModuleClasses(styles, ["Menu", spacing]);

  return (
    <ul className={classNames}>
      {items.map((item, index) => (
        <DropdownMenuItem key={index} {...item} />
      ))}
    </ul>
  );
};

export default DropdownMenu;
