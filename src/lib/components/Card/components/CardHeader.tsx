"use client";

import { useRef } from "react";
import { createPortal } from "react-dom";
import styles from "../Card.module.scss";
import Avatar from "@/components/Avatar";
import IconButton from "@/components/IconButton";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";
import type { MouseEvent } from "react";
import type { IconGlobalType, Variant } from "../../../types";
import ImageView from "@/components/ImageView";
import GlobalIconWrapper from "../../Motif/GlobalIconWrapper/GlobalIconWrapper";
import useAnchoredOverlay from "../../../hooks/useAnchoredOverlay";
import type { CardDropdownItem, CardHeaderAction, CardVariant } from "../types";

type Props = {
  icon?: IconGlobalType;
  iconVariant?: Variant;
  avatarIcon?: IconGlobalType;
  avatarText?: string;
  title?: string;
  subtitle?: string;
  image?: string;
  imagePosition?: "left" | "right";
  action?: CardHeaderAction;
  variant: CardVariant;
};

const CardHeader = (props: Props) => {
  const { icon, iconVariant, avatarIcon, avatarText, action, image, imagePosition, subtitle, title, variant } = props;
  const menuItems = action?.items;

  const actionRef = useRef<HTMLButtonElement>(null);
  const {
    attached,
    hide,
    style: menuStyle,
    placement,
    overlayRef: menuRef,
    insideProps,
  } = useAnchoredOverlay({
    anchorRef: actionRef,
    placement: "bottomRight",
    toggleOnAnchorClick: !!menuItems,
    tabBridge: true,
    closeOnOutsideClick: true,
    closeOnEscape: true,
    inactive: !menuItems,
  });

  const isVisible = title || subtitle || avatarText || avatarIcon || icon || image || action;
  const iconButtonVariant = variant === "neutral" || variant === "secondary" ? "secondary" : variant === "warning" ? "strong" : "negative";
  const headerClassName = sanitizeModuleClasses(styles, "header", image && imagePosition === "right" && "headerImageAlignRight");
  const headerIconClassName = sanitizeModuleClasses(styles, "headerIcon", iconVariant && `headerIcon-${iconVariant}`);

  const menuClassNames = sanitizeModuleClasses(styles, "dropdown", placement.startsWith("top") ? "top" : "bottom");

  const handleItemClick = (item: CardDropdownItem) => (event: MouseEvent<HTMLButtonElement>) => {
    item.onClick?.(event);
    hide();
  };

  const maybeContent = title || subtitle || avatarText || avatarIcon || icon || action;

  return (
    isVisible && (
      <div className={headerClassName} data-testid="cardHeader">
        {image && <ImageView solid src={image} aspectRatio={1} alt={title ?? subtitle ?? ""} />}
        {maybeContent && (
          <div className={styles.headerContainer}>
            {icon && <GlobalIconWrapper icon={icon} className={headerIconClassName} />}
            {avatarIcon && <Avatar icon={avatarIcon} size="lg" className={styles.avatar} />}
            {avatarText && <Avatar letters={avatarText} size="lg" className={styles.avatar} />}
            {(title || subtitle) && (
              <div className={styles.headerContent}>
                {title && <span className={styles.headerTitle}>{title}</span>}
                {subtitle && <span className={styles.headerSubtitle}>{subtitle}</span>}
              </div>
            )}
            {action && <IconButton ref={actionRef} name={action.icon} onClick={action.onClick} size="xxl" variant={iconButtonVariant} />}
          </div>
        )}
        {menuItems &&
          attached &&
          createPortal(
            <div className={menuClassNames} style={menuStyle} ref={menuRef} {...insideProps} data-testid="cardDropdown">
              <ul className={styles.dropdownList}>
                {menuItems.map((item, index) => (
                  <li key={index}>
                    {item.header ? (
                      <span className={styles.dropdownHeader}>{item.header}</span>
                    ) : (
                      <button type="button" className={styles.dropdownItem} disabled={item.disabled} onClick={handleItemClick(item)}>
                        {item.icon && <GlobalIconWrapper icon={item.icon} style={{ color: item.iconColor }} />}
                        {item.label && <span>{item.label}</span>}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>,
            document.body,
          )}
      </div>
    )
  );
};

export default CardHeader;
