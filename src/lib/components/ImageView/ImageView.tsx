"use client";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import styles from "./ImageView.module.scss";
import { PropsWithRef } from "../../types";
import { ImageViewProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import { BROKEN_IMG_SRC } from "@/components/ImageView/constants";

const ImageView = (props: PropsWithRef<ImageViewProps, HTMLImageElement>) => {
  const {
    width = "auto",
    height = "auto",
    aspectRatio,
    alt,
    src,
    onImageLoaded,
    positionVertical = "top",
    positionHorizontal = "left",
    scaleType = "fit",
    bordered,
    style,
    className,
    solid,
    ref,
  } = usePropsWithThemeDefaults("ImageView", props);

  const imageViewRef = useRef<HTMLImageElement>(null);
  useImperativeHandle(ref, () => imageViewRef.current!, []);
  const [loading, setLoading] = useState<boolean>(!!src);
  const [isBroken, setIsBroken] = useState<boolean>();

  useEffect(() => {
    const img = imageViewRef.current;
    if (!img || !src) return;

    const addListeners = () => {
      img.addEventListener("load", handleImageLoad);
      img.addEventListener("error", handleImageError);
    };

    const removeListeners = () => {
      img.removeEventListener("load", handleImageLoad);
      img.removeEventListener("error", handleImageError);
    };

    const handleImageLoad = () => {
      onImageLoaded?.();
      setLoading(false);
      setIsBroken(false);
      removeListeners();
    };

    const handleImageError = () => {
      if (imageViewRef.current) {
        imageViewRef.current.src = BROKEN_IMG_SRC;
      }
      setLoading(false);
      setIsBroken(true);
      removeListeners();
    };

    if (img.complete) {
      (!img.naturalWidth ? handleImageError : handleImageLoad)();
    } else {
      setLoading(true);
      addListeners();
    }

    return () => removeListeners();
  }, [src, onImageLoaded]);

  const innerStyle = {
    width,
    height,
    aspectRatio,
    ...style,
    objectPosition: isBroken ? "center center" : `${positionVertical} ${positionHorizontal}`,
  };

  const classNames = sanitizeModuleRootClasses(styles, className, [
    scaleType,
    loading && "placeholder",
    bordered && "bordered",
    solid && "solid",
  ]);

  return <img src={src} alt={alt} className={classNames} style={innerStyle} ref={imageViewRef} />;
};

ImageView.displayName = "ImageView";
export default ImageView;
