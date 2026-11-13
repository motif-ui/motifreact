import { useRef, useEffect } from "react";
import styles from "./CustomerSegmentsChart.module.scss";

interface ChartInstance {
  destroy(): void;
}

const segments = [
  { label: "Corporate", value: "$9,450", percent: "22%", color: "#6366f1" },
  { label: "Membership", value: "$8,320", percent: "44%", color: "#10b981" },
  { label: "Direct", value: "$3,280", percent: "20%", color: "#f59e0b" },
];

const CustomerSegmentsChart = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartInstance | null>(null);

  useEffect(() => {
    const ChartJS = (window as unknown as { Chart: (new (canvas: HTMLCanvasElement | null, config: object) => ChartInstance) | undefined })
      .Chart;
    if (!ChartJS) return;
    chartRef.current = new ChartJS(canvasRef.current, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: segments.map(s => parseInt(s.percent)),
            backgroundColor: segments.map(s => s.color),
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "72%",
        plugins: { tooltip: { enabled: false }, legend: { display: false } },
      },
    });

    return () => chartRef.current?.destroy();
  }, []);

  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>Customer Segments</span>
      <div className={styles.body}>
        <div className={styles.chart}>
          <canvas ref={canvasRef} />
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
};

export default CustomerSegmentsChart;
