import styles from "./TokenTransformation.module.scss";
type TokenTransformationProps = {
  tokenName: string;
  cssVariable: string;
};

const TokenTransformation = ({ tokenName, cssVariable }: TokenTransformationProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.tokenBlock}>
        <div className={styles.label}>Token Name</div>
        <code className={styles.code} style={{ color: "#059669" }}>
          {tokenName}
        </code>
      </div>
      <div className={styles.arrow}>→</div>
      <div className={styles.variableBlock}>
        <div className={styles.label}>CSS Variable</div>
        <code className={styles.code} style={{ color: "#0ea5e9" }}>
          {cssVariable}
        </code>
      </div>
    </div>
  );
};

export default TokenTransformation;
