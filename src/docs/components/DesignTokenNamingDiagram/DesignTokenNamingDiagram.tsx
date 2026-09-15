import styles from "./DesignTokenNamingDiagram.module.scss";

const TOKEN_PARTS = [
  {
    pill: "theme",
    title: "Namespace",
    hint: "(theme, base, ...)",
  },
  {
    pill: "color",
    title: "Type",
    hint: "(color, typography, sizing, ...)",
  },
  {
    pill: "surface",
    title: "Category",
    hint: "(text, surface, border, ...)",
  },
  {
    pill: "primary",
    title: "Family",
    hint: "(primary, secondary, success, warning, ...)",
  },
  {
    pill: "disabled",
    title: "State/Scale",
    hint: "(default, hover, active, 500, ...)",
  },
];

const DesignTokenNamingDiagram = () => {
  return (
    <div className={styles.container}>
      <div className={styles.diagramContainer}>
        {TOKEN_PARTS.map(({ pill, title, hint }, index) => (
          <div key={pill} className={styles.column}>
            <div className={styles.tokenPill}>{pill}</div>
            <div className={styles.connector} aria-hidden="true" />
            <div className={styles.numberCircle}>{index + 1}</div>
            <div className={styles.explanationText}>
              <strong>{title}</strong>
              <br />
              {hint}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DesignTokenNamingDiagram;
