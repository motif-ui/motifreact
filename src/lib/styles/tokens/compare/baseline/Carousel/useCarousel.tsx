"use client";

import { useCallback, useEffect, useState } from "react";

type Props = {
  totalItems: number;
  activeIndex?: number;
  autoplay?: boolean;
  autoplayInterval: number;
  pauseOnHover?: boolean;
};

export const useCarousel = ({ totalItems, activeIndex, autoplay, autoplayInterval, pauseOnHover }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(activeIndex ?? 0);
  const [isHovered, setIsHovered] = useState(false);

  const goToNext = useCallback(() => setCurrentIndex(prev => (prev + 1) % totalItems), [totalItems]);
  const goToPrev = useCallback(() => setCurrentIndex(prev => (prev - 1 + totalItems) % totalItems), [totalItems]);
  const goToSlide = useCallback((index: number) => setCurrentIndex(index), []);
  const onMouseEnter = useCallback(() => setIsHovered(true), []);
  const onMouseLeave = useCallback(() => setIsHovered(false), []);

  useEffect(() => {
    if (!autoplay || (pauseOnHover && isHovered)) return;

    const interval = setInterval(goToNext, autoplayInterval);
    return () => clearInterval(interval);
  }, [autoplay, autoplayInterval, goToNext, isHovered, pauseOnHover]);

  return {
    currentIndex: currentIndex >= totalItems ? 0 : currentIndex,
    goToNext,
    goToPrev,
    goToSlide,
    onMouseEnter,
    onMouseLeave,
  };
};
