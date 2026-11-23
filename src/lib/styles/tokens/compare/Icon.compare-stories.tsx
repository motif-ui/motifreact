import { composeStory, type Meta, type StoryObj } from "@storybook/nextjs";
import * as NavBarStories from "@/components/NavBar/NavBar.stories";
import * as CarouselStories from "@/components/Carousel/Carousel.stories";
import * as TableStories from "@/components/Table/Table.stories";
import * as BusinessCardStories from "@/components/BusinessCard/BusinessCard.stories";
import * as InputDateStories from "@/components/InputDate/InputDate.stories";
import * as InputDateRangeStories from "@/components/InputDateRange/InputDateRange.stories";
import * as InputDateTimeStories from "@/components/InputDateTime/InputDateTime.stories";
import * as InputTimeStories from "@/components/InputTime/InputTime.stories";
import * as UploadInputStories from "@/components/Upload/UploadInput/UploadInput.stories";
import * as UploadDraggerStories from "@/components/Upload/UploadDragger/UploadDragger.stories";
import * as ImageUploadStories from "@/components/Upload/ImageUpload/ImageUpload.stories";
import * as AccordionStories from "@/components/Accordion/Accordion.stories";
import * as AvatarStories from "@/components/Avatar/Avatar.stories";
import * as BadgeStories from "@/components/Badge/Badge.stories";
import * as BreadcrumbStories from "@/components/Breadcrumb/Breadcrumb.stories";
import * as ButtonStories from "@/components/Button/Button.stories";
import * as ButtonGroupStories from "@/components/ButtonGroup/ButtonGroup.stories";
import * as DataViewStories from "@/components/DataView/DataView.stories";
import * as LinkStories from "@/components/Link/Link.stories";
import * as ListViewStories from "@/components/ListView/ListView.stories";
import * as PaginationStories from "@/components/Pagination/Pagination.stories";
import * as StepperStories from "@/components/Stepper/Stepper.stories";
import * as TabStories from "@/components/Tab/Tab.stories";
import * as TimelineStories from "@/components/Timeline/Timeline.stories";
import * as PanelStories from "@/components/Panel/Panel.stories";
import * as MenuListStories from "@/components/MenuList/MenuList.stories";
import * as DropdownStories from "@/components/Dropdown/Dropdown.stories";
import * as DatePickerStories from "@/components/DatePicker/DatePicker.stories";
import * as DateRangePickerStories from "@/components/DateRangePicker/DateRangePicker.stories";
import * as DateTimePickerStories from "@/components/DateTimePicker/DateTimePicker.stories";
import { ComponentType, ReactNode, useLayoutEffect, useRef } from "react";
import IconButton from "@/components/IconButton/IconButton";
import MotifIcon from "@/components/Motif/Icon/MotifIcon";
import motifIconStyles from "@/components/Motif/Icon/MotifIcon.module.scss";
import Alert from "@/components/Alert/Alert";
import Chip from "@/components/Chip/Chip";
import Select from "@/components/Select/Select";
import InputText from "@/components/InputText/InputText";
import InputPassword from "@/components/InputPassword/InputPassword";
import Card from "@/components/Card/Card";
import Toast from "@/components/Toast/Toast";
import iconStyles from "@/components/Icon/Icon.module.scss";
import iconButtonStyles from "@/components/IconButton/IconButton.module.scss";
import { IconButtonProps } from "@/components/IconButton/types";
import { Size8LG, VariantV2 } from "../../../types";
import IconBaseline from "./baseline/Icon/Icon";
import IconButtonBaseline from "./baseline/IconButton/IconButton";
import iconBaselineStyles from "./baseline/Icon/IconBaseline.module.scss";
import iconButtonBaselineStyles from "./baseline/IconButton/IconButtonBaseline.module.scss";
import { CompareSection, CompareRow, TokenCompare } from "./TokenCompare";

const SIZES: Size8LG[] = ["xxs", "xs", "sm", "md", "lg", "xl", "xxl", "xxxl"];
const VARIANTS: VariantV2[] = ["neutral", "primary", "secondary", "accent", "info", "success", "warning", "danger"];
const BUTTON_VARIANTS: NonNullable<IconButtonProps["variant"]>[] = [...VARIANTS, "strong", "negative"];
const noop = () => {};

// The neutral of the new code was the gray secondary of the current one
const toBaseline = (key: string) => (key === "neutral" ? "secondary" : key);

// Class names of the live Icon and IconButton mapped to the baseline's, so a library component in the Today column renders
// its icons with the current styles
const CLASS_MAP = new Map(
  [
    [iconStyles, iconBaselineStyles],
    [iconButtonStyles, iconButtonBaselineStyles],
  ].flatMap(([live, baseline]) =>
    Object.entries(live)
      .map(([key, name]) => [name, baseline[toBaseline(key)]] as const)
      .filter((entry): entry is readonly [string, string] => !!entry[1]),
  ),
);

const swapClasses = (root: HTMLElement) =>
  root.querySelectorAll<HTMLElement>("[class]").forEach(element => {
    const classes = [...element.classList];
    classes.some(name => CLASS_MAP.has(name)) && (element.className = classes.map(name => CLASS_MAP.get(name) ?? name).join(" "));
  });

// Keeps swapping while the component re-renders (a Select opening, a Toast's countdown)
const WithBaselineIcons = ({ children }: { children: ReactNode }) => {
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

type Row = { view: "icon" | "button" | "component"; size?: Size8LG; variant?: string; node?: () => ReactNode };

const ICON_NAMES = ["home", "info", "check_circle", "warning", "close"];

const render = (
  IconView: ComponentType<{ name: string; size?: Size8LG; variant?: VariantV2 }>,
  ButtonView: ComponentType<IconButtonProps>,
  today: boolean,
) => {
  const Rendered = ({ view, size, variant: given, node }: Row) => {
    const variant = today && given ? toBaseline(given) : given;
    if (view === "icon") {
      return (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {ICON_NAMES.map(name => (
            <IconView key={name} name={name} size={size} variant={variant as VariantV2} />
          ))}
        </div>
      );
    }
    if (view === "button") {
      const props = { name: "close", variant: variant as IconButtonProps["variant"], size } as IconButtonProps;
      return (
        <div style={{ display: "flex", gap: 16, alignItems: "center", ...(given === "negative" && { background: "#1d262d", padding: 8 }) }}>
          <ButtonView {...props} />
          <ButtonView {...props} disabled />
        </div>
      );
    }
    return today ? <WithBaselineIcons>{node?.()}</WithBaselineIcons> : <>{node?.()}</>;
  };
  return Rendered;
};

// The baseline Icon with the embedded icon font, like MotifIcon
const MotifIconBaseline = (props: { name: string; size?: Size8LG; variant?: VariantV2 }) => (
  <IconBaseline iconClass={motifIconStyles.motifIconsDefault} {...props} variant={props.variant as never} />
);

// The baseline's variant type has no neutral or accent; render() maps neutral to secondary before it gets here
const IconButtonBaselineView = IconButtonBaseline as unknown as ComponentType<IconButtonProps>;

// A library component as its own story shows it, so the row follows the story when the component changes
const fromStory = (label: string, stories: Record<string, unknown>, name: string, args?: Record<string, unknown>): CompareRow<Row> => {
  const Story = composeStory(stories[name] as StoryObj, stories.default as Meta);
  // Wide components (pickers, groups) are cut at the column's edge rather than spilling into the next one
  return {
    label,
    props: {
      view: "component",
      node: () => (
        <div style={{ overflowX: "clip" }}>
          <Story {...args} />
        </div>
      ),
    },
  };
};

const sections: CompareSection<Row>[] = [
  {
    title: "Icon · sizes",
    rows: SIZES.map(size => ({ label: size, props: { view: "icon", size } })),
  },
  {
    title: "Icon · variants",
    note: "Today has no neutral or accent: neutral is shown with the gray secondary, accent stays uncolored. Secondary is now the brand color.",
    rows: VARIANTS.map(variant => ({ label: variant, props: { view: "icon", variant } })),
  },
  {
    title: "IconButton · variants (default, disabled)",
    note: "The default variant is now neutral (was the gray secondary). Hover and pressed take the solid's hover and active tones; Tab shows a focus ring.",
    rows: BUTTON_VARIANTS.map(variant => ({ label: variant, props: { view: "button", variant } })),
  },
  {
    title: "IconButton · sizes (default, disabled)",
    note: "xxxl had no size rule, so its icon fell back to md (22px); it is now 52px like Icon.",
    rows: SIZES.map(size => ({ label: size, props: { view: "button", variant: "neutral", size } })),
  },
  {
    title: "In components · icon buttons and colored icons",
    note: "Today renders the live components with the current Icon and IconButton styles. Modal and AlertModal open over the page, so they are not shown; their close button is the default IconButton, like the Card action.",
    rows: [
      {
        label: "Alert close",
        props: { view: "component", node: () => <Alert title="Saved" message="Your changes are saved." closable /> },
      },
      {
        label: "Chip close",
        props: {
          view: "component",
          node: () => (
            <div style={{ display: "flex", gap: 8 }}>
              <Chip label="Neutral" closable />
              <Chip label="Primary" variant="primary" closable />
            </div>
          ),
        },
      },
      {
        label: "Select chips",
        props: {
          view: "component",
          node: () => (
            <Select
              data={[
                { label: "Istanbul", value: "34" },
                { label: "Ankara", value: "06" },
              ]}
              multiple
              filterable
              value={["34", "06"]}
            />
          ),
        },
      },
      { label: "InputText clear", props: { view: "component", node: () => <InputText value="Motif" clearable /> } },
      { label: "InputPassword", props: { view: "component", node: () => <InputPassword value="secret" toggleMask /> } },
      {
        label: "Toast",
        props: {
          view: "component",
          node: () => (
            <Toast id="compare" position="topRight" variant="info" title="Info" content="Icon and close button" icon="info" closable />
          ),
        },
      },
      {
        label: "Card action",
        props: { view: "component", node: () => <Card title="Card" subtitle="Action button" action={{ icon: "close", onClick: noop }} /> },
      },
      fromStory("NavBar", NavBarStories, "Primary"),
      fromStory("Carousel", CarouselStories, "Primary"),
      fromStory("Table", TableStories, "Sorting"),
      fromStory("BusinessCard", BusinessCardStories, "Primary", { iconButton: { icon: "download", onClick: noop } }),
      fromStory("InputDate", InputDateStories, "Primary"),
      fromStory("InputDateRange", InputDateRangeStories, "PrimaryStaticForChromatic"),
      fromStory("InputDateTime", InputDateTimeStories, "PrimaryStaticForChromatic"),
      fromStory("InputTime", InputTimeStories, "Primary"),
      fromStory("UploadInput", UploadInputStories, "Downloading"),
      fromStory("UploadDragger", UploadDraggerStories, "Downloading"),
      fromStory("ImageUpload", ImageUploadStories, "Primary", {
        value: { id: "compare", name: "image.jpg", size: 204800, type: "image/jpeg", src: "https://picsum.photos/300/300" },
      }),
    ],
  },
  {
    title: "In components · uncolored icons",
    note: "The icon takes the color around it; only the size token changed (same pixels).",
    rows: [
      fromStory("Accordion", AccordionStories, "Primary"),
      fromStory("Avatar", AvatarStories, "Primary"),
      fromStory("Badge", BadgeStories, "Icon"),
      fromStory("Breadcrumb", BreadcrumbStories, "Primary"),
      fromStory("Button", ButtonStories, "Primary"),
      fromStory("ButtonGroup", ButtonGroupStories, "Primary"),
      fromStory("DataView", DataViewStories, "Primary"),
      fromStory("Link", LinkStories, "Primary"),
      fromStory("ListView", ListViewStories, "Primary"),
      fromStory("Pagination", PaginationStories, "Primary"),
      fromStory("Stepper", StepperStories, "Primary"),
      fromStory("Tab", TabStories, "Primary"),
      fromStory("Timeline", TimelineStories, "Primary"),
      fromStory("Panel", PanelStories, "Primary"),
      fromStory("MenuList", MenuListStories, "Primary"),
      fromStory("Dropdown", DropdownStories, "Primary"),
    ],
  },
  {
    title: "In components · panels",
    rows: [
      fromStory("DatePicker", DatePickerStories, "PrimaryStaticForChromatic"),
      fromStory("DateRangePicker", DateRangePickerStories, "PrimaryStaticForChromatic"),
      fromStory("DateTimePicker", DateTimePickerStories, "PrimaryStaticForChromatic"),
    ],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/Icon",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Icon_: StoryObj<typeof TokenCompare> = {
  name: "Icon",
  render: () => (
    <TokenCompare
      sections={sections}
      current={render(MotifIconBaseline, IconButtonBaselineView, true)}
      next={render(MotifIcon, IconButton, false)}
      columnWidth={400}
    />
  ),
};
