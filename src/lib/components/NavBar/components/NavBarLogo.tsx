import type { ReactElement } from "react";
import styles from "../NavBar.module.scss";

export type NavBarLogoProps = {
  image: ReactElement;
  href?: string;
};

const NavBarLogo = (props: NavBarLogoProps) => {
  const { href, image } = props;
  return href ? (
    <a href={href} className={styles.logo}>
      {image}
    </a>
  ) : (
    <div className={styles.logo}>{image}</div>
  );
};
export default NavBarLogo;
