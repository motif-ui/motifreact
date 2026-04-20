import { createContext } from "react";
import { StepperContextType } from "./types";

export const StepperContext = createContext<StepperContextType>({
  activeStep: 0,
  count: 0,
  variant: "primary",
  stepType: "number",
  itemOrientation: "vertical",
});
