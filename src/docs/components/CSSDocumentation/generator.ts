export function extractClassesFromStyles(styles: Record<string, string>, componentName: string) {
  const classInfos = Object.keys(styles).map(key => {
    const suffix = key === "Root" ? "" : `__${key}`;
    const fullClass = `mtf-${componentName}${suffix}`;

    return {
      key,
      suffix,
      className: fullClass,
    };
  });

  return [...new Map(classInfos.map(c => [c.className, c])).values()].sort((a, b) => a.className.localeCompare(b.className));
}
