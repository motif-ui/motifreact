import { createContext, useContext } from "react";
import { RadioGroupContextProps } from "@/components/RadioGroup/types";

export const RadioGroupContext = createContext<RadioGroupContextProps | undefined>(undefined);
export const useRadioGroupContext = () => useContext(RadioGroupContext);
