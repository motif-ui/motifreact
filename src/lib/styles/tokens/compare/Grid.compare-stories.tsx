import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType, ReactNode } from "react";
import Grid from "@/components/Grid";
import { GridProps } from "@/components/Grid/types";
import Form from "@/components/Form";
import InputText from "@/components/InputText";
import GridBaseline from "./baseline/Grid/Grid";
import FormBaseline from "./baseline/Form/Form";
import { CompareSection, TokenCompare } from "./TokenCompare";

const GUTTERS = ["xxs", "xs", "sm", "md", "lg", "xl", "xxl"] as const;
type Props = Omit<GridProps, "children"> & { inForm?: boolean };
type AnyGrid = ComponentType<Record<string, unknown>> & {
  Row: ComponentType<{ children: ReactNode }>;
  Col: ComponentType<{ children: ReactNode; size?: number }>;
};
type AnyForm = ComponentType<Record<string, unknown>> & { Field: ComponentType<{ name: string; label: string; children: ReactNode }> };

// A tinted cell shows each Col; the tinted Grid background shows the padding
const cell = {
  background: "var(--mtf-color-primary-soft)",
  color: "var(--mtf-color-text-default)",
  padding: 4,
  textAlign: "center",
} as const;

const render = (G: AnyGrid, F: AnyForm) => {
  const Rendered = ({ inForm, ...props }: Props) => {
    const grid = (
      <div style={{ background: "var(--mtf-color-surface-sunken)" }}>
        <G fluid {...props}>
          <G.Row>
            {inForm
              ? ["Name", "Surname", "City", "Country"].map(label => (
                  <G.Col key={label} size={6}>
                    <F.Field name={label} label={label}>
                      <InputText placeholder={label} />
                    </F.Field>
                  </G.Col>
                ))
              : [1, 2, 3, 4, 5, 6].map(i => (
                  <G.Col key={i} size={4}>
                    <div style={cell}>{i}</div>
                  </G.Col>
                ))}
          </G.Row>
        </G>
      </div>
    );
    return inForm ? <F>{grid}</F> : grid;
  };
  return Rendered;
};

const sections: CompareSection<Props>[] = [
  {
    title: "Gutter",
    note: "gutter sets the gap and the padding: xxs 4, xs 8, sm 16, md 24, lg 32, xl 64, xxl 128.",
    rows: GUTTERS.map(gutter => ({ label: gutter, props: { gutter } })),
  },
  {
    title: "Gap and padding",
    rows: [
      { label: "default", props: {} },
      { label: "gap md", props: { gap: "md" } },
      { label: "padding none", props: { padding: "none" } },
      { label: "column gap xl", props: { columnGap: "xl" } },
    ],
  },
  {
    title: "In a Form",
    note: "A Grid in a Form, the Form's md size. The Form's gaps for its Grids come with the Form and Grid fix.",
    rows: [{ label: "md form", props: { inForm: true } }],
  },
];

const meta: Meta<typeof TokenCompare> = { title: "Token Compare/Grid", component: TokenCompare, parameters: { layout: "padded" } };
export default meta;

export const Grid_: StoryObj<typeof TokenCompare> = {
  name: "Grid",
  render: () => (
    <TokenCompare
      sections={sections}
      current={render(GridBaseline as unknown as AnyGrid, FormBaseline as unknown as AnyForm)}
      next={render(Grid as unknown as AnyGrid, Form as unknown as AnyForm)}
      columnWidth={420}
    />
  ),
};
