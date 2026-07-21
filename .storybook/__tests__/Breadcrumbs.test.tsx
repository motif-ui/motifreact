import { render, screen } from "@testing-library/react";
import Breadcrumbs from "../toolbar/Breadcrumbs";

const getCurrentStoryData = jest.fn();

jest.mock("storybook/manager-api", () => ({
  useStorybookApi: () => ({ getCurrentStoryData }),
  useStorybookState: () => undefined,
}));

describe("Breadcrumbs", () => {
  afterEach(() => {
    getCurrentStoryData.mockReset();
  });

  it("renders nothing when there is no current story", () => {
    getCurrentStoryData.mockReturnValue(undefined);
    render(<Breadcrumbs />);
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("splits the story title into breadcrumb segments", () => {
    getCurrentStoryData.mockReturnValue({ title: "Components/Table", name: "Docs" });
    render(<Breadcrumbs />);
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(nav).toHaveTextContent("Components/Table/Docs");
  });

  it("appends the story name as its own segment when it differs from the last title part", () => {
    getCurrentStoryData.mockReturnValue({ title: "Components/Table", name: "Docs" });
    render(<Breadcrumbs />);
    // "Components", "Table", "Docs" — 3 segments, not merged into 2.
    expect(screen.getByText("Components")).toBeInTheDocument();
    expect(screen.getByText("Table")).toBeInTheDocument();
    expect(screen.getByText("Docs")).toBeInTheDocument();
  });

  it("does not duplicate the last segment when the story name already matches it", () => {
    // e.g. a docs-only page whose title's last part is already "Table" and name is also "Table".
    getCurrentStoryData.mockReturnValue({ title: "Components/Table", name: "Table" });
    render(<Breadcrumbs />);
    expect(screen.getAllByText("Table")).toHaveLength(1);
  });
});
