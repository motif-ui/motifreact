import { memo } from "react";
import styles from "../../ListView.module.scss";

type Props = {
  title: string;
  description?: string;
  alternateText?: string;
};

const CenterContent = memo((props: Props) => {
  const { title, description, alternateText } = props;

  return (
    <div className={styles.centerContent}>
      {alternateText && <span className={styles.alternateText}>{alternateText}</span>}
      <span className={styles.title}>{title}</span>
      {description && <span className={styles.description}>{description}</span>}
    </div>
  );
});

export default CenterContent;
