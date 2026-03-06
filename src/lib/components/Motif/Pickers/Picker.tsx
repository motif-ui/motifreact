import styles from "@/components/Motif/Pickers/Picker.module.scss";
import { PropsWithRefAndChildren, Size4SM } from "../../../types";
import { sanitizeModuleRootClasses } from "../../../../utils/cssUtils";

type Props = {
  size: Size4SM;
  variant: "bordered" | "shadow" | "borderless";
  fluid?: boolean;
  wide?: boolean;
  className?: string;
};

const Picker = (props: PropsWithRefAndChildren<Props, HTMLDivElement>) => {
  const { size, variant, fluid, wide, className, children, ref, style } = props;
  const classes = sanitizeModuleRootClasses(styles, className, [size, variant, fluid && "fluid", wide && "wide"]);

  return (
    <div className={classes} ref={ref} style={style} data-testid="Picker">
      {children}
    </div>
  );
};

export default Picker;
