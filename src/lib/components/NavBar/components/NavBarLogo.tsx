import { PropsWithChildren } from "react";
import styles from "../NavBar.module.scss";

export type NavBarLogoProps = {
  imgPath: string;
  alt?: string;
  href?: string;
};

const NavBarLogo = (props: PropsWithChildren<{ logo?: NavBarLogoProps }>) => {
  const { logo, children } = props;
  const { alt, imgPath, href } = logo || {};
  return (
    <div className={styles.logo}>
      {children ??
        (logo &&
          (href ? (
            <a href={href}>
              <img src={imgPath} alt={alt} />
            </a>
          ) : (
            <img src={imgPath} alt={alt} />
          )))}
    </div>
  );
};

export default NavBarLogo;
