import { InputCommonProps, InputSize } from "../../Form/types";
import { UploadDefaultableProps, UploadProps } from "../types";

export type UploadDraggerProps = UploadProps & InputCommonProps & UploadDraggerDefaultableProps;

export type UploadDraggerDefaultableProps = {
  size?: InputSize;
} & UploadDefaultableProps;
