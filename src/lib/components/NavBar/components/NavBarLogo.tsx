import styles from "../NavBar.module.scss";

export type NavBarLogoProps = {
  imgPath: string;
  alt?: string;
  href?: string;
};

const NavBarLogo = (props: NavBarLogoProps) => {
  const { href, imgPath, alt } = props;
  return href ? (
    <a href={href} className={styles.logo}>
      <img src={imgPath} alt={alt} />
    </a>
  ) : (
    <img src={imgPath} alt={alt} className={styles.logo} />
  );
};
export default NavBarLogo;
