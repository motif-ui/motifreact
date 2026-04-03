import styles from "./Avatar.module.scss";
import Icon from "@/components/Icon/Icon";
import { PropsWithRef } from "../../types";
import { MotifIcon } from "@/components/Motif/Icon";
import { AvatarProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";

const Avatar = (props: PropsWithRef<AvatarProps, HTMLDivElement>) => {
  const { icon, letters, image, size = "md", variant = "secondary", className, ref, style } = usePropsWithThemeDefaults("Avatar", props);

  const mode = image ? "image" : letters ? "letters" : "icon";
  const classNameAvatar = sanitizeModuleRootClasses(styles, className, [size, variant, mode]);

  return (
    <div className={classNameAvatar} style={style} ref={ref} data-testid="avatarItem">
      {image ? (
        <>
          <img src={image} alt="Avatar Image" />
          <MotifIcon name="imagesmode" className={styles.imagePlaceholder} />
        </>
      ) : letters ? (
        <span>{letters.toUpperCase().substring(0, size === "xs" || size === "sm" ? 1 : 2)}</span>
      ) : icon ? (
        typeof icon === "string" ? (
          <Icon name={icon} />
        ) : (
          icon
        )
      ) : (
        <MotifIcon name="person" />
      )}
    </div>
  );
};

Avatar.displayName = "Avatar";
export default Avatar;
