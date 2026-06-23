import { PropsWithChildren } from "react";
import styles from "../NavBar.module.scss";

export type NavBarLogoProps = {
  imgPath?: string;
  alt?: string;
  href?: string;
};

const NavBarLogo = ({ children, imgPath, alt, href }: PropsWithChildren<NavBarLogoProps>) => {
  const logoContent =
    children ||
    (imgPath &&
      (href ? (
        <a href={href}>
          <img src={imgPath} alt={alt} />
        </a>
      ) : (
        <img src={imgPath} alt={alt} />
      )));

  return logoContent ? <div className={styles.logo}>{logoContent}</div> : null;
};

export default NavBarLogo;
