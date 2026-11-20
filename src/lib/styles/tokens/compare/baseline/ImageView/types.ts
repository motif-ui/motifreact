export type ImageViewProps = {
  alt?: string;
  src: string;
  onImageLoaded?: () => void;
  width?: number | string;
  height?: number | string;
  aspectRatio?: number;
} & ImageViewDefaultableProps;

export type ImageViewDefaultableProps = {
  positionVertical?: "top" | "center" | "bottom";
  positionHorizontal?: "left" | "center" | "right";
  scaleType?: "original" | "fill" | "fit" | "fillKeepAspectRatio";
  bordered?: boolean;
  solid?: boolean;
};
