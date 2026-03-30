import styles from "../Grid.module.scss";
import { PropsWithRefAndChildren } from "../../../types";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";
import { useContext } from "react";
import GridContext from "@/components/Grid/GridContext";

export type ColProps = {
  size?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
};

const Col = (props: PropsWithRefAndChildren<ColProps, HTMLDivElement>) => {
  const { children, size, sm, md, lg, xl, ref, style, className } = props;
  const { style: styleFromContext, className: classNameFromContext } = useContext(GridContext);
  const sizeClasses = Object.entries({ sm, md, lg, xl, size })
    .filter(([, value]) => !!value)
    .map(([key, value]) => `col-${key}-${value}`);

  const classNames = sanitizeModuleClasses(styles, "colBase", ...sizeClasses);
  return (
    <div className={classNames} data-testid="col-container" ref={ref}>
      <div style={{ ...styleFromContext, ...style }} className={sanitizeModuleClasses(styles, "col", className, classNameFromContext)}>
        {children}
      </div>
    </div>
  );
};

Col.displayName = "Grid.Col";
export default Col;
