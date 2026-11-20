import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Container from "./Container";
import { runSnapshotDefaultsAndStandardPropsTest } from "../../../utils/testUtils";
import { StandardPropsWithRef } from "../../../lib/types";

describe("Container", () => {
  runSnapshotDefaultsAndStandardPropsTest((props: StandardPropsWithRef<HTMLDivElement>) =>
    render(<Container {...props}>Content</Container>),
  );

  it("should render its children", () => {
    render(<Container>Content</Container>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("should fill the full width when fluid prop is true", () => {
    const { container } = render(<Container fluid>Content</Container>);
    expect(container.firstElementChild).toHaveClass("fluid");
  });
});
