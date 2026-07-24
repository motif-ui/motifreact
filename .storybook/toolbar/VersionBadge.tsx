import React from "react";
import { version } from "../../package.json";

const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  height: 26,
  padding: "0 10px",
  borderRadius: 999,
  border: "1px solid rgba(151, 90, 157, 0.18)",
  background: "rgba(151, 90, 157, 0.08)",
  color: "#7f4588",
  fontWeight: 700,
  fontSize: 12,
  textDecoration: "none",
  whiteSpace: "nowrap",
};

const VersionBadge = () => (
  <a href="https://github.com/motif-ui/motifreact/releases" target="_blank" rel="noreferrer" title="Release history" style={badgeStyle}>
    v{version}
  </a>
);

export default VersionBadge;
