import styles from "../Dropdown.module.scss";
import { DropdownMenuItemProps, Spacing } from "@/components/Dropdown/types";
import DropdownMenuItem from "@/components/Dropdown/components/DropdownMenuItem";
import { useContext, useLayoutEffect, useRef } from "react";
import { DropdownContext } from "@/components/Dropdown/context/DropdownProvider";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";

type Props = {
  items: DropdownMenuItemProps[];
  spacing: Spacing;
};

const DropdownMenu = ({ items, spacing }: Props) => {
  const ref = useRef<HTMLUListElement>(null);
  const { open } = useContext(DropdownContext);

  useLayoutEffect(() => {
    if (ref.current) {
      const { left } = ref.current.getBoundingClientRect();
      const offsetHorizontal = window.visualViewport?.offsetLeft ?? window.scrollX;
      if (left < offsetHorizontal) {
        ref.current.classList.add(styles.leftOverflow);
      } else {
        ref.current.classList.remove(styles.leftOverflow);
      }
    }
  }, [open]);

  const classNames = sanitizeModuleClasses(styles, ["Menu", spacing]);

  return (
    <ul className={classNames} ref={ref}>
      {items.map((item, index) => (
        <DropdownMenuItem key={index} {...item} />
      ))}
    </ul>
  );
};

export default DropdownMenu;
