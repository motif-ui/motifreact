export type ChartDatum = Record<string, number | string>;

export type ChartSeries = {
  key: string;
  label: string;
  color: string;
};

export type ChartProps<T extends ChartSeries> = {
  data: ChartDatum[];
  xKey: string;
  series: T[];
  height?: number;
};
