import { InputValidation } from "../../Form/validation/validations";
import { ReactElement } from "react";

export type FormFieldProps = {
  name: string;
  label?: string;
  helperText?: string;
  /**
   * ```
   * {
   *   validate: (val?: InputValue)=>boolean;
   *   errorMessage: string;
   * }[]
   * ```
   */
  validations?: InputValidation[];
  readOnly?: boolean;
  disabled?: boolean;
  success?: boolean;
  children: ReactElement;
};

export type FormFieldGroupProps = Omit<FormFieldProps, "children" | "validations"> & {
  groupValidations?: InputValidation[];
} & FormFieldGroupDefaultableProps;

export type FormFieldGroupDefaultableProps = {
  orientation?: "horizontal" | "vertical";
  /**
   * Whether group items should wrap onto multiple lines when they don't fit on one.
   * @default false
   */
  wrap?: boolean;
};
