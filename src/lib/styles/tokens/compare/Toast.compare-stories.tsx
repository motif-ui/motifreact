import type { Meta, StoryObj } from "@storybook/nextjs";
import Toast from "@/components/Toast/Toast";
import { ToastProps } from "@/components/Toast/types";
import ToastBaseline from "./baseline/Toast/Toast";
import { ToastVariant as BaselineVariant } from "./baseline/Toast/types";
import { CompareSection, TokenCompare } from "./TokenCompare";

type Row = Omit<ToastProps, "id" | "position">;

// Today has no neutral, primary or accent: its light gray secondary is the new neutral
const Current = ({ variant, ...props }: Row) => (
  <ToastBaseline id="current" position="topRight" {...props} variant={(variant === "neutral" ? "secondary" : variant) as BaselineVariant} />
);
const Next = (props: Row) => <Toast id="next" position="topRight" {...props} />;

const VARIANTS = ["neutral", "primary", "secondary", "accent", "info", "success", "warning", "danger"] as const;
const base: Row = {
  variant: "info",
  title: "Upload complete",
  content: "The report is saved to your files.",
  icon: "info",
  closable: true,
};

const sections: CompareSection<Row>[] = [
  {
    title: "Variants",
    note: "Today's secondary (light gray) is now neutral; secondary is the brand color. Today has no primary or accent. Soft fill over the raised surface, elevation-3.",
    rows: VARIANTS.map(variant => ({ label: variant, props: { ...base, variant } })),
  },
  {
    title: "Content",
    note: "The icon and the close button are 24px and sit on the title's line.",
    rows: [
      { label: "title + content", props: base },
      { label: "content only", props: { ...base, title: undefined } },
      { label: "no icon", props: { ...base, icon: undefined } },
      { label: "not closable", props: { ...base, closable: false } },
      { label: "with duration", props: { ...base, duration: 1e9 } },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/Toast",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Toast_: StoryObj<typeof TokenCompare> = {
  name: "Toast",
  render: () => <TokenCompare sections={sections} current={Current} next={Next} columnWidth={300} />,
};
