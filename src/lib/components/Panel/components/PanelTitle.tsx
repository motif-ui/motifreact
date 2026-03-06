import Icon from "@/components/Icon";
import styles from "../Panel.module.scss";
import { memo } from "react";
import { Size3 } from "../../../types";

type Props = {
  title: string;
  size?: Size3;
  icon?: string;
};

const PanelTitle = memo((props: Props) => {
  const { title, size = "md", icon } = props;

  const child = (
    <>
      {icon && <Icon name={icon} className={styles["title-icon"]} />} {title}
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
