import { createContext } from "react";
import { ButtonGroupProps } from "./types";

export const ButtonGroupContext = createContext<ButtonGroupProps>({ size: "md" });
