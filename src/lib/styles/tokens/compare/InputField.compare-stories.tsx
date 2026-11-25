import { composeStory, type Meta, type StoryObj } from "@storybook/nextjs";
import { ReactNode, useLayoutEffect, useRef } from "react";
import fieldStyles from "@/components/Motif/InputText/InputText.module.scss";
import fieldBaselineStyles from "./baseline/MotifInputText/MotifInputTextBaseline.module.scss";
import * as InputDateStories from "@/components/InputDate/InputDate.stories";
import * as InputDateRangeStories from "@/components/InputDateRange/InputDateRange.stories";
import * as InputDateTimeStories from "@/components/InputDateTime/InputDateTime.stories";
import * as InputTimeStories from "@/components/InputTime/InputTime.stories";
import * as NavBarStories from "@/components/NavBar/NavBar.stories";
import * as TableStories from "@/components/Table/Table.stories";
import { CompareRow, CompareSection, TokenCompare } from "./TokenCompare";

// The shared field's class names mapped to the baseline's, so Today renders these components with the current field.
// The right icon also carries iconRight and the right button iconButton, both icon before.
const CLASS_MAP = new Map(
  Object.entries(fieldStyles).flatMap(([key, name]) => {
    const baseline = fieldBaselineStyles[["iconRight", "iconButton"].includes(key) ? "icon" : key];
    return baseline ? [[name, baseline] as const] : [];
  }),
);

const swapClasses = (root: HTMLElement) =>
  root.querySelectorAll<HTMLElement>("[class]").forEach(element => {
    const classes = [...element.classList];
    classes.some(name => CLASS_MAP.has(name)) && (element.className = classes.map(name => CLASS_MAP.get(name) ?? name).join(" "));
  });

const WithBaselineField = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    swapClasses(root);
    const observer = new MutationObserver(() => swapClasses(root));
    observer.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return <div ref={ref}>{children}</div>;
};

type Row = { node: () => ReactNode };

const fromStory = (label: string, stories: Record<string, unknown>, name: string): CompareRow<Row> => {
  const Story = composeStory(stories[name] as StoryObj, stories.default as Meta);
  return { label, props: { node: () => <Story /> } };
};

const render = (today: boolean) => {
  const Rendered = ({ node }: Row) => (
    <div style={{ overflowX: "clip" }}>{today ? <WithBaselineField>{node()}</WithBaselineField> : node()}</div>
  );
  return Rendered;
};

const sections: CompareSection<Row>[] = [
  {
    title: "Components on the shared field",
    note: "Their field (border, surface, text) comes from the shared input field; their pickers and icons migrate later. Today renders them with the current field.",
    rows: [
      fromStory("InputDate", InputDateStories, "Primary"),
      fromStory("InputDateRange", InputDateRangeStories, "PrimaryStaticForChromatic"),
      fromStory("InputDateTime", InputDateTimeStories, "PrimaryStaticForChromatic"),
      fromStory("InputTime", InputTimeStories, "Primary"),
      fromStory("NavBar search", NavBarStories, "Search"),
      fromStory("Table filter", TableStories, "Filtering"),
    ],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/Input field users",
  component: TokenCompare,
  parameters: { layout: "padded" },
};
export default meta;

export const InputField_: StoryObj<typeof TokenCompare> = {
  name: "Input field users",
  render: () => <TokenCompare sections={sections} current={render(true)} next={render(false)} columnWidth={420} />,
};
