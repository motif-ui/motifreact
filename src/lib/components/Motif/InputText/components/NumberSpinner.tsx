import { useCallback } from "react";
import styles from "@/components/Motif/InputText/InputText.module.scss";

type Props = {
  value?: string;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: string, updateInputRefValue?: boolean) => void;
  disabled?: boolean;
};

const NumberSpinner = (props: Props) => {
  const { value, min, max, step = 1, onChange, disabled } = props;
  const adjustNumberValue = useCallback(
    (v: number) => {
      const current = value === undefined ? 0 : Number(value);
      const raw = current + v;
      const clampedMin = min !== undefined ? Math.max(min, raw) : raw;
      const next = max !== undefined ? Math.min(max, clampedMin) : clampedMin;
      onChange(String(next), true);
    },
    [max, min, onChange, value],
  );

  return (
    <div className={styles.numberButtons}>
      <button type="button" onClick={() => adjustNumberValue(step)} disabled={disabled}>
        +
      </button>
      <button type="button" onClick={() => adjustNumberValue(-step)} disabled={disabled}>
        -
      </button>
    </div>
  );
};

export default NumberSpinner;
