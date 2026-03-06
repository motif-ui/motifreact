import { createContext, PropsWithChildren, useContext } from "react";
import { FormFieldProps } from "@/components/Form/types";

const FieldContext = createContext<FormFieldProps | undefined>(undefined);
export const useFormField = () => useContext(FieldContext);

export const FieldProvider = (props: PropsWithChildren<FormFieldProps>) => {
  const { children, ...restProps } = props;

  return <FieldContext value={restProps}>{children}</FieldContext>;
};
