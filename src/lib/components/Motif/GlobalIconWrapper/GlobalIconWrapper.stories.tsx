import type { Meta, StoryObj } from "@storybook/nextjs";
import Avatar from "@/components/Avatar/Avatar";
import Accordion from "@/components/Accordion/Accordion";
import Badge from "@/components/Badge/Badge";
import BusinessCard from "@/components/BusinessCard/BusinessCard";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";

const meta: Meta = {
  title: "Chromatic/GlobalIconWrapper",
  tags: ["!autodocs", "!dev"],
  parameters: { layout: "padded" },
  decorators: [
    Story => (
      <>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
        <Story />
      </>
    ),
  ],
};

export default meta;
type Story = StoryObj;

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
    <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z" />
    <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" />
  </svg>
);

const BrightnessIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708" />
  </svg>
);

const row: React.CSSProperties = { display: "flex", alignItems: "center", gap: 16, marginBottom: 12, flexWrap: "wrap" };
const col: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 12 };

const breadcrumbItems = [{ label: "Products", path: "/" }, { label: "Category", path: "/" }, { label: "Current" }];

export const AvatarIcons: Story = {
  render: () => (
    <div style={col}>
      <div style={row}>
        <Avatar icon="folder" />
        <Avatar icon={<i className="bi bi-amazon" />} />
        <Avatar icon={<span className="material-symbols-outlined">android</span>} />
        <Avatar icon={<BrightnessIcon />} />
        <Avatar icon={<CameraIcon />} />
      </div>
      <div style={row}>
        <Avatar variant="primary" icon="folder" />
        <Avatar variant="primary" icon={<i className="bi bi-amazon" />} />
        <Avatar variant="primary" icon={<span className="material-symbols-outlined">android</span>} />
        <Avatar variant="primary" icon={<BrightnessIcon />} />
        <Avatar variant="primary" icon={<CameraIcon />} />
      </div>
      <div style={{ ...row, background: "#1a1a1a", padding: 8, borderRadius: 4 }}>
        <Avatar variant="primary" icon="folder" />
        <Avatar variant="primary" icon={<i className="bi bi-amazon" />} />
        <Avatar variant="primary" icon={<span className="material-symbols-outlined">android</span>} />
        <Avatar variant="primary" icon={<BrightnessIcon />} />
        <Avatar variant="primary" icon={<CameraIcon />} />
      </div>
    </div>
  ),
};

export const AccordionIcons: Story = {
  render: () => (
    <div style={{ ...col, width: 480 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Accordion title="String icon" icon="folder">
          Content
        </Accordion>
        <Accordion title="Bootstrap icon" icon={<i className="bi bi-amazon" />}>
          Content
        </Accordion>
        <Accordion title="Material Symbols" icon={<span className="material-symbols-outlined">android</span>}>
          Content
        </Accordion>
        <Accordion title="Inline SVG" icon={<BrightnessIcon />}>
          Content
        </Accordion>
        <Accordion title="React component" icon={<CameraIcon />}>
          Content
        </Accordion>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Accordion title="String icon — expanded" icon="folder" expanded>
          Content
        </Accordion>
        <Accordion title="Bootstrap icon — expanded" icon={<i className="bi bi-amazon" />} expanded>
          Content
        </Accordion>
        <Accordion title="Material Symbols — expanded" icon={<span className="material-symbols-outlined">android</span>} expanded>
          Content
        </Accordion>
        <Accordion title="Inline SVG — expanded" icon={<BrightnessIcon />} expanded>
          Content
        </Accordion>
        <Accordion title="React component — expanded" icon={<CameraIcon />} expanded>
          Content
        </Accordion>
      </div>
    </div>
  ),
};

export const BadgeIcons: Story = {
  render: () => (
    <div style={col}>
      <div style={row}>
        <Badge icon="folder">
          <button>btn</button>
        </Badge>
        <Badge icon={<i className="bi bi-amazon" />}>
          <button>btn</button>
        </Badge>
        <Badge icon={<span className="material-symbols-outlined">android</span>}>
          <button>btn</button>
        </Badge>
        <Badge icon={<BrightnessIcon />}>
          <button>btn</button>
        </Badge>
        <Badge icon={<CameraIcon />}>
          <button>btn</button>
        </Badge>
      </div>
      <div style={row}>
        <Badge variant="danger" icon="folder">
          <button>btn</button>
        </Badge>
        <Badge variant="danger" icon={<i className="bi bi-amazon" />}>
          <button>btn</button>
        </Badge>
        <Badge variant="danger" icon={<span className="material-symbols-outlined">android</span>}>
          <button>btn</button>
        </Badge>
        <Badge variant="danger" icon={<BrightnessIcon />}>
          <button>btn</button>
        </Badge>
        <Badge variant="danger" icon={<CameraIcon />}>
          <button>btn</button>
        </Badge>
      </div>
    </div>
  ),
};

export const BusinessCardIcons: Story = {
  render: () => (
    <div style={col}>
      <div style={row}>
        <BusinessCard title="Title" icon="folder" />
        <BusinessCard title="Title" icon={<i className="bi bi-amazon" />} />
        <BusinessCard title="Title" icon={<span className="material-symbols-outlined">android</span>} />
        <BusinessCard title="Title" icon={<BrightnessIcon />} />
        <BusinessCard title="Title" icon={<CameraIcon />} />
      </div>
      <div style={row}>
        <BusinessCard variant="primary" title="Title" icon="folder" />
        <BusinessCard variant="primary" title="Title" icon={<i className="bi bi-amazon" />} />
        <BusinessCard variant="primary" title="Title" icon={<span className="material-symbols-outlined">android</span>} />
        <BusinessCard variant="primary" title="Title" icon={<BrightnessIcon />} />
        <BusinessCard variant="primary" title="Title" icon={<CameraIcon />} />
      </div>
    </div>
  ),
};

export const BreadcrumbIcons: Story = {
  render: () => (
    <div style={col}>
      <Breadcrumb items={breadcrumbItems} homeIcon="folder" />
      <Breadcrumb items={breadcrumbItems} homeIcon={<i className="bi bi-amazon" />} />
      <Breadcrumb items={breadcrumbItems} homeIcon={<span className="material-symbols-outlined">android</span>} />
      <Breadcrumb items={breadcrumbItems} homeIcon={<BrightnessIcon />} />
      <Breadcrumb items={breadcrumbItems} homeIcon={<CameraIcon />} />
      <div style={{ color: "red" }}>
        <Breadcrumb items={breadcrumbItems} homeIcon="folder" />
        <Breadcrumb items={breadcrumbItems} homeIcon={<BrightnessIcon />} />
        <Breadcrumb items={breadcrumbItems} homeIcon={<CameraIcon />} />
      </div>
    </div>
  ),
};
