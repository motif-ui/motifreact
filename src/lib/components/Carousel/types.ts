export type ColorScheme = "dark" | "light";
export type IndicatorShape = "dot" | "line";

export type CarouselProps = {
  activeIndex?: number;
  height?: number | string;
} & CarouselDefaultableProps;

export type CarouselDefaultableProps = {
  removeIndicators?: boolean;
  indicatorShape?: IndicatorShape;
  removeControls?: boolean;
  /**
   * The color of the text, the controls and the indicators over the slides: `dark` for a bright image, `light` for a dark one.
   */
  colorScheme?: ColorScheme;
  /**
   * Puts a translucent surface behind the title, the subtitle, the controls and the indicators, so they read on a busy image.
   */
  contentBackdrop?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
  pauseOnHover?: boolean;
};
