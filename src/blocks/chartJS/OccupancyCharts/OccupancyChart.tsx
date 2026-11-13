import { useRef, useEffect } from "react";
import styles from "./OccupancyChart.module.scss";

interface ChartInstance {
  destroy(): void;
}

const labels = ["01", "-", "04", "-", "07", "-", "10", "-", "13", "-", "16", "-", "19", "-", "22", "-", "25", "-", "28", "-", "30"];

const allDatasets = [
  {
    label: "Occupied",
    data: [110, 100, 80, 95, 125, 130, 110, 105, 100, 130, 140, 110, 155, 165, 130, 140, 145, 150, 160, 155, 135],
    backgroundColor: "#6366f1",
    stack: "stack",
  },
  {
    label: "Available",
    data: [10, 10, 12, 10, 8, 10, 10, 8, 10, 12, 10, 10, 15, 12, 10, 8, 10, 12, 10, 10, 12],
    backgroundColor: "#10b981",
    stack: "stack",
  },
  {
    label: "Not Ready",
    data: [-15, -20, -30, -18, -20, -22, -15, -20, -25, -18, -20, -15, -25, -22, -20, -18, -20, -22, -18, -20, -22],
    backgroundColor: "#f59e0b",
    stack: "stack",
  },
];

const OccupancyChart = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartInstance | null>(null);

  useEffect(() => {
    const ChartJS = (window as unknown as { Chart: (new (canvas: HTMLCanvasElement | null, config: object) => ChartInstance) | undefined })
      .Chart;
    if (!ChartJS) return;
    chartRef.current = new ChartJS(canvasRef.current, {
      type: "bar",
      data: { labels, datasets: allDatasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            align: "start",
            labels: {
              usePointStyle: true,
              pointStyle: "circle",
              boxWidth: 8,
              boxHeight: 8,
              padding: 16,
              font: { size: 12 },
            },
          },
          tooltip: { mode: "index" },
        },
        scales: {
          x: { stacked: true, grid: { display: false }, ticks: { font: { size: 11 } } },
          y: { stacked: true, ticks: { font: { size: 11 } } },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.title}>Occupancy</span>
      </div>
      <div className={styles.chart}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default OccupancyChart;
