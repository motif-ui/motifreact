import styles from "./Carousel.module.scss";
import type { CarouselProps } from "./types";
import { sanitizeModuleRootClasses } from "src/utils/cssUtils";
import type { PropsWithRefAndChildren } from "../../types";
import CarouselIndicators from "./components/CarouselIndicators";
import CarouselItem from "./components/CarouselItem";
import usePropsWithThemeDefaults from "src/lib/motif/hooks/usePropsWithThemeDefaults";
import CarouselControlButtons from "./components/CarouselControlButtons";
import { useCarousel } from "./useCarousel";

const CarouselComponent = (props: PropsWithRefAndChildren<CarouselProps, HTMLDivElement>) => {
  const {
    height,
    removeControls,
    removeIndicators,
    indicatorShape = "dot",
    theme = "light",
    activeIndex,
    autoplay,
    autoplayInterval = 3000,
    pauseOnHover,
    className,
    style,
    ref,
    children,
  } = usePropsWithThemeDefaults("Carousel", props);

  const totalItems = Array.isArray(children) ? children.length : 0;
  const { currentIndex, goToNext, goToPrev, goToSlide, onMouseEnter, onMouseLeave } = useCarousel({
    totalItems,
    activeIndex,
    autoplay,
    autoplayInterval,
    pauseOnHover,
  });

  const classNames = sanitizeModuleRootClasses(styles, className, [theme]);

  return (
    <div className={classNames} ref={ref} style={{ height, ...style }} {...(autoplay && pauseOnHover && { onMouseEnter, onMouseLeave })}>
      <div className={styles.track} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {children}
      </div>

      {!removeIndicators && (
        <CarouselIndicators shape={indicatorShape} currentIndex={currentIndex} itemCount={totalItems} goToSlide={goToSlide} />
      )}
      {!removeControls && <CarouselControlButtons onNextClick={goToNext} onPrevClick={goToPrev} />}
    </div>
  );
};

const Carousel = Object.assign(CarouselComponent, {
  displayName: "Carousel",
  Item: CarouselItem,
});
export default Carousel;
