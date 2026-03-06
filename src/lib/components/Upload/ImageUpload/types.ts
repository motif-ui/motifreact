import { UploadProps } from "../types";
import { InputCommonProps } from "../../Form/types";

export type ImageUploadProps = Omit<UploadProps, "maxFile" | "accept" | "autoUpload"> & ImageUploadDefaultableProps;

export type ImageUploadDefaultableProps = Pick<InputCommonProps, "size">;
