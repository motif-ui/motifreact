import { useEffect, useRef } from "react";
import "./Chart.css";

type ChartSeries = {
  key: string;
  label: string;
  color: string;
  fillColor?: string;
  stack?: string;
};

type ChartDatum = Record<string, number | string>;

type ChartProps = {
  type: "area" | "bar";
  data: ChartDatum[];
  xKey: string;
  series: ChartSeries[];
  height?: number;
};

type ChartInstance = { destroy: () => void };
type ChartConstructor = new (canvas: HTMLCanvasElement, config: object) => ChartInstance;

declare global {
  interface Window {
    Chart?: ChartConstructor;
  }
}

const CHART_JS_SRC = "https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js";

let chartJsPromise: Promise<ChartConstructor> | undefined;

const loadChartJs = () => {
  chartJsPromise ??= new Promise<ChartConstructor>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = CHART_JS_SRC;
    script.onload = () => (window.Chart ? resolve(window.Chart) : reject(new Error("Chart.js failed to load")));
    script.onerror = () => reject(new Error("Chart.js failed to load"));
    document.head.appendChild(script);
  });
  return chartJsPromise;
};

const Chart = (props: ChartProps) => {
  const { type, data, xKey, series, height = 260 } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const isArea = type === "area";
    let chart: ChartInstance | undefined;
    let cancelled = false;

    void loadChartJs().then(ChartJS => {
      if (cancelled || !canvasRef.current) return;
      chart = new ChartJS(canvasRef.current, {
        type: isArea ? "line" : "bar",
        data: {
          labels: data.map(datum => String(datum[xKey])),
          datasets: series.map(s => ({
            label: s.label,
            data: data.map(datum => Number(datum[s.key])),
            borderColor: s.color,
            backgroundColor: s.fillColor ?? s.color,
            stack: s.stack,
            fill: isArea && "origin",
            borderWidth: isArea ? 2 : 0,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBorderWidth: 1.5,
            pointBackgroundColor: "#ffffff",
          })),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { stacked: !isArea },
            y: { stacked: !isArea },
          },
        },
      });
    });

    return () => {
      cancelled = true;
      chart?.destroy();
    };
  }, [type, data, xKey, series]);

  return (
    <div className="chart" style={{ height }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Chart;
