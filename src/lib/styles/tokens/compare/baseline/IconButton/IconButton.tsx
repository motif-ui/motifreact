import styles from "./IconButtonBaseline.module.scss";
import { PropsWithRef } from "../../../../../types";
import { useMotifContext } from "../../../../../motif/context/MotifProvider";
import { IconButtonProps } from "./types";
import usePropsWithThemeDefaults from "../../../../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../../../../utils/cssUtils";
import Icon from "../Icon/Icon";

const IconButton = (props: PropsWithRef<IconButtonProps, HTMLButtonElement>) => {
  const {
    iconClass,
    name,
    size = "md",
    variant = "secondary",
    className,
    style,
    onClick,
    disabled,
    ref,
  } = usePropsWithThemeDefaults("IconButton", props);
  const { baseIconClass } = useMotifContext();

  const classNames = sanitizeModuleRootClasses(styles, className, [size, variant]);
  return (
    <button
      disabled={disabled}
      style={style}
      data-testid="iconButtonTestId"
      className={classNames}
      onClick={onClick}
      type="button"
      ref={ref}
    >
      {name && (
        <Icon
          className={styles[size]}
          iconClass={iconClass ?? baseIconClass}
          {...(typeof name === "string" ? { name } : { children: name })}
        />
      )}
    </button>
  );
};

IconButton.displayName = "IconButton";
export default IconButton;
