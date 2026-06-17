import type { ReactElement } from "react";
import styles from "../NavBar.module.scss";

export type NavBarLogoProps = {
  imgPath?: string;
  alt?: string;
  href?: string;
  image?: ReactElement;
};

const NavBarLogo = (props: NavBarLogoProps) => {
  const { href, imgPath, alt, image } = props;
  const logoContent = image ? image : <img src={imgPath} alt={alt} />;

  return href ? (
    <a href={href} className={styles.logo}>
      {logoContent}
    </a>
  ) : (
    <div className={styles.logo}>{logoContent}</div>
  );
};
export default NavBarLogo;
