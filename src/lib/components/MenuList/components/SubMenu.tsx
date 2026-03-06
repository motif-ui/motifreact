import styles from "../MenuList.module.scss";
import { SubMenuProps } from "@/components/MenuList/types";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";

export const subMenuRenderer = (props: SubMenuProps) => <SubMenu {...props} />;

const SubMenu = (props: SubMenuProps) => {
  const { level, items, parentMenuId, menuItemRenderer } = props;
  const classNames = sanitizeModuleClasses(styles, "subMenu", level === 1 && "firstLevel");

  return (
    <ul className={classNames}>
      {items.map((item, index) =>
        menuItemRenderer({
          ...item,
          level,
          id: `${parentMenuId}-${index}`,
          subMenuRenderer,
        }),
      )}
    </ul>
  );
};

export default SubMenu;
