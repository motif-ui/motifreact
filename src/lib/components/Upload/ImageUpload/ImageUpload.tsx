"use client";
import { PropsWithRef } from "../../../types";
import { UploadProvider } from "@/components/Upload/UploadProvider";
import ImageDragArea from "@/components/Upload/ImageUpload/components/ImageDragArea";
import { MIME_TYPES } from "../constants";
import { ImageUploadProps } from "./types";
import usePropsWithThemeDefaults from "../../../motif/hooks/usePropsWithThemeDefaults";
import { normalizeValue } from "@/components/Upload/helper";

const ImageUpload = (props: PropsWithRef<ImageUploadProps, HTMLDivElement>) => {
  const { size, style, ref, className, value: externalValue, ...rest } = usePropsWithThemeDefaults("ImageUpload", props);
  const mappedValue = normalizeValue(externalValue);

  return (
    <UploadProvider props={{ ...rest, accept: MIME_TYPES.IMAGE, maxFile: 1 }} size={size} value={mappedValue}>
      <ImageDragArea ref={ref} style={style} className={className} />
    </UploadProvider>
  );
};

ImageUpload.displayName = "ImageUpload";
export default ImageUpload;
