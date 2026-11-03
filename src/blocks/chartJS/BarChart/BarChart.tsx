import { useMemo } from "react";
import styles from "./BarChart.module.scss";
import useChartJs from "../useChartJs";
import { ChartProps, ChartSeries } from "../types";

export type BarChartSeries = ChartSeries & {
  stack?: string;
};

const BarChart = (props: ChartProps<BarChartSeries>) => {
  const { data, xKey, series, height = 260 } = props;

  const config = useMemo(
    () => ({
      type: "bar",
      data: {
        labels: data.map(datum => String(datum[xKey])),
        datasets: series.map(s => ({
          label: s.label,
          data: data.map(datum => Number(datum[s.key])),
          backgroundColor: s.color,
          stack: s.stack,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true },
          y: { stacked: true },
        },
      },
    }),
    [data, xKey, series],
  );

  const canvasRef = useChartJs(config);

  return (
    <div className={styles.chart} style={{ height }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default BarChart;
