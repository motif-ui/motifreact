import { createContext, useContext } from "react";
import { FormFieldProps } from "@/components/Form/types";

export const FieldContext = createContext<FormFieldProps | undefined>(undefined);
export const useFormField = () => useContext(FieldContext);
