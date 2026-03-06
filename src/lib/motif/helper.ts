import { camelToKebab } from "../../utils/utils";

/**
 * Recursively converts theme object to CSS variables
 * @param themeObj - Theme object or nested object
 * @param prefix - CSS variable prefix (e.g., "--theme-color-surface")
 * @returns Record of CSS variable names to values
 */
const convertThemeToCSSVariables = (themeObj: Record<string, unknown>, prefix: string = "--theme"): Record<string, string> => {
  const result: Record<string, string> = {};

  const traverse = (current: Record<string, unknown> | undefined, currentPrefix: string) => {
    if (!current || typeof current !== "object") return;

    Object.entries(current).forEach(([key, value]) => {
      const kebabKey = camelToKebab(key);
      const newPrefix = `${currentPrefix}-${kebabKey}`;

      if (value && typeof value === "object" && !Array.isArray(value)) {
        // Check if this object contains only primitive values (leaf node)
        const hasOnlyPrimitives = Object.values(value as Record<string, unknown>).every(
          v => typeof v === "string" || typeof v === "number" || v === null || v === undefined,
        );

        if (hasOnlyPrimitives) {
          // This is a leaf object with properties like { default: "...", hover: "..." }
          Object.entries(value as Record<string, unknown>).forEach(([subKey, subValue]) => {
            if (subValue !== null && subValue !== undefined && (typeof subValue === "string" || typeof subValue === "number")) {
              const kebabSubKey = camelToKebab(subKey);
              result[`${newPrefix}-${kebabSubKey}`] = String(subValue);
            }
          });
        } else {
          // Continue traversing
          traverse(value as Record<string, unknown>, newPrefix);
        }
      } else if (typeof value === "string" || typeof value === "number") {
        // Primitive value at this level
        result[newPrefix] = String(value);
      }
    });
  };

  traverse(themeObj, prefix);
  return result;
};

export { convertThemeToCSSVariables };
