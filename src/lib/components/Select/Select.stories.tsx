import type { Meta, StoryObj } from "@storybook/nextjs";

import { useState } from "react";
import { SelectGroupItem, SelectItem } from "@/components/Select/types";
import Button from "@/components/Button";
import Select from "@/components/Select/Select";

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  decorators: [
    Story => (
      <div style={{ minWidth: 300 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    placeholder: { table: { defaultValue: { summary: "Lütfen seçiniz" } } },
    size: { table: { defaultValue: { summary: "md" } } },
    value: { control: { type: "text" }, description: "string or string[] if multiple" },
  },
  args: {},
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Primary: Story = {
  render: args => <Select {...args} data={dummyData} />,
};

export const ValueSelected: Story = {
  render: args => <Select {...args} data={dummyData} multiple value={["34", "06"]} />,
};

export const DataFromAPI: Story = {
  render: () => <DataFromAPIComponent />,
};

const dummyData: (SelectGroupItem | SelectItem)[] = [
  { label: "Item 1", value: "i1" },
  { label: "Item 2", value: "i2" },
  { label: "Item 3", value: "i3" },
  {
    groupLabel: "Cities",
    groupKey: "cities",
    items: [
      { label: "İstanbul", value: "34" },
      { label: "Ankara", value: "06" },
      { label: "İzmir", value: "35" },
    ],
  },
  {
    groupLabel: "Districts",
    groupKey: "districs",
    items: [
      { label: "Gölbaşı", value: "golbasi" },
      { label: "Polatlı", value: "polatli" },
      { label: "Çankaya", value: "cankaya" },
    ],
  },
];

const DataFromAPIComponent = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SelectItem[]>([]);

  const callApi = () => {
    setLoading(true);
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(response => response.json())
      .then((json: []) => {
        const resp: SelectItem[] = json.map((item: { name: string; id: string }) => ({
          label: item.name,
          value: item.id,
        }));
        setData(resp);
        setTimeout(() => setLoading(false), 1500);
      })
      .catch(alert);
  };

  return (
    <div style={{ display: "flex", gap: 6, width: "100%", alignItems: "center" }}>
      <Button label="Load" onClick={callApi} size="xs" />
      <div style={{ flexGrow: 1 }}>
        <Select data={data} loading={loading} />
      </div>
    </div>
  );
};
