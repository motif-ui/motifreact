/**
 * Creates a transform function for Storybook story source code snippets.
 *
 * This utility generates properly formatted JSX code strings from component args,
 * preserving function serialization and nested object structures. It handles:
 * - String props as quoted attributes
 * - Boolean props as shorthand or omitted
 * - Function props serialized with .toString()
 * - Nested objects with function properties (e.g., onClick callbacks)
 * - Deeply nested structures with recursive serialization
 *
 * @param componentName - The name of the component to render in the code snippet
 * @param excludedKeys - Array of prop keys to exclude from the generated code (e.g., ["children", "open"])
 * @param customTemplate - Optional function to override the default template with custom JSX structure.
 *                         Receives the formatted args string and returns the complete code snippet.
 *
 * @returns A Storybook transform function that converts story args into formatted JSX code
 *
 * @example
 * // Basic usage with default template
 * transform: formatStoryTransform("Button", ["children"])
 * // Output: <Button label="Click me" onClick={() => console.log("clicked")} />
 *
 * @example
 * // Advanced usage with custom template
 * transform: formatStoryTransform("Modal", ["children", "open"], (argsString) => `
 *   const { visible, show, hide } = useToggle(false);
 *   return (
 *     <Modal open={visible} onClose={hide} ${argsString}>
 *       <p>Content</p>
 *     </Modal>
 *   );
 * `)
 */
export const formatStoryTransform =
  (componentName: string, excludedKeys?: string[], customTemplate?: (argsString: string) => string) =>
  (_: string, { args }: { args: Record<string, unknown> }) => {
    const serializeValue = (value: unknown): string =>
      typeof value === "function"
        ? value.toString()
        : Array.isArray(value)
          ? `[${value.map(serializeValue).join(", ")}]`
          : typeof value === "object" && value
            ? `{${Object.entries(value as Record<string, unknown>)
                .map(([k, v]) => `${k}: ${serializeValue(v)}`)
                .join(", ")}}`
            : JSON.stringify(value);

    const argsString = Object.entries(args)
      .filter(([key]) => !excludedKeys?.includes(key))
      .map(([key, value]) =>
        typeof value === "string"
          ? `${key}="${value}"`
          : typeof value === "boolean"
            ? value
              ? key
              : ""
            : typeof value === "function"
              ? `${key}={${value.toString()}}`
              : typeof value === "object" && value
                ? `${key}={${serializeValue(value)}}`
                : `${key}={${JSON.stringify(value)}}`,
      )
      .filter(Boolean)
      .join("\n  ");

    return customTemplate ? customTemplate(argsString) : `<${componentName}\n  ${argsString}\n/>`;
  };
