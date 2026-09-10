import { memo } from "react";
import styles from "../Carousel.module.scss";
import { MotifIconButton } from "@/components/Motif/Icon";

type Props = {
  onNextClick: () => void;
  onPrevClick: () => void;
};

const CarouselControlButtons = memo(({ onNextClick, onPrevClick }: Props) => {
  return (
    <>
      <MotifIconButton name="arrow_forward_ios" className={styles.prev} size="xxl" onClick={onPrevClick} />
      <MotifIconButton name="arrow_forward_ios" className={styles.next} size="xxl" onClick={onNextClick} />
    </>
  );
});

export default CarouselControlButtons;
