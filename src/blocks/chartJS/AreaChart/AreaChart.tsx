import styles from "./AreaChart.module.scss";
import useChartJs from "../useChartJs";

const config = {
  type: "line",
  data: {
    labels: ["January", "February", "March", "April", "May", "June", "July", "August"],
    datasets: [
      {
        label: "Dataset 1",
        data: [-35, 87, 32, 92, -25, 90, -28, 38],
        borderColor: "#ff6384",
        backgroundColor: "#ff6384",
        fill: "origin",
        borderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBorderWidth: 1.5,
        pointBackgroundColor: "#ffffff",
      },
      {
        label: "Dataset 2",
        data: [80, 72, -53, 68, 60, -37, -80, 1],
        borderColor: "#36a2eb",
        backgroundColor: "#36a2eb80",
        fill: "origin",
        borderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBorderWidth: 1.5,
        pointBackgroundColor: "#ffffff",
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
  },
};

const AreaChart = () => {
  const canvasRef = useChartJs(config);

  return (
    <div className={styles.chart}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default AreaChart;
