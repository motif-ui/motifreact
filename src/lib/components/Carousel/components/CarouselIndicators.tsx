import styles from "../Carousel.module.scss";
import { IndicatorShape } from "../types";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";

type Props = {
  shape: IndicatorShape;
  currentIndex: number;
  itemCount: number;
  goToSlide: (index: number) => void;
};

const CarouselIndicators = (props: Props) => {
  const { shape, currentIndex, itemCount, goToSlide } = props;

  return (
    <ul className={`${styles.indicators} ${styles[shape]}`}>
      {Array.from({ length: itemCount }).map((_, index) => (
        <li key={index} className={sanitizeModuleClasses(styles, index === currentIndex && "active")} onClick={() => goToSlide(index)} />
      ))}
    </ul>
  );
};

export default CarouselIndicators;
