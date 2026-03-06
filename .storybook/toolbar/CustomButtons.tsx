// @ts-expect-error: React is needed for JSX in Storybook manager
import React from "react";
import { IconButton } from "storybook/internal/components";
import { GithubIcon } from "@storybook/icons";
import { NPM_LOGO_URL } from "../../src/utils/constants";

const ExternalLinksToolbar = () => {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <IconButton key="github" title="GitHub Repository" onClick={() => window.open("https://github.com/motif-ui/motifreact", "_blank")}>
        <GithubIcon />
      </IconButton>

      <IconButton key="npm" title="NPM Package" onClick={() => window.open("https://www.npmjs.com/package/@motif-ui/react", "_blank")}>
        <img src={NPM_LOGO_URL} width={14} alt="Npm Logo" />
      </IconButton>
    </div>
  );
};

export default ExternalLinksToolbar;
