import styles from "../Dropdown.module.scss";
import { DropdownMenuItemProps } from "@/components/Dropdown/types";
import DropdownMenuItem from "@/components/Dropdown/components/DropdownMenuItem";

type Props = {
  items: DropdownMenuItemProps[];
};

const DropdownMenu = ({ items }: Props) => {
  return (
    <ul className={styles.Menu}>
      {items.map((item, index) => (
        <DropdownMenuItem key={index} {...item} />
      ))}
    </ul>
  );
};

export default DropdownMenu;
