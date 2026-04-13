import { DocsContainer } from "@storybook/addon-docs/blocks";
import "../../src/lib/styles/themes/default-theme.css";
import { PropsWithChildren } from "react";
import "./styles.scss";
import { MotifDoc } from "./MotifDoc";
import { MotifDocContainerProps } from "./types";

export const MotifDocContainer = (props: PropsWithChildren<MotifDocContainerProps>) => {
  const { context, children } = props;
  const isMdxFile = !context.attachedCSFFiles?.size;

  return (
    <DocsContainer context={context}>
      <MotifDoc mdxFile={isMdxFile}>{children}</MotifDoc>
    </DocsContainer>
  );
};
