import { memo } from "react";
import styles from "./IconButton.module.scss";
import { PropsWithRef } from "../../types";
import { useMotifContext } from "../../motif/context/MotifProvider";
import { IconButtonProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import GlobalIconWrapper from "../Motif/GlobalIconWrapper/GlobalIconWrapper";
import { createElementPropsComparator } from "../../../utils/reactUtils";

const arePropsEqual = createElementPropsComparator<PropsWithRef<IconButtonProps, HTMLButtonElement>>("name");

const IconButton = memo((props: PropsWithRef<IconButtonProps, HTMLButtonElement>) => {
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
      {name && <GlobalIconWrapper icon={name} className={styles[size]} iconClass={iconClass ?? baseIconClass} />}
    </button>
  );
}, arePropsEqual);

IconButton.displayName = "IconButton";
export default IconButton;
