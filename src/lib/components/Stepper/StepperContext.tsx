"use client";

import { createContext } from "react";
import { StepperContextType } from "./types";

export const StepperContext = createContext<StepperContextType | null>(null);
