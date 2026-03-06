import { createContext, type CSSProperties } from "react";

const GridContext = createContext<{ style?: CSSProperties; className?: string }>({});

export default GridContext;
