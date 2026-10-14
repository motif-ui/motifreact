import PanelTitle from "@/components/Panel/components/PanelTitle";
import { PropsWithRefAndChildren } from "../../types";
import styles from "./Panel.module.scss";
import { PanelProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";

const PanelComponent = (props: PropsWithRefAndChildren<PanelProps, HTMLDivElement>) => {
  const {
    type = "default",
    bordered,
    children,
    title,
    titleIcon,
    titleSize = "md",
    lean,
    className,
    style,
    ref,
  } = usePropsWithThemeDefaults("Panel", props);

  const classNames = sanitizeModuleRootClasses(styles, className, [type, lean && "lean", bordered && "bordered"]);

  return (
    <div className={classNames} ref={ref} style={style}>
      {title && <PanelTitle title={title} icon={titleIcon} size={titleSize} />}
      {children}
    </div>
  );
};

PanelComponent.displayName = "Panel";
const Panel = Object.assign(PanelComponent, { Title: PanelTitle });
export default Panel;
