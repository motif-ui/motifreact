import { createContext } from "react";
import { PinCodeContextDefaultValues, PinCodeContextValueProps } from "@/components/PinCode/types";

export const PinCodeContext = createContext<PinCodeContextValueProps>(PinCodeContextDefaultValues);
