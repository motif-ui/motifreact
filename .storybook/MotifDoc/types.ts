import { CSFFile, DocsContextProps } from "storybook/internal/types";
import { ReactRenderer } from "@storybook/nextjs";

export type MotifDocProps = {
  mdxFile?: boolean;
};

export type MotifDocMetaReadyDataProps = {
  componentName: string;
  isCompound?: boolean;
  tocElement: Element | null;
};

export type MotifDocContextProps = DocsContextProps<ReactRenderer> & {
  attachedCSFFiles?: Set<CSFFile>;
};

export type MotifDocContainerProps = {
  context: MotifDocContextProps;
};

export type MotifDocType = "componentStories" | "componentMdx" | "generalMdx";

export const DocumentTabs = [
  { id: "overview", label: "Overview" },
  { id: "styling", label: "Styling" },
];
