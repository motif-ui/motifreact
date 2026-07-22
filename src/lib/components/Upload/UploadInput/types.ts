import { UploadDefaultableProps, UploadProps } from "../../Upload/types";
import { InputCommonProps, InputSize, InputValue } from "../../Form/types";

export type UploadInputProps = UploadProps & InputCommonProps & UploadInputDefaultableProps;

export type UploadInputDefaultableProps = {
  pill?: boolean;
  size?: InputSize;
} & UploadDefaultableProps;

export type UploadInputWrapperProps = UploadInputProps & {
  onFormFieldValueUpdate?: (value?: InputValue) => void;
  readOnly?: boolean;
  size: InputSize;
};
