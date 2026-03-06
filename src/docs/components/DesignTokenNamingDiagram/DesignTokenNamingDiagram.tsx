import styles from "./DesignTokenNamingDiagram.module.scss";

const DesignTokenNamingDiagram = () => {
  return (
    <div className={styles.container}>
      {/* Token Naming Convention Diagram */}
      <div className={styles.diagramContainer}>
        {/* Token Pills */}
        <div className={styles.tokensRow}>
          <div className={styles.tokenPill}>theme</div>
          <div className={styles.tokenPill}>color</div>
          <div className={styles.tokenPill}>surface</div>
          <div className={styles.tokenPill}>primary</div>
          <div className={styles.tokenPill}>disabled</div>
        </div>

        {/* SVG Lines */}
        <svg width="100%" height="110" className={styles.connectingLines} viewBox="0 0 100 110" preserveAspectRatio="none">
          <line
            x1="24%"
            y1="0"
            x2="15%"
            y2="100"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="2"
            strokeDasharray="4,4"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1="35%"
            y1="0"
            x2="33%"
            y2="100"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="2"
            strokeDasharray="4,4"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1="48%"
            y1="0"
            x2="50%"
            y2="100"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="2"
            strokeDasharray="4,4"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1="62%"
            y1="0"
            x2="68%"
            y2="100"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="2"
            strokeDasharray="4,4"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1="76%"
            y1="0"
            x2="86%"
            y2="100"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="2"
            strokeDasharray="4,4"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Explanations */}
        <div className={styles.explanationsRow}>
          <div className={styles.explanation}>
            <div className={styles.numberCircle}>1</div>
            <div className={styles.explanationText}>
              <strong>Namespace</strong>
              <br />
              (theme, base, ...)
            </div>
          </div>

          <div className={styles.explanation}>
            <div className={styles.numberCircle}>2</div>
            <div className={styles.explanationText}>
              <strong>Type</strong>
              <br />
              (color, typography, sizing, ...)
            </div>
          </div>

          <div className={styles.explanation}>
            <div className={styles.numberCircle}>3</div>
            <div className={styles.explanationText}>
              <strong>Category</strong>
              <br />
              (text, surface, border, ...)
            </div>
          </div>

          <div className={styles.explanation}>
            <div className={styles.numberCircle}>4</div>
            <div className={styles.explanationText}>
              <strong>Family</strong>
              <br />
              (primary, secondary, success, warning, ...)
            </div>
          </div>

          <div className={styles.explanation}>
            <div className={styles.numberCircle}>5</div>
            <div className={styles.explanationText}>
              <strong>State/Scale</strong>
              <br />
              (default, hover, active, 500, ...)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignTokenNamingDiagram;
