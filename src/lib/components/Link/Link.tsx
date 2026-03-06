import styles from "./Link.module.scss";
import Icon from "../Icon";
import { PropsWithRef } from "../../types";
import { MotifIcon } from "@/components/Motif/Icon";
import { LinkProps } from "../Link/types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";

const Link = (props: PropsWithRef<LinkProps, HTMLAnchorElement>) => {
  const {
    label,
    disabled,
    url,
    external,
    targetBlank,
    size = "md",
    icon,
    iconPosition = "right",
    underline,
    onClick,
    className,
    style,
    ref,
  } = usePropsWithThemeDefaults("Link", props);

  const classNames = sanitizeModuleRootClasses(styles, className, [
    size,
    disabled && "disabled",
    underline && "underline",
    iconPosition === "right" ? "rightIcon" : "leftIcon",
  ]);

  const iconSize = size === "sm" ? "xxs" : size === "md" ? "sm" : size;

  return (
    (label || url) && (
      <a
        href={url}
        data-testid="linkComponent"
        className={classNames}
        onClick={onClick}
        target={targetBlank ? "_blank" : "_self"}
        rel={targetBlank ? "noopener noreferrer" : ""}
        ref={ref}
        style={style}
      >
        {external ? (
          <MotifIcon name="external" size={iconSize} className={styles.icon} />
        ) : icon ? (
          <Icon name={icon} size={iconSize} className={styles.icon} />
        ) : null}
        <span className={styles.label}>{label || url}</span>
      </a>
    )
  );
};

Link.displayName = "Link";
export default Link;
