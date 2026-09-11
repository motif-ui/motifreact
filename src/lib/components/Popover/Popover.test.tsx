import { act, render, screen, waitFor } from "@testing-library/react";
import Popover from "./Popover";
import { createRef } from "react";
import { runStandardPropsTest } from "../../../utils/testUtils";

describe("Popover", () => {
  it("should render with only required props, have default prop values stated here, and have standard props; className, style and ref props working as expected", () => {
    const anchorRef = createRef<HTMLDivElement>();
    const { container, getByTestId, unmount } = render(<Popover anchorRef={anchorRef} open />);

    expect(container).toMatchSnapshot();

    const popoverElement = getByTestId("popover");
    //Default value control for variant prop
    expect(popoverElement).toHaveClass("light");
    //default value control for position prop
    expect(popoverElement).toHaveClass("bottom");
    //default value control for spacing prop
    expect(popoverElement).toHaveClass("callout");

    unmount();

    runStandardPropsTest<HTMLDivElement>(
      props => render(<Popover anchorRef={anchorRef} open {...props} />),
      result => result.queryByTestId("popover"),
    );
  });

  it("should render in a position given in placeOn prop relative to the anchor element", () => {
    const positions: ("top" | "bottom" | "right" | "left" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight")[] = [
      "top",
      "bottom",
      "right",
      "left",
      "topLeft",
      "topRight",
      "bottomLeft",
      "bottomRight",
    ];

    const anchorRef = createRef<HTMLDivElement>();
    positions.forEach(position => {
      const { getByTestId, unmount } = render(<Popover anchorRef={anchorRef} placeOn={position} open />);
      expect(getByTestId("popover")).toHaveClass(position);
      unmount();
    });
  });

  it("should render in the variant given in the variant prop", () => {
    const anchorRef = createRef<HTMLDivElement>();
    (["light", "primary", "dark"] as ("light" | "primary" | "dark")[]).forEach(variant => {
      const { unmount, getByTestId } = render(<Popover anchorRef={anchorRef} variant={variant} open />);
      expect(getByTestId("popover")).toHaveClass(variant);
      unmount();
    });
  });

  it("should render in a panel given in the spacing prop", () => {
    const anchorRef = createRef<HTMLDivElement>();
    (["withGap", "callout", "noSpace"] as ("withGap" | "callout" | "noSpace")[]).forEach(panel => {
      const { unmount, getByTestId } = render(<Popover anchorRef={anchorRef} spacing={panel} open />);
      expect(getByTestId("popover")).toHaveClass(panel);
      unmount();
    });
  });

  it("should be opened when the open prop is true", () => {
    const anchorRef = createRef<HTMLDivElement>();
    render(
      <Popover anchorRef={anchorRef} open={false}>
        Popover Content
      </Popover>,
    );
    expect(screen.queryByText("Popover Content")).not.toBeInTheDocument();

    render(
      <Popover anchorRef={anchorRef} open>
        Popover Content
      </Popover>,
    );
    expect(screen.getByText("Popover Content")).toBeInTheDocument();
  });

  it("should render as elevated when elevated prop is true", () => {
    const anchorRef = createRef<HTMLDivElement>();
    const { getByTestId } = render(
      <Popover anchorRef={anchorRef} open elevated>
        Popover Content
      </Popover>,
    );
    expect(getByTestId("popover")).toHaveClass("elevated");
  });

  it("should render the given content correctly when open", () => {
    const anchorRef = { current: document.createElement("div") };
    render(
      <Popover anchorRef={anchorRef} open>
        <div>Popover Content</div>
      </Popover>,
    );
    expect(screen.getByText("Popover Content")).toBeInTheDocument();
  });

  it("should call onClose when popover is closed", async () => {
    const onClose = jest.fn();

    const anchorRef = createRef<HTMLDivElement>();
    const { getByTestId, queryByTestId, rerender } = render(
      <Popover anchorRef={anchorRef} open onClose={onClose}>
        <div>Popover content</div>
      </Popover>,
    );
    expect(getByTestId("popover")).toBeInTheDocument();

    rerender(
      <Popover anchorRef={anchorRef} open={false} onClose={onClose}>
        <div>Popover content</div>
      </Popover>,
    );
    expect(onClose).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(queryByTestId("popover")).not.toBeInTheDocument());
  });

  it("should close popover when the window is resized", () => {
    const anchorRef = createRef<HTMLDivElement>();
    const onClose = jest.fn();
    const { getByTestId, queryByTestId } = render(
      <Popover anchorRef={anchorRef} open onClose={onClose}>
        <div>Popover content</div>
      </Popover>,
    );
    expect(getByTestId("popover")).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(onClose).toHaveBeenCalled();
    expect(queryByTestId("popover")).not.toBeInTheDocument();
  });
});
