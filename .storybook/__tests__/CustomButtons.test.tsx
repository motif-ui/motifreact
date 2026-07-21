import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import ExternalLinksToolbar from "../toolbar/CustomButtons";

// storybook/internal/components and @storybook/icons both ship ESM-only
// and aren't in jest's transformIgnorePatterns exceptions, so neither can be
// parsed as-is here. Plain stand-ins replace them — this test is about our
// own click handlers and URLs, not Storybook's components/icons.
jest.mock("storybook/internal/components", () => ({
  IconButton: ({ title, onClick, children }: ComponentProps<"button"> & { title: string }) => (
    <button title={title} onClick={onClick}>
      {children}
    </button>
  ),
}));
jest.mock("@storybook/icons", () => ({
  GithubIcon: () => <svg data-testid="github-icon" />,
}));

describe("ExternalLinksToolbar", () => {
  const originalOpen = window.open;

  beforeEach(() => {
    window.open = jest.fn();
  });

  afterEach(() => {
    window.open = originalOpen;
  });

  it("opens the GitHub repository in a new tab when clicked", () => {
    render(<ExternalLinksToolbar />);
    screen.getByTitle("GitHub Repository").click();
    expect(window.open).toHaveBeenCalledWith("https://github.com/motif-ui/motifreact", "_blank");
  });

  it("opens the npm package page in a new tab when clicked", () => {
    render(<ExternalLinksToolbar />);
    screen.getByTitle("NPM Package").click();
    expect(window.open).toHaveBeenCalledWith("https://www.npmjs.com/package/@motif-ui/react", "_blank");
  });
});
