import { UploadProps, FileObject } from "../types";
import { InputCommonProps } from "../../Form/types";

export type ImageUploadProps = Omit<UploadProps, "maxFile" | "accept" | "autoUpload"> &
  ImageUploadDefaultableProps & {
    value?: FileObject[];
  };

export type ImageUploadDefaultableProps = Pick<InputCommonProps, "size">;
