import React from "react";
import { useStorybookApi, useStorybookState } from "storybook/manager-api";

const crumbStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginLeft: 8,
  color: "#7d849c",
  fontWeight: 500,
  fontSize: 13,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const Breadcrumbs = () => {
  const api = useStorybookApi();
  useStorybookState();
  const data = api.getCurrentStoryData() as ReturnType<typeof api.getCurrentStoryData> | undefined;
  const titleParts = data?.title.split("/") ?? [];
  const parts = data?.name && data.name !== titleParts[titleParts.length - 1] ? [...titleParts, data.name] : titleParts;

  return (
    parts.length !== 0 && (
      <nav aria-label="Breadcrumb" style={crumbStyle}>
        {parts.map((part, index) => (
          <React.Fragment key={`${part}-${index}`}>
            {index > 0 && <span style={{ opacity: 0.6 }}>/</span>}
            <span style={index === parts.length - 1 ? { color: "#7f4588", fontWeight: 700 } : undefined}>{part}</span>
          </React.Fragment>
        ))}
      </nav>
    )
  );
};

export default Breadcrumbs;
