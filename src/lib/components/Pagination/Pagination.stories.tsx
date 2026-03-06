import type { Meta, StoryObj } from "@storybook/react";
import Pagination from "./Pagination";
import { useState } from "react";
import ListView from "@/components/ListView";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  argTypes: {
    total: { control: { type: "number", min: 0, max: 1000 } },
    current: { control: { type: "number", min: 1, max: 100 } },
    pageSize: { control: { type: "number", min: 1, max: 100 } },
    size: { table: { defaultValue: { summary: "md" } } },
  },
  args: {
    current: 2,
    total: 100,
    pageSize: 10,
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Primary: Story = {};

export const UserListExample: Story = {
  render: () => <UserList />,
  parameters: {
    controls: { disable: true },
  },
};

const UserList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const users = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: ["Admin", "Editor", "Viewer"][i % 3],
    avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
  }));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div style={{ width: 380, display: "flex", flexDirection: "column" }}>
      <ListView>
        {currentUsers.map((user, index) => (
          <ListView.Item
            key={user.id}
            title={user.name}
            description={user.email}
            alternateText={user.role}
            image={user.avatar}
            style={{ borderBottom: index < currentUsers.length - 1 ? "1px solid #e0e0e0" : "none" }}
          />
        ))}
      </ListView>
      <Pagination
        total={users.length}
        current={currentPage}
        pageSize={itemsPerPage}
        onChange={setCurrentPage}
        size="sm"
        style={{ alignSelf: "center" }}
      />
    </div>
  );
};
