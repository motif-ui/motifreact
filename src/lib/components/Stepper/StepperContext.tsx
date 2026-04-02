import { createContext } from "react";

type StepperContextType = {
  activeStep: number;
};

export const StepperContext = createContext<StepperContextType>({
  activeStep: 0,
});
