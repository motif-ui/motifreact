/**
 * Utility function for handling CSS class names of the root element of a component
 * using CSS modules in a React application.
 *
 * This function help in sanitizing and combining class names based on module styles,
 * custom classes, and additional properties to prevent generating undefined class names.
 *
 * @param cssModule - CSS module object
 * @param globalClass - A custom class name to be added.
 * @param propsValues - An array of property values that may include strings, booleans, undefined or array of these types. False or undefined values will be ignored.
 *
 * @return A sanitized string of class names, ensuring no undefined or empty values are included.
 *
 * @example
 * import styles from "./MyComponent.module.scss";
 * const { className, shape, size, pill, icon, iconPosition } = props;
 * const classNames = sanitizeModuleRootClasses(styles, className,
 *         shape,
 *         size,
 *         pill && "pill",
 *         icon && iconPosition && \`icon-\${iconPosition}\`,
 * );
 * */
export const sanitizeModuleRootClasses = (
  cssModule: Readonly<Record<string, string>>,
  globalClass: string | undefined,
  propsValues?: (string | false | undefined | (string | false | undefined)[])[],
) =>
  [
    cssModule.Root,
    ...(propsValues || [])
      .flat()
      .filter((key): key is string => !!key && !!cssModule[key])
      .map(key => cssModule[key]),
    globalClass ?? "",
  ]
    .join(" ")
    .trim() || undefined;

/**
 * This utility function helps in sanitizing and combining class names based on CSS module styles to prevent generating
 * undefined class names.
 *
 * @param cssModule - CSS module object
 * @param moduleKeys - An array of class names.
 *
 * @return A sanitized string of class names, ensuring no undefined or empty values are included.
 *
 * @example
 * import styles from "./MyComponent.module.scss";
 * const classNames = sanitizeModuleClasses(styles,
 *         "shape",
 *         "size",
 *         true && "pill",
 *         icon && iconPosition && \`icon-\${iconPosition}\`,
 * );
 * */
export const sanitizeModuleClasses = (
  cssModule: Readonly<Record<string, string>>,
  ...moduleKeys: (string | false | undefined | (string | false | undefined)[])[]
) =>
  moduleKeys
    .flat()
    .filter((key): key is string => !!key && !!cssModule[key])
    .map(key => cssModule[key])
    .join(" ")
    .trim() || undefined;

/**
 * Converts RGB color values to hexadecimal format
 * @param r - Red channel (0-255)
 * @param g - Green channel (0-255)
 * @param b - Blue channel (0-255)
 * @returns Hex color string in the format #RRGGBB
 */
export const rgbToHex = (r: number, g: number, b: number) =>
  "#" +
  [r, g, b]
    .map(x => Math.round(x).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

/**
 * Determines if a color is bright based on its RGB values
 * @param r - Red channel (0-255)
 * @param g - Green channel (0-255)
 * @param b - Blue channel (0-255)
 * @param threshold - Threshold value for brightness check (0-100)
 * @returns true if color is bright
 */
export const isBright = (r: number, g: number, b: number, threshold = 85) => {
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > threshold / 100;
};
