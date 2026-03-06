import styles from "../Modal.module.scss";

export type HeaderProps = {
  title?: string;
  subtitle?: string;
};

const ModalHeader = (props: HeaderProps) => {
  const { subtitle, title } = props;

  return (
    (title || subtitle) && (
      <div className={styles.header}>
        {(title || subtitle) && (
          <div className={styles.headerContent}>
            {title && <span className={styles.headerTitle}>{title}</span>}
            {subtitle && <span className={styles.headerSubtitle}>{subtitle}</span>}
          </div>
        )}
      </div>
    )
  );
};

export default ModalHeader;
