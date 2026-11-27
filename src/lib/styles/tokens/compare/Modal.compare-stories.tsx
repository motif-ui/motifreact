import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType } from "react";
import nextStyles from "@/components/Modal/Modal.module.scss";
import NextHeader from "@/components/Modal/components/ModalHeader";
import NextActions from "@/components/Modal/components/ModalActions";
import { ModalProps } from "@/components/Modal/types";
import { MotifIconButton } from "@/components/Motif/Icon";
import currentStyles from "./baseline/Modal/ModalBaseline.module.scss";
import CurrentHeader from "./baseline/Modal/components/ModalHeader";
import CurrentActions from "./baseline/Modal/components/ModalActions";
import { sanitizeModuleRootClasses } from "../../../../utils/cssUtils";
import { CompareSection, TokenCompare } from "./TokenCompare";

type Row = Omit<ModalProps, "children"> & { text?: string };
type HeaderProps = Pick<ModalProps, "title" | "subtitle">;
type ActionsProps = Pick<ModalProps, "actionButton" | "alternateButton" | "buttons">;

// Modal portals into document.body with position: fixed, so the preview draws the same markup in place with each
// version's own parts and classes
const preview =
  (styles: Readonly<Record<string, string>>, Header: ComponentType<HeaderProps>, Actions: ComponentType<ActionsProps>) =>
  ({ size = "md", closable, noContentPadding, title, subtitle, text, actionButton, alternateButton }: Row) => (
    <div
      className={sanitizeModuleRootClasses(styles, undefined, ["show", noContentPadding && "noContentPadding", size])}
      style={{ position: "relative", height: "auto", minHeight: 0, padding: 24, zIndex: 0 }}
    >
      <div className={styles.modal} style={{ position: "relative", top: 0, left: 0, transform: "none", maxHeight: 280 }}>
        {closable && <MotifIconButton name="close" size="xxl" className={styles.closeButton} />}
        <Header title={title} subtitle={subtitle} />
        <div className={styles.content}>{text}</div>
        <Actions actionButton={actionButton} alternateButton={alternateButton} />
      </div>
    </div>
  );

const Current = preview(currentStyles, CurrentHeader, CurrentActions);
const Next = preview(nextStyles, NextHeader, NextActions);

const noop = () => undefined;
const TEXT = "Your changes are saved as a draft. Publish them to make the page visible to everyone on the team.";
const base: Row = {
  size: "sm",
  title: "Publish changes",
  subtitle: "3 pages changed",
  text: TEXT,
  actionButton: { text: "Publish", onClick: noop },
  alternateButton: { text: "Cancel", onClick: noop },
};

const sections: CompareSection<Row>[] = [
  {
    title: "Content",
    rows: [
      { label: "default", props: base },
      { label: "closable", props: { ...base, closable: true } },
      { label: "title only", props: { ...base, subtitle: undefined } },
      { label: "no header", props: { ...base, title: undefined, subtitle: undefined } },
      { label: "no actions", props: { ...base, actionButton: undefined, alternateButton: undefined } },
      { label: "noContentPadding", props: { ...base, noContentPadding: true } },
    ],
  },
  {
    title: "Scrolling content",
    note: "The content scrolls inside the box; the scrollbar takes border-strong on a transparent track.",
    rows: [{ label: "long text", props: { ...base, text: Array(8).fill(TEXT).join(" ") } }],
  },
  {
    title: "Sizes",
    note: "size only changes the width (sizing-320 · 480 · 720 · 960); lg and xl do not fit the column and are not shown.",
    rows: (["sm", "md"] as const).map(size => ({ label: size, props: { ...base, size } })),
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/Modal",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Modal_: StoryObj<typeof TokenCompare> = {
  name: "Modal",
  render: () => <TokenCompare sections={sections} current={Current} next={Next} columnWidth={540} />,
};
