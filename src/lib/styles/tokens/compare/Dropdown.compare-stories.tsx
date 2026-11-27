import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType, CSSProperties, Context } from "react";
import nextStyles from "@/components/Dropdown/Dropdown.module.scss";
import NextButton from "@/components/Dropdown/components/DropdownButton";
import NextItem from "@/components/Dropdown/components/DropdownMenuItem";
import { DropdownContext as NextContext } from "@/components/Dropdown/context/DropdownContext";
import { DropdownContextProps, DropdownMenuItemProps, DropdownProps } from "@/components/Dropdown/types";
import Button from "@/components/Button/Button";
import currentStyles from "./baseline/Dropdown/DropdownBaseline.module.scss";
import CurrentButton from "./baseline/Dropdown/components/DropdownButton";
import CurrentItem from "./baseline/Dropdown/components/DropdownMenuItem";
import { DropdownContext as CurrentContext } from "./baseline/Dropdown/context/DropdownContext";
import ButtonBaseline from "./baseline/Button/Button";
import { sanitizeModuleClasses, sanitizeModuleRootClasses } from "../../../../utils/cssUtils";
import { CompareSection, TokenCompare } from "./TokenCompare";

type Row = Omit<DropdownProps, "items"> & { items?: DropdownMenuItemProps[]; menu?: boolean; besideButton?: boolean };

type Parts = {
  styles: Readonly<Record<string, string>>;
  Trigger: ComponentType<{ label?: string; icon?: DropdownProps["icon"]; className?: string }>;
  Item: ComponentType<DropdownMenuItemProps>;
  Ctx: Context<DropdownContextProps>;
  ButtonView: ComponentType<{ label: string; size: DropdownProps["size"]; variant?: string }>;
  // Today has no neutral: its light gray secondary is the new neutral. Today's textOnly has no variant by default.
  variantOf: (variant: DropdownProps["variant"], shape: DropdownProps["shape"]) => string | false | undefined;
};

// The menu is a portal on document.body in the component; the preview draws the button and the open menu in place with
// each version's own parts and classes
const preview =
  ({ styles, Trigger, Item, Ctx, ButtonView, variantOf }: Parts) =>
  (props: Row) => {
    const {
      size = "md",
      shape = "solid",
      spacing = "callout",
      variant,
      pill,
      disabled,
      label,
      icon,
      items = [],
      menu,
      besideButton,
    } = props;
    const classNames = sanitizeModuleRootClasses(styles, undefined, [
      size,
      shape,
      variantOf(variant, shape),
      menu && "open",
      pill && "pill",
    ]);

    return (
      <Ctx value={{ size, disabled, hideMenu: () => undefined }}>
        <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-end", gap: 0 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Trigger className={classNames} label={label} icon={icon} />
            {besideButton && <ButtonView label="Button" size={size} variant={variant} />}
          </div>
          {menu && (
            <div
              className={sanitizeModuleClasses(styles, "Menu", size, spacing, "bottom")}
              style={{ position: "relative", marginInline: 0, "--overlay-anchor-right": "100%" } as CSSProperties}
            >
              <ul className={styles.MenuList}>
                {items.map((item, index) => (
                  <Item key={index} {...item} />
                ))}
              </ul>
            </div>
          )}
        </div>
      </Ctx>
    );
  };

const Current = preview({
  styles: currentStyles,
  Trigger: CurrentButton,
  Item: CurrentItem as ComponentType<DropdownMenuItemProps>,
  Ctx: CurrentContext,
  ButtonView: ButtonBaseline as ComponentType<{ label: string; size: DropdownProps["size"]; variant?: string }>,
  variantOf: (variant, shape) => (variant === "neutral" ? "secondary" : (variant ?? (shape === "solid" && "primary"))),
});
const Next = preview({
  styles: nextStyles,
  Trigger: NextButton,
  Item: NextItem,
  Ctx: NextContext,
  ButtonView: Button as ComponentType<{ label: string; size: DropdownProps["size"]; variant?: string }>,
  variantOf: (variant, shape) => variant ?? (shape === "solid" ? "primary" : "neutral"),
});

const VARIANTS = ["neutral", "primary", "secondary", "accent", "info", "success", "warning", "danger"] as const;
const SIZES = ["xs", "sm", "md", "lg"] as const;
const ITEMS: DropdownMenuItemProps[] = [
  { header: "Account" },
  { label: "Profile", icon: "person" },
  { label: "Settings", icon: "settings" },
  { label: "Archived", disabled: true },
];
const base: Row = { label: "Dropdown", size: "md" };

const sections: CompareSection<Row>[] = [
  {
    title: "Variants (solid)",
    note: "Today's neutral is its light gray secondary; Today has no accent. The default is primary.",
    rows: VARIANTS.map(variant => ({ label: variant, props: { ...base, variant } })),
  },
  {
    title: "Variants (textOnly)",
    note: "textOnly without a variant is neutral (Today: gray); with one it takes the variant's text color, like Button's textonly.",
    rows: [
      { label: "no variant", props: { ...base, shape: "textOnly" } },
      ...VARIANTS.filter(variant => variant !== "neutral").map(variant => ({
        label: variant,
        props: { ...base, shape: "textOnly" as const, variant },
      })),
    ],
  },
  {
    title: "Sizes, beside a Button",
    note: "The button is Button's box: heights 24 · 32 · 40 · 48.",
    rows: SIZES.map(size => ({ label: size, props: { ...base, size, icon: "home", besideButton: true } })),
  },
  {
    title: "States",
    rows: [
      { label: "pill", props: { ...base, pill: true } },
      { label: "disabled", props: { ...base, disabled: true } },
      { label: "textOnly · disabled", props: { ...base, shape: "textOnly", disabled: true } },
    ],
  },
  {
    title: "Menu",
    note: "Items are Select's options: text-{size}, hover neutral-soft, border-soft between items; the header is text-softer.",
    rows: SIZES.map(size => ({ label: size, props: { ...base, size, menu: true, items: ITEMS } })),
  },
  {
    title: "Menu spacing",
    rows: (["callout", "withGap", "noSpace"] as const).map(spacing => ({
      label: spacing,
      props: { ...base, spacing, menu: true, items: ITEMS },
    })),
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Compare/Dropdown",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Dropdown_: StoryObj<typeof TokenCompare> = {
  name: "Dropdown",
  render: () => <TokenCompare sections={sections} current={Current} next={Next} columnWidth={280} />,
};
