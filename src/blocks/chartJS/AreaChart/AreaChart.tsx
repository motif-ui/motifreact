import { useMemo } from "react";
import styles from "./AreaChart.module.scss";
import useChartJs from "../useChartJs";
import { ChartProps, ChartSeries } from "../types";

export type AreaChartSeries = ChartSeries & {
  fillColor?: string;
};

const AreaChart = (props: ChartProps<AreaChartSeries>) => {
  const { data, xKey, series, height = 260 } = props;

  const config = useMemo(
    () => ({
      type: "line",
      data: {
        labels: data.map(datum => String(datum[xKey])),
        datasets: series.map(s => ({
          label: s.label,
          data: data.map(datum => Number(datum[s.key])),
          borderColor: s.color,
          backgroundColor: s.fillColor ?? s.color,
          fill: "origin",
          borderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBorderWidth: 1.5,
          pointBackgroundColor: "#ffffff",
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
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

export default AreaChart;
