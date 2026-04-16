import { createContext } from "react";
import { StepperContextType } from "./types";

export const StepperContext = createContext<StepperContextType>({
  activeStep: 0,
  stepType: "number",
  itemOrientation: "vertical",
});
