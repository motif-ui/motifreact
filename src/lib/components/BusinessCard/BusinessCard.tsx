import styles from "./BusinessCard.module.scss";
import GlobalIconWrapper from "../Motif/Icon/components/GlobalIconWrapper";
import Avatar from "@/components/Avatar";
import IconButton from "@/components/IconButton";
import { PropsWithRef } from "../../types";
import { BusinessCardProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";

const BusinessCard = (props: PropsWithRef<BusinessCardProps, HTMLDivElement>) => {
  const {
    solid,
    elevated,
    outline,
    title,
    description,
    link,
    image,
    icon,
    position = "center",
    onClick,
    iconButton,
    variant = "neutral",
    ref,
    className,
    style,
  } = usePropsWithThemeDefaults("BusinessCard", props);

  const classNames = sanitizeModuleRootClasses(styles, className, [
    variant,
    position,
    solid && "solid",
    elevated && "elevated",
    outline && "outline",
    onClick && "clickable",
  ]);

  return (
    <div className={classNames} ref={ref} onClick={onClick} style={style}>
      {image && <Avatar image={image} size="xxl" />}
      {icon && <GlobalIconWrapper icon={icon} className={styles.icon} />}
      {title && <span className={styles.title}>{title}</span>}
      {description && <span className={styles.description}>{description}</span>}
      {link && (
        <a className={styles.link} href={link.href} {...(link.targetBlank && { target: "_blank" })}>
          {link.text}
        </a>
      )}
      {iconButton && <IconButton name={iconButton.icon} onClick={iconButton.onClick} size="xxl" className={styles.iconButton} />}
    </div>
  );
};

BusinessCard.displayName = "BusinessCard";
export default BusinessCard;
