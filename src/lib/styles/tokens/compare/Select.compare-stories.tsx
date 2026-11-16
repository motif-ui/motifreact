import type { Meta, StoryObj } from "@storybook/nextjs";
import Select from "@/components/Select/Select";
import SelectBaseline from "./baseline/Select/Select";
import { SelectGroupItem, SelectItem, SelectProps } from "@/components/Select/types";
import { CompareSection, TokenCompare } from "./TokenCompare";

const items: SelectItem[] = [
  { label: "İstanbul", value: "34" },
  { label: "Ankara", value: "06" },
  { label: "İzmir", value: "35" },
  { label: "Bursa", value: "16" },
];

const grouped: (SelectItem | SelectGroupItem)[] = [
  { label: "Tümü", value: "all" },
  { groupLabel: "Şehirler", groupKey: "cities", items },
];

const SIZES = ["xs", "sm", "md", "lg"] as const;

const sections: CompareSection<SelectProps>[] = [
  {
    title: "Boyutlar",
    rows: SIZES.map(size => ({ label: size, props: { data: items, size, placeholder: "Seçiniz" } })),
  },
  {
    title: "Durumlar",
    rows: [
      { label: "Placeholder", props: { data: items, placeholder: "Seçiniz" } },
      { label: "Değer seçili", props: { data: items, value: "06" } },
      { label: "Çoklu seçim", props: { data: items, multiple: true, value: ["34", "06"] } },
      { label: "İkonlu", props: { data: items, icon: "location_on", placeholder: "Seçiniz" } },
      { label: "Error", props: { data: items, error: true, value: "06" } },
      { label: "Success", props: { data: items, success: true, value: "06" } },
      { label: "Disabled", props: { data: items, disabled: true, placeholder: "Seçiniz" } },
      { label: "Disabled, dolu", props: { data: items, disabled: true, value: "06" } },
      { label: "Readonly", props: { data: items, readOnly: true, value: "06" } },
      { label: "Loading", props: { data: items, loading: true, placeholder: "Seçiniz" } },
    ],
  },
  {
    title: "Açık liste",
    note: "Listeler sayfa açılınca otomatik açılır; sayfada bir yere tıklanırsa kapanır, yenileyince geri gelir. İkinci satır hover rengiyle boyanır.",
    rows: [
      { label: "Seçili + hover", props: { data: items, value: "34" }, open: true, hover: true },
      { label: "Grup + çoklu", props: { data: grouped, multiple: true, value: ["06"] }, open: true, hover: true },
      { label: "Veri yok", props: { data: [] }, open: true },
    ],
  },
  {
    title: "Filtrelenebilir + chip",
    note: "Chip'ler yalnızca multiple + filterable birlikteyken çıkar; chip yazısı chipLabelSize'dan gelir (label-*).",
    rows: [
      ...SIZES.map(size => ({ label: size, props: { data: items, size, multiple: true, filterable: true, value: ["34"] } })),
      { label: "Filtrelenebilir, tekli", props: { data: items, filterable: true, value: "06" } },
    ],
  },
  {
    title: "Grup başlığı",
    note: "Grup başlığının yazısı groupLabelSize'dan gelir (label-*).",
    rows: SIZES.map(size => ({ label: size, props: { data: grouped, size, value: "06" }, open: true })),
  },
];

const meta: Meta<typeof TokenCompare> = {
  title: "Token Karşılaştırma/Select",
  component: TokenCompare,
  parameters: { layout: "padded" },
};

export default meta;

export const Select_: StoryObj<typeof TokenCompare> = {
  name: "Select",
  render: () => <TokenCompare sections={sections} current={SelectBaseline} next={Select} />,
};
