import { useState } from "react";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import styles from "./OccupancyChart.module.scss";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const labels = ["01", "-", "04", "-", "07", "-", "10", "-", "13", "-", "16", "-", "19", "-", "22", "-", "25", "-", "28", "-", "30"];

const occupied = [110, 100, 80, 95, 125, 130, 110, 105, 100, 130, 140, 110, 155, 165, 130, 140, 145, 150, 160, 155, 135];
const available = [10, 10, 12, 10, 8, 10, 10, 8, 10, 12, 10, 10, 15, 12, 10, 8, 10, 12, 10, 10, 12];
const notReady = [-15, -20, -30, -18, -20, -22, -15, -20, -25, -18, -20, -15, -25, -22, -20, -18, -20, -22, -18, -20, -22];

const data = {
  labels,
  datasets: [
    {
      label: "Occupied",
      data: occupied,
      backgroundColor: "#6366f1",
      stack: "stack",
    },
    {
      label: "Available",
      data: available,
      backgroundColor: "#10b981",
      stack: "stack",
    },
    {
      label: "Not Ready",
      data: notReady,
      backgroundColor: "#f59e0b",
      stack: "stack",
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      align: "start" as const,
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
        boxWidth: 8,
        boxHeight: 8,
        padding: 16,
        font: { size: 12 },
      },
    },
    tooltip: { mode: "index" as const },
  },
  scales: {
    x: {
      stacked: true,
      grid: { display: false },
      ticks: { font: { size: 11 } },
    },
    y: {
      stacked: true,
      ticks: { font: { size: 11 } },
    },
  },
};

const OccupancyChart = () => {
  const [filter, setFilter] = useState("all");

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.title}>Occupancy</span>
        <select className={styles.select} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="occupied">Occupied</option>
          <option value="available">Available</option>
          <option value="notReady">Not Ready</option>
        </select>
      </div>
      <div className={styles.chart}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default OccupancyChart;
