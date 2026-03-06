import styles from "./FormTitle.module.scss";
import { InputSize } from "../../Form/types";
import { memo } from "react";

type Props = {
  title: string;
  size: InputSize;
};

const headingMap = {
  lg: "h2",
  md: "h3",
  sm: "h4",
  xs: "h5",
} as const;

const FormTitle = memo((props: Props) => {
  const { size, title } = props;

  const HTag = headingMap[size];
  return <HTag className={styles.title}>{title}</HTag>;
});

export default FormTitle;
