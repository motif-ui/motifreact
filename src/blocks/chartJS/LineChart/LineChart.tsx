import styles from "./LineChart.module.scss";
import useChartJs from "../useChartJs";

const config = {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Unfilled",
        data: [40, 61, 150, -60, 205, 120, -80, -50, 255, 120, 200, -95],
        borderColor: "#36a2eb",
        backgroundColor: "#36a2eb",
        fill: false,
      },
      {
        label: "Dashed",
        data: [270, -42, -10, 120, 90, 255, 160, -45, 30, 165, 75, 240],
        borderColor: "#ff6384",
        backgroundColor: "#ff6384",
        borderDash: [5, 5],
        fill: false,
      },
      {
        label: "Filled",
        data: [260, 195, 230, 170, 50, 130, 40, 150, 20, -20, 265, 160],
        borderColor: "#4bc0c0",
        backgroundColor: "#4bc0c080",
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
  },
};

const LineChart = () => {
  const canvasRef = useChartJs(config);

  return (
    <div className={styles.chart}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default LineChart;
