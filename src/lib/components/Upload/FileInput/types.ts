import { InputCommonProps, InputSize } from "../../Form/types";
import { UploadDefaultableProps, UploadProps } from "../types";

export type FileInputProps = Omit<InputCommonProps, "value" | "onChange"> &
  Pick<UploadProps, "accept" | "maxFile" | "customValidation" | "onError"> & {
    onChange?: (files: File[]) => void;
  } & FileInputDefaultableProps;

export type FileInputDefaultableProps = {
  size?: InputSize;
} & Pick<UploadDefaultableProps, "maxSize" | "messages">;
