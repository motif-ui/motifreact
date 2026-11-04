import styles from "./BarChart.module.scss";
import useChartJs from "../useChartJs";

const config = {
  type: "bar",
  data: {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      { label: "Dataset 1", data: [18, -70, 81, 52, -30, 2, -27], backgroundColor: "#ff6384", stack: "stack0" },
      { label: "Dataset 2", data: [-80, -12, 47, 46, -95, -58, 14], backgroundColor: "#36a2eb", stack: "stack0" },
      { label: "Dataset 3", data: [22, -77, 92, 2, 59, -55, -86], backgroundColor: "#4bc0c0", stack: "stack1" },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
  },
};

const BarChart = () => {
  const canvasRef = useChartJs(config);

  return (
    <div className={styles.chart}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default BarChart;
