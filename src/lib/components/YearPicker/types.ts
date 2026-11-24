import { PickerPropsCommon } from "../Motif/Pickers/types";

export type YearPickerProps = {
  /** The selected year, e.g. 2025. */
  value?: number;
  /** Called with the clicked year when it differs from the selected one. */
  onYearChange?: (year: number) => void;
} & YearPickerDefaultableProps;

export type YearPickerDefaultableProps = PickerPropsCommon;
