export const applyNumberFilter = (
  value: string,
  allowDecimals: boolean | undefined,
  allowNegative: boolean | undefined,
  maxLength: number | undefined,
  max: number | undefined,
  decimalScale: number | undefined,
) => {
  // 1. Sanitize illegal characters
  const charsCleaned =
    allowDecimals && allowNegative
      ? value.replace(/[^0-9.-]/g, "")
      : allowDecimals
        ? value.replace(/[^0-9.]/g, "")
        : allowNegative
          ? value.replace(/[^0-9-]/g, "")
          : value.replace(/[^0-9]/g, "");

  // 2. Fix duplicate decimals
  const decimalFixed = allowDecimals ? limitToSingleDecimal(charsCleaned) : charsCleaned;

  // 3. Enforce decimal scale
  const dotIndex = decimalFixed.indexOf(".");
  const scaleFixed =
    allowDecimals && decimalScale !== undefined && dotIndex !== -1 ? decimalFixed.slice(0, dotIndex + 1 + decimalScale) : decimalFixed;

  // 4. Fix misplaced minus signs
  const signFixed = allowNegative ? (scaleFixed.startsWith("-") ? "-" : "") + scaleFixed.replace(/-/g, "") : scaleFixed;

  // 5. Enforce maxLength boundary
  const lengthFixed = maxLength !== undefined && signFixed.length > maxLength ? signFixed.slice(0, maxLength) : signFixed;

  // 6. Reject if all characters were invalid (e.g. pasting "xxx" into a non-empty field)
  if (lengthFixed === "" && value !== "") return undefined;

  // 7. Reject if MAX boundary is exceeded — undefined signals Motif/InputText to restore its last valid state
  const numericVal = Number(lengthFixed);
  const isMaxExceeded = max !== undefined && !isNaN(numericVal) && lengthFixed !== "" && numericVal > max;

  return isMaxExceeded ? undefined : lengthFixed;
};

const limitToSingleDecimal = (val: string): string => {
  const parts = val.split(".");
  return parts.length > 2 ? parts[0] + "." + parts[1] : val;
};
