export type Theme = "light" | "dark";
export type IndicatorShape = "dot" | "line";

export type CarouselProps = {
  activeIndex?: number;
  height?: number | string;
} & CarouselDefaultableProps;

export type CarouselDefaultableProps = {
  removeIndicators?: boolean;
  indicatorShape?: IndicatorShape;
  removeControls?: boolean;
  theme?: Theme;
  autoplay?: boolean;
  autoplayInterval?: number;
  pauseOnHover?: boolean;
};
