import { useContext, useLayoutEffect, useMemo, useState } from "react";
import styles from "./CSSClassNames.module.scss";
import { extractClassesFromStyles } from "../generator";
import generatedClassNames from "../generated/classNames.generated.json";
import { DocsContext } from "@storybook/addon-docs/blocks";
import { CSFFile, DocsContextProps } from "storybook/internal/types";
import { ReactRenderer } from "@storybook/nextjs";

const classNamesByScssPath: Record<string, string[]> = generatedClassNames;

const CSSClassNames = () => {
  const [readyData, setReadyData] = useState<{
    componentName?: string;
    scssPath?: string;
  }>();
  const { componentName, scssPath } = readyData || {};
  const { attachedCSFFiles } = useContext<DocsContextProps<ReactRenderer> & { attachedCSFFiles?: Set<CSFFile> }>(DocsContext);

  useLayoutEffect(() => {
    /**
     * We need to wait for the meta to be available in the context before trying to access it, otherwise we might run
     * into issues where the meta is not yet set when we try to access it. This is especially important for MDX files,
     * where the meta is not available until after the first render.
     */
    const componentStoryFilePath = Array.from(attachedCSFFiles ?? [])[0]?.meta?.parameters?.fileName as string | undefined;
    setReadyData({
      componentName: componentStoryFilePath?.split("/").pop()?.replace(".stories.tsx", ""),
      scssPath: componentStoryFilePath?.replace("./src/lib/components/", "").replace(".stories.tsx", ".module.scss"),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const extracted = useMemo(() => {
    if (!scssPath || !componentName) return [];

    return extractClassesFromStyles(classNamesByScssPath[scssPath] ?? [], componentName);
  }, [scssPath, componentName]);

  return (
    <div>
      <h3>Class Names</h3>
      <p>
        The list of the css class names that are used inside this component. These BEM-style class names references to the parts of the
        components for developing a custom theme or just customizing the component.
      </p>
      <div className={styles.grid}>
        {extracted
          .toSorted((a, b) => a.suffix.localeCompare(b.suffix))
          .map(item => (
            <div className={styles.gridItem} key={item.className}>
              {item.className}
            </div>
          ))}
      </div>
    </div>
  );
};

export default CSSClassNames;
