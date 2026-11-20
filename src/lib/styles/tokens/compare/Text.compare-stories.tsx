import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType } from "react";
import Text from "@/components/Text/Text";
import { TextProps, TextVariants } from "@/components/Text/types";
import TextBaseline from "./baseline/Text/Text";
import { CompareSection, TokenCompare } from "./TokenCompare";

const TYPES = ["body", "paragraph", "caption", "heading", "display"] as const;
const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;
const TONES = ["softer", "soft", "normal", "strong", "stronger"] as const;
const WEIGHTS = ["light", "regular", "medium", "semibold", "bold"] as const;
const VARIANTS: TextVariants[] = [
  "title1",
  "title2",
  "title3",
  "body1",
  "body2",
  "body3",
  "body4",
  "body5",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p1",
  "p2",
  "p3",
];

const Current = TextBaseline as ComponentType<TextProps>;
// Two lines, so the line height shows; marginless keeps the rows comparable
const TEXT = "The quick brown fox jumps over the lazy dog. Motif UI";

const sections: CompareSection<TextProps>[] = [
  ...TYPES.map(type => ({
    title: `type=${type}`,
    rows: SIZES.map(size => ({ label: size, props: { type, size, text: TEXT, marginless: true } })),
  })),
  { title: "tone", rows: TONES.map(tone => ({ label: tone, props: { tone, text: TEXT, marginless: true } })) },
  { title: "weight", rows: WEIGHTS.map(weight => ({ label: weight, props: { weight, text: TEXT, marginless: true } })) },
  {
    title: "variant (deprecated)",
    rows: VARIANTS.map(variant => ({ label: variant, props: { variant, text: TEXT, marginless: true } })),
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/Text",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Text_: StoryObj<typeof TokenCompare> = {
  name: "Text",
  render: () => <TokenCompare sections={sections} current={Current} next={Text} />,
};
