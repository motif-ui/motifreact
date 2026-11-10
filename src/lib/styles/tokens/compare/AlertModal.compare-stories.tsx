import type { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentType } from "react";
import currentStyles from "@/components/AlertModal/AlertModal.module.scss";
import CurrentContent from "@/components/AlertModal/components/AlertModalContent";
import CurrentActions from "@/components/AlertModal/components/AlertModalActions";
import nextStyles from "@/components/AlertModalV2/AlertModalV2.module.scss";
import NextContent from "@/components/AlertModalV2/components/AlertModalContent";
import NextActions from "@/components/AlertModalV2/components/AlertModalActions";
import { AlertModalProps } from "@/components/AlertModalV2/types";
import { sanitizeModuleRootClasses } from "../../../../utils/cssUtils";
import { CompareSection, TokenCompare } from "./TokenCompare";

type PartProps = Pick<AlertModalProps, "title" | "text" | "icon" | "variant" | "actionButton" | "alternateButton">;

// AlertModal portals into document.body with position: fixed, so it cannot sit in a compare cell. The preview draws the
// same markup with each version's own parts and classes, in place: only the portal and the fixed position are left out.
const preview =
  (styles: Readonly<Record<string, string>>, Content: ComponentType<PartProps>, Actions: ComponentType<PartProps>) =>
  (props: AlertModalProps) => {
    const { size = "md", variant = "primary", buttonsPosition = "center", contentPosition = "center", ...rest } = props;
    const { removeBackdrop, enableDivider, bordered, elevated, actionButton, alternateButton } = rest;
    const classNames = sanitizeModuleRootClasses(styles, undefined, [
      "show",
      !removeBackdrop && "backdrop",
      bordered && "bordered",
      elevated && "elevated",
      enableDivider && "withDivider",
      `content_${contentPosition}`,
      `actions_${buttonsPosition}`,
      size,
      variant,
    ]);

    return (
      <div className={classNames} style={{ position: "relative", zIndex: 0, padding: 24 }}>
        <div className={styles.alertModalContainer}>
          <Content {...rest} variant={variant} />
          {(actionButton || alternateButton) && <Actions {...rest} variant={variant} />}
        </div>
      </div>
    );
  };

// Until promotion the current parts take the old Variant, which has no neutral/accent
const Current = preview(currentStyles, CurrentContent as ComponentType<PartProps>, CurrentActions as ComponentType<PartProps>);
const Next = preview(nextStyles, NextContent as ComponentType<PartProps>, NextActions as ComponentType<PartProps>);

const VARIANTS = ["neutral", "primary", "secondary", "accent", "info", "success", "warning", "danger"] as const;
const noop = () => undefined;
const base: AlertModalProps = {
  size: "sm",
  icon: "info",
  title: "Delete this file?",
  text: "The file moves to the trash. You can restore it there for 30 days.",
  alternateButton: { text: "Cancel", onClick: noop },
  actionButton: { text: "Delete", onClick: noop },
  removeBackdrop: true,
  bordered: true,
};

const sections: CompareSection<AlertModalProps>[] = [
  {
    title: "Varyantlar",
    note: "Bugün sütununda neutral ve accent yok. Yeni sistemde ikon, aksiyon butonuyla aynı {variant}-solid renginde; alternatif buton neutral.",
    rows: VARIANTS.map(variant => ({ label: variant, props: { ...base, variant } })),
  },
  {
    title: "Boyutlar",
    note: "size yalnızca genişliği değiştirir (sizing-320 · 480 · 720 · 960); lg ve xl sütuna sığmadığı için gösterilmiyor.",
    rows: (["sm", "md"] as const).map(size => ({ label: size, props: { ...base, size } })),
  },
  {
    title: "İçerik hizası",
    rows: (["center", "left", "right"] as const).flatMap(contentPosition => [
      { label: contentPosition, props: { ...base, contentPosition } },
      { label: `${contentPosition} · yalnızca başlık`, props: { ...base, contentPosition, text: undefined } },
    ]),
  },
  {
    title: "Buton düzeni",
    rows: (["center", "left", "right", "spaceBetween", "stretch", "fullWidth"] as const).map(buttonsPosition => ({
      label: buttonsPosition,
      props: { ...base, buttonsPosition },
    })),
  },
  {
    title: "Yüzey",
    rows: [
      { label: "varsayılan", props: { ...base, bordered: false } },
      { label: "bordered", props: base },
      { label: "elevated", props: { ...base, bordered: false, elevated: true } },
      { label: "enableDivider", props: { ...base, enableDivider: true } },
      { label: "backdrop", props: { ...base, removeBackdrop: false, bordered: false } },
    ],
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Karşılaştırma/AlertModal",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const AlertModal_: StoryObj<typeof TokenCompare> = {
  name: "AlertModal",
  render: () => <TokenCompare sections={sections} current={Current} next={Next} />,
};
