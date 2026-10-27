import { createContext } from "react";
import { ButtonGroupProps } from "./types";

export const ButtonGroupContext = createContext<Pick<ButtonGroupProps, "size">>({ size: "md" });
