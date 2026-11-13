import styles from "../Dropdown.module.scss";
import { DropdownMenuItemProps } from "@/components/Dropdown/types";
import DropdownMenuItem from "@/components/Dropdown/components/DropdownMenuItem";

type Props = {
  items: DropdownMenuItemProps[];
  hideMenu: () => void;
};

const DropdownMenu = ({ items, hideMenu }: Props) => {
  return (
    <ul className={styles.Menu}>
      {items.map((item, index) => (
        <DropdownMenuItem key={index} {...item} hideMenu={hideMenu} />
      ))}
    </ul>
  );
};

export default DropdownMenu;
