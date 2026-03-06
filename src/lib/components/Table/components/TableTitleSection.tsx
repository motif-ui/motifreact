import styles from "../Table.module.scss";

type Props = {
  title?: string;
  subtitle?: string;
};

const TableTitleSection = ({ title, subtitle }: Props) => {
  return (
    (title || subtitle) && (
      <div className={styles.titleSection}>
        {title && <span className={styles.title}>{title}</span>}
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
    )
  );
};

export default TableTitleSection;
