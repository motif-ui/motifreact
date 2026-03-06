import styles from "../Carousel.module.scss";
import { PropsWithChildren } from "react";

type Props = {
  title?: string;
  subtitle?: string;
};

const CarouselItem = (props: PropsWithChildren<Props>) => {
  const { title, subtitle, children } = props;

  return (
    <div className={styles.item}>
      {children}
      {(title || subtitle) && (
        <div className={styles.text}>
          {title && <span className={styles.title}>{title}</span>}
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        </div>
      )}
    </div>
  );
};

export default CarouselItem;
