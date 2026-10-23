import styles from "./Container.module.scss";
import { PropsWithRefAndChildren } from "../../types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";

const Container = (props: PropsWithRefAndChildren<unknown, HTMLDivElement>) => {
  const { children, className, style, ref } = props;
  const classNames = sanitizeModuleRootClasses(styles, className);

  return (
    <div className={classNames} style={style} ref={ref}>
      {children}
    </div>
  );
};

Container.displayName = "Container";
export default Container;
