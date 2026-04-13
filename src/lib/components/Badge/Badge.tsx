import styles from "./Badge.module.scss";
import GlobalIconWrapper from "../Motif/Icon/components/GlobalIconWrapper";
import { PropsWithRefAndChildren } from "../../types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { BadgeProps } from "./types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";

const Badge = (props: PropsWithRefAndChildren<BadgeProps, HTMLDivElement>) => {
  const {
    variant = "primary",
    content,
    icon,
    dot,
    align = "top-right",
    max = 999,
    children,
    className,
    style,
    ref,
  } = usePropsWithThemeDefaults("Badge", props);

  const contentToRender = icon ? (
    <GlobalIconWrapper icon={icon} className={styles.icon} />
  ) : content ? (
    max > 0 && Number(content) > max ? (
      max + "+"
    ) : (
      content
    )
  ) : null;
  const classNames = sanitizeModuleRootClasses(styles, className, [variant, align, dot && "dot"]);

  return (
    children && (
      <div className={classNames} ref={ref} style={style}>
        {children}
        {(dot || contentToRender) && (
          <span className={styles.badge} data-testid="badgeItem">
            {!dot && contentToRender}
          </span>
        )}
      </div>
    )
  );
};

Badge.displayName = "Badge";
export default Badge;
