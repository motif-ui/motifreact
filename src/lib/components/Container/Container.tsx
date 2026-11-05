import styles from "./Container.module.scss";
import { PropsWithRefAndChildren } from "../../types";
import { ContainerProps } from "./types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";

const Container = (props: PropsWithRefAndChildren<ContainerProps, HTMLDivElement>) => {
  const { children, className, style, ref, fluid } = props;
  const classNames = sanitizeModuleRootClasses(styles, className, [fluid && "fluid"]);

  return (
    <div className={classNames} style={style} ref={ref}>
      {children}
    </div>
  );
};

Container.displayName = "Container";
export default Container;
