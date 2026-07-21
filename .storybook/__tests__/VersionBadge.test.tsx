import { render, screen } from "@testing-library/react";
import { version } from "../../package.json";
import VersionBadge from "../toolbar/VersionBadge";

describe("VersionBadge", () => {
  it("renders the package version prefixed with v", () => {
    render(<VersionBadge />);
    expect(screen.getByRole("link")).toHaveTextContent(`v${version}`);
  });

  it("links to the GitHub releases page and opens safely in a new tab", () => {
    render(<VersionBadge />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://github.com/motif-ui/motifreact/releases");
    expect(link).toHaveAttribute("target", "_blank");
    // Required alongside target="_blank" to prevent the new page from accessing window.opener.
    expect(link).toHaveAttribute("rel", "noreferrer");
  });
});
