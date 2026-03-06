import styles from "./Card.module.scss";
import CardHeader from "@/components/Card/components/CardHeader";
import CardContent from "@/components/Card/components/CardContent";
import CardActions from "@/components/Card/components/CardActions";
import { PropsWithRefAndChildren } from "../../types";
import { CardProps } from "./types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";

const Card = (props: PropsWithRefAndChildren<CardProps, HTMLDivElement>) => {
  const {
    outlined,
    elevated,
    avatarText,
    contentText,
    contentAlternateButton,
    contentActionButton,
    contentActionLink,
    action,
    contentSubtitle,
    subtitle,
    contentTitle,
    title,
    contentImage,
    contentLink,
    image,
    imagePosition = "left",
    icon,
    buttons,
    variant = "secondary",
    children,
    className,
    style,
    ref,
  } = usePropsWithThemeDefaults("Card", props);

  const classNames = sanitizeModuleRootClasses(styles, className, [variant, outlined && "outlined", elevated && "elevated"]);

  return (
    <div className={classNames} ref={ref} style={style}>
      <CardHeader
        title={title}
        subtitle={subtitle}
        avatarText={avatarText}
        icon={icon}
        imagePosition={imagePosition}
        image={image}
        action={action}
        variant={variant}
      />
      <CardContent text={contentText} title={contentTitle} subtitle={contentSubtitle} image={contentImage} link={contentLink}>
        {children}
      </CardContent>
      <CardActions
        actionButton={contentActionButton}
        alternateButton={contentAlternateButton}
        buttons={buttons}
        actionLink={contentActionLink}
      />
    </div>
  );
};

Card.displayName = "Card";
export default Card;
