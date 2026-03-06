type Cols = 1 | 2 | 3 | 4;

export type DataViewProps = {
  cols?: Cols;
  sm?: Cols;
  md?: Cols;
  lg?: Cols;
  xl?: Cols;
} & DataViewDefaultableProps;

export type DataViewDefaultableProps = {
  rowVariant?: "plain" | "solid" | "stripe";
  removeBorder?: boolean;
  valueAlignment?: "left" | "center" | "right";
  orientation?: "horizontal" | "vertical";
};

export type DataViewItemProps = {
  label: string;
  value?: string | number;
  icon?: string;
  variant?: "primary" | "info" | "success" | "warning" | "danger";
};
