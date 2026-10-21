import { screen, render, waitFor, act, fireEvent } from "@testing-library/react";

import Tooltip from "@/components/Tooltip/Tooltip";
import Button from "../Button/Button";
import { userEvent } from "@testing-library/user-event";
import { runSnapshotDefaultsAndStandardPropsTest } from "../../../utils/testUtils";
import { OverlayPlaceOn, StandardPropsWithRef } from "../../../lib/types";
import { PropsWithRef, Size4SM } from "../../types";

describe("Tooltip", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  const user = userEvent.setup({ delay: null });

  const renderAndHover = (props: StandardPropsWithRef<HTMLDivElement> = {}) => {
    const result = render(
      <Tooltip text="Description" {...props}>
        <Button label="Test Button" />
      </Tooltip>,
    );
    fireEvent.mouseEnter(result.getByRole("button"));
    return result;
  };

  runSnapshotDefaultsAndStandardPropsTest(renderAndHover, {
    assertDefaults: () => {
      const tooltip = screen.getByTestId("tooltipItem");
      // position: top
      expect(tooltip).toHaveClass("top");
      // variant: light
      expect(tooltip).toHaveClass("light");
      // size: md
      expect(tooltip).toHaveClass("md");
    },
    getRoot: result => result.queryByTestId("tooltipItem"),
  });

  it("should not be rendered when no children is given ", () => {
    jest.spyOn(console, "error").mockImplementation(() => jest.fn());

    expect(() => render(<Tooltip text="test" />)).toThrow();

    jest.restoreAllMocks();
  });

  it("should only render children but tooltip, when text prop is empty string", () => {
    render(
      <Tooltip text="">
        <Button label="Text" />
      </Tooltip>,
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.queryByTestId("tooltipItem")).not.toBeInTheDocument();
  });

  it("should appear when the mouse is over the child component and disappear when the mouse is out", async () => {
    render(
      <Tooltip text="Description">
        <Button label="Test Button" />
      </Tooltip>,
    );

    await act(async () => {
      await user.hover(screen.getByText("Test Button"));
    });
    expect(screen.queryByTestId("tooltipItem")).toBeInTheDocument();

    await act(async () => {
      await user.unhover(screen.getByText("Test Button"));
      jest.advanceTimersByTime(250); // Advance timers by exactly 250ms
    });

    // Wait for the tooltip to be removed from the document
    await waitFor(() => {
      expect(screen.queryByTestId("tooltipItem")).not.toBeInTheDocument();
    });
  });

  it("should render the title if title prop is given", async () => {
    render(
      <Tooltip text="Description" title="Title">
        <Button label="Test Button" />
      </Tooltip>,
    );
    await act(async () => {
      await user.hover(screen.getByText("Test Button"));
    });
    expect(screen.queryByText("Title")).toBeInTheDocument();
  });

  it("should render correctly in all positions", async () => {
    const positions: OverlayPlaceOn[] = ["top", "right", "bottom", "left", "topLeft", "topRight", "bottomLeft", "bottomRight"];

    for (const position of positions) {
      render(
        <Tooltip text={`${position}Tooltip`} position={position}>
          <Button label={`${position}Button`} />
        </Tooltip>,
      );

      await act(async () => {
        await user.hover(screen.getByText(`${position}Button`));
      });
      expect(screen.getByText(`${position}Tooltip`).parentElement?.parentElement).toHaveClass(position);
    }
  });

  it("should render with the theme of the given variant prop", async () => {
    const { rerender } = render(
      <Tooltip text="Test Tooltip">
        <Button label="Test Button" />
      </Tooltip>,
    );
    await act(async () => {
      await user.hover(screen.getByText("Test Button"));
    });
    expect(screen.queryByTestId("tooltipItem")).toHaveClass("light");

    rerender(
      <Tooltip text="Test Tooltip" variant="dark">
        <Button label="Test Button" />
      </Tooltip>,
    );
    await act(async () => {
      await user.hover(screen.getByText("Test Button"));
    });
    expect(screen.queryByTestId("tooltipItem")).toHaveClass("dark");
  });

  it("should render in size stated in the size prop", async () => {
    const sizes: Size4SM[] = ["xs", "sm", "md", "lg"];
    for (const size of sizes) {
      const index = sizes.indexOf(size);
      const { getAllByTestId } = render(
        <Tooltip text="test" size={size}>
          <Button label={size} />
        </Tooltip>,
      );
      await act(() => user.hover(screen.getByText(size)));
      expect(getAllByTestId("tooltipItem")[index]).toHaveClass(size);
    }
  });

  describe("when it does not fit into the screen at the given position", () => {
    const anchorRect = (rect: Partial<DOMRect>) => ({ x: 0, y: 0, width: 0, height: 0, toJSON: () => {}, ...rect }) as DOMRect;

    // jsdom does not lay out, so the tooltip is given a size
    beforeEach(() => {
      jest.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (this: HTMLElement) {
        return this.dataset.testid === "tooltipItem" ? 200 : 0;
      });
      jest.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function (this: HTMLElement) {
        return this.dataset.testid === "tooltipItem" ? 40 : 0;
      });
    });
    afterEach(() => jest.restoreAllMocks());

    it("should be rendered on the opposite side when there is no room on the given side", async () => {
      render(
        <Tooltip text="test" position="top">
          <Button label="Test Button" />
        </Tooltip>,
      );
      // at the top edge of the screen, so there is no room above it
      jest
        .spyOn(screen.getByRole("button"), "getBoundingClientRect")
        .mockReturnValue(anchorRect({ top: 0, bottom: 30, left: 400, right: 500, width: 100, height: 30 }));

      await act(() => user.hover(screen.getByText("Test Button")));
      const tooltip = screen.getByTestId("tooltipItem");
      expect(tooltip).toHaveClass("bottom");
      expect(tooltip).toHaveStyle({ top: "30px", left: "350px" });
    });

    it("should be rendered with the other alignment when it overflows the screen at the given alignment", async () => {
      render(
        <Tooltip text="test" position="topRight">
          <Button label="Test Button" />
        </Tooltip>,
      );
      // near the left edge of the screen, so the tooltip aligned to the anchor's right edge overflows it from the left
      jest
        .spyOn(screen.getByRole("button"), "getBoundingClientRect")
        .mockReturnValue(anchorRect({ top: 300, bottom: 330, left: 10, right: 50, width: 40, height: 30 }));

      await act(() => user.hover(screen.getByText("Test Button")));
      const tooltip = screen.getByTestId("tooltipItem");
      expect(tooltip).toHaveClass("topLeft");
      expect(tooltip).toHaveStyle({ top: "260px", left: "10px" });
    });
  });

  it("should not re-render the anchor child on window resize while the tooltip is closed", () => {
    const renderSpy = jest.fn();
    const SpyButton = (props: PropsWithRef<{ label: string }, HTMLButtonElement>) => {
      renderSpy();
      return <Button ref={props.ref} label={props.label} />;
    };

    render(
      <Tooltip text="Description">
        <SpyButton label="Test Button" />
      </Tooltip>,
    );

    const renderCountBeforeResize = renderSpy.mock.calls.length;

    act(() => {
      window.dispatchEvent(new Event("resize"));
      window.dispatchEvent(new Event("resize"));
    });
    expect(renderSpy).toHaveBeenCalledTimes(renderCountBeforeResize);
  });
});
