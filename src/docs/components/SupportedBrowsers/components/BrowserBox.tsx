import styles from "./BrowserBox.module.scss";

export type BrowserProps = {
  id: string;
  displayName: string;
  icon: string;
  minVersion: number | string;
  usage: string;
};

const BrowserBox = (props: BrowserProps) => {
  const { displayName, icon, minVersion, usage } = props;

  return (
    <div className={styles.container}>
      <img src={icon} alt={displayName} className={styles.icon} />
      <span className={styles.name}>{displayName}</span>
      <span className={styles.version}>v{minVersion}+</span>
      <span className={styles.coverage}>🌍 {usage}% coverage</span>
    </div>
  );
};

export default BrowserBox;
