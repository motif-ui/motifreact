import styles from "../Card.module.scss";
import Avatar from "@/components/Avatar";
import IconButton from "@/components/IconButton";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";
import type { MouseEvent } from "react";
import type { IconGlobalType } from "../../../types";
import ImageView from "@/components/ImageView";
import GlobalIconWrapper from "../../Motif/GlobalIconWrapper/GlobalIconWrapper";
import { CardVariant } from "@/components/Card/types.ts";

type Props = {
  icon?: IconGlobalType;
  avatarIcon?: IconGlobalType;
  avatarText?: string;
  title?: string;
  subtitle?: string;
  image?: string;
  imagePosition?: "left" | "right";
  action?: { icon: IconGlobalType; onClick: (event: MouseEvent<HTMLButtonElement>) => void };
  variant: CardVariant;
};

const CardHeader = (props: Props) => {
  const { icon, avatarIcon, avatarText, action, image, imagePosition, subtitle, title, variant } = props;

  const isVisible = title || subtitle || avatarText || avatarIcon || icon || image || action;
  const iconButtonVariant = variant === "neutral" || variant === "secondary" ? "secondary" : variant === "warning" ? "strong" : "negative";
  const headerClassName = sanitizeModuleClasses(styles, "header", image && imagePosition === "right" && "headerImageAlignRight");

  const maybeContent = title || subtitle || avatarText || avatarIcon || icon || action;

  return (
    isVisible && (
      <div className={headerClassName} data-testid="cardHeader">
        {image && <ImageView solid src={image} aspectRatio={1} alt={title ?? subtitle ?? ""} />}
        {maybeContent && (
          <div className={styles.headerContainer}>
            {icon && <GlobalIconWrapper icon={icon} size="lg" className={styles.headerIcon} />}
            {avatarIcon && <Avatar icon={avatarIcon} size="lg" className={styles.avatar} />}
            {avatarText && <Avatar letters={avatarText} size="lg" className={styles.avatar} />}
            {(title || subtitle) && (
              <div className={styles.headerContent}>
                {title && <span className={styles.headerTitle}>{title}</span>}
                {subtitle && <span className={styles.headerSubtitle}>{subtitle}</span>}
              </div>
            )}
            {action && <IconButton name={action.icon} onClick={action.onClick} size="xxl" variant={iconButtonVariant} />}
          </div>
        )}
      </div>
    )
  );
};

export default CardHeader;
