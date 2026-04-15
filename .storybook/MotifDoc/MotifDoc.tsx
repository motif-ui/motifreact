import { PropsWithChildren, useContext, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Controls, Description, DocsContext, Primary, Subtitle, Title } from "@storybook/addon-docs/blocks";
import { MotifDocTabs } from "./MotifDocTabs";
import { MotifDocContextProps, MotifDocMetaReadyDataProps, MotifDocProps, MotifDocType } from "./types";
import CSSClassNames from "../../src/docs/components/CSSDocumentation/components/CSSClassNames";

export const MotifDoc = (props: PropsWithChildren<MotifDocProps>) => {
  const { children, mdxFile } = props;
  const [metaReadyData, setMetaReadyData] = useState<MotifDocMetaReadyDataProps>();
  const { componentName, tocElement, isCompound } = metaReadyData || {};
  const [activeTab, setActiveTab] = useState("overview");
  const { attachedCSFFiles } = useContext<MotifDocContextProps>(DocsContext);

  const docType: MotifDocType = !attachedCSFFiles?.size ? "generalMdx" : mdxFile ? "componentMdx" : "componentStories";

  useLayoutEffect(() => {
    /**
     * We need to wait for the meta to be available in the context before trying to access it, otherwise we might run
     * into issues where the meta is not yet set when we try to access it. This is especially important for MDX files,
     * where the meta is not available until after the first render.
     */
    const componentFullName = Array.from(attachedCSFFiles ?? [])[0]?.meta?.title ?? "null";
    setMetaReadyData({
      componentName: componentFullName,
      isCompound: componentFullName.split("/").length > 2,
      tocElement: document.querySelector("aside .toc-wrapper")!,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return docType === "generalMdx" ? (
    children
  ) : (
    <>
      <Title />
      <Subtitle />
      <Description />
      {!isCompound && <MotifDocTabs activeTab={activeTab} onTabChange={setActiveTab} />}

      <div style={{ display: activeTab === "overview" ? "block" : "none" }}>
        <Primary />
        <Controls />
        {docType === "componentMdx" && children}
      </div>
      {!isCompound && activeTab === "styling" && componentName && (
        <>
          <CSSClassNames />
          {docType === "componentMdx" &&
            tocElement &&
            createPortal(
              <ul className="toc-list toc-list-css-classes">
                <li className="toc-list-item">Class Names</li>
              </ul>,
              tocElement,
            )}
        </>
      )}
    </>
  );
};
