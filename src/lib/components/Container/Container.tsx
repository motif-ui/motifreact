import styles from "./Container.module.scss";
import { PropsWithRefAndChildren } from "../../types";
import { ContainerDefaultableProps } from "./types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";

const Container = (props: PropsWithRefAndChildren<ContainerDefaultableProps, HTMLDivElement>) => {
  const { children, className, style, ref, fluid } = usePropsWithThemeDefaults("Container", props);
  const classNames = sanitizeModuleRootClasses(styles, className, [fluid && "fluid"]);

  return (
    <div className={classNames} style={style} ref={ref}>
      {children}
    </div>
  );
};

Container.displayName = "Container";
export default Container;
