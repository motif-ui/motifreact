import GlobalIconWrapper from "../../Motif/GlobalIconWrapper/GlobalIconWrapper";
import styles from "../Panel.module.scss";
import { memo } from "react";
import type { Size3, IconGlobalType } from "../../../types";

type Props = {
  title: string;
  size?: Size3;
  icon?: IconGlobalType;
};

const PanelTitle = memo((props: Props) => {
  const { title, size = "md", icon } = props;

  const child = (
    <>
      {icon && <GlobalIconWrapper icon={icon} className={styles["title-icon"]} />} {title}
    </>
  );

  const className = `${styles.title} ${styles[`title-${size}`]}`;

  const render = {
    sm: <h5 className={className}>{child}</h5>,
    md: <h4 className={className}>{child}</h4>,
    lg: <h3 className={className}>{child}</h3>,
  };

  return render[size];
});

PanelTitle.displayName = "PanelTitle";
export default PanelTitle;
