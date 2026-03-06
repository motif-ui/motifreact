import { InputCommonProps, InputSize } from "../../Form/types";
import { UploadDefaultableProps, UploadProps } from "../types";

export type UploadListProps = UploadProps & InputCommonProps & UploadListDefaultableProps;

export type UploadListDefaultableProps = {
  size?: InputSize;
} & UploadDefaultableProps;
