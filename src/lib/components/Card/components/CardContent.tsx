import styles from "../Card.module.scss";
import { PropsWithChildren } from "react";
import ImageView from "@/components/ImageView";

type Props = {
  title?: string;
  subtitle?: string;
  text?: string;
  image?: string;
  link?: { text: string; href: string; targetBlank?: boolean };
};

const CardContent = (props: PropsWithChildren<Props>) => {
  const { title, subtitle, text, image, link, children } = props;

  const titleContainerVisible = title || subtitle;
  const textContainerVisible = text || titleContainerVisible || link || children;
  const isVisible = textContainerVisible || image || children;

  return (
    isVisible && (
      <div className={styles.content} data-testid="cardContent">
        {image && <ImageView width="100%" aspectRatio={2} solid src={image} alt={title ?? subtitle ?? ""} />}
        {textContainerVisible && (
          <div className={styles.contentContainer}>
            {titleContainerVisible && (
              <div className={styles.contentTitleContainer}>
                {title && <span className={styles.contentTitle}>{title}</span>}
                {subtitle && <span className={styles.contentSubtitle}>{subtitle}</span>}
              </div>
            )}
            {text && <p className={styles.contentText}>{text}</p>}
            {link && (
              <a href={link.href} className={styles.contentLink} {...(link.targetBlank && { target: "_blank" })}>
                {link.text}
              </a>
            )}
            {children}
          </div>
        )}
      </div>
    )
  );
};

export default CardContent;
