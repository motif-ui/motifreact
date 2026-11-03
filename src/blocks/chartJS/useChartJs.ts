import { useEffect, useRef } from "react";

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

const useChartJs = (config: object) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let chart: ChartInstance | undefined;
    let cancelled = false;

    void loadChartJs().then(ChartJS => {
      if (cancelled || !canvasRef.current) return;
      chart = new ChartJS(canvasRef.current, config);
    });

    return () => {
      cancelled = true;
      chart?.destroy();
    };
  }, [config]);

  return canvasRef;
};

export default useChartJs;
