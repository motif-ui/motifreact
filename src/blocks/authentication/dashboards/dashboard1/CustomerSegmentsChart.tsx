import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import styles from "./CustomerSegmentsChart.module.scss";

ChartJS.register(ArcElement, Tooltip);

const segments = [
  { label: "Corporate", value: "$9,450", percent: "22%", color: "#6366f1" },
  { label: "Membership", value: "$8,320", percent: "44%", color: "#10b981" },
  { label: "Direct", value: "$3,280", percent: "20%", color: "#f59e0b" },
];

const data = {
  datasets: [
    {
      data: [22, 44, 20],
      backgroundColor: segments.map(s => s.color),
      borderWidth: 0,
      hoverOffset: 4,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "72%" as const,
  plugins: { tooltip: { enabled: false } },
};

const CustomerSegmentsChart = () => (
  <div className={styles.wrapper}>
    <span className={styles.title}>Customer Segments</span>
    <div className={styles.body}>
      <div className={styles.chart}>
        <Doughnut data={data} options={options} />
      </div>
      <ul className={styles.legend}>
        {segments.map(s => (
          <li key={s.label} className={styles.legendItem}>
            <span className={styles.dot} style={{ backgroundColor: s.color }} />
            <span className={styles.legendLabel}>{s.label}</span>
            <span className={styles.legendValue}>{s.value}</span>
            <span className={styles.legendPercent}>· {s.percent}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default CustomerSegmentsChart;
