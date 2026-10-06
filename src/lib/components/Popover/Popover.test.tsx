import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import Popover from "./Popover";
import { createRef, useRef } from "react";
import type { PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import { renderToString } from "react-dom/server";
import { PopoverProps } from "./types";
import { runSnapshotDefaultsAndStandardPropsTest } from "../../../utils/testUtils";
import { StandardPropsWithRef } from "../../../lib/types";
describe("Popover", () => {
  const anchorRef = createRef<HTMLDivElement>();

  runSnapshotDefaultsAndStandardPropsTest(
    (props: StandardPropsWithRef<HTMLDivElement>) => render(<Popover anchorRef={anchorRef} open {...props} />),
    {
      assertDefaults: ({ getByTestId }) => {
        const popoverElement = getByTestId("popover");
        //Default value control for variant prop
        expect(popoverElement).toHaveClass("light");
        //default value control for position prop
        expect(popoverElement).toHaveClass("bottom");
        //default value control for spacing prop
        expect(popoverElement).toHaveClass("callout");
      },
      getRoot: result => result.queryByTestId("popover"),
    },
  );

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

  it("should stay open when the window is resized", () => {
    const anchorRef = createRef<HTMLDivElement>();
    const onClose = jest.fn();
    const { getByTestId } = render(
      <Popover anchorRef={anchorRef} open onClose={onClose}>
        <div>Popover content</div>
      </Popover>,
    );

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(onClose).not.toHaveBeenCalled();
    expect(getByTestId("popover")).toBeInTheDocument();
  });

  it("should not render on the server, even when it is open initially", () => {
    // The server renderer does not support portals, so rendering the popover there would throw
    expect(() =>
      renderToString(
        <Popover anchorRef={createRef()} defaultOpen>
          Popover content
        </Popover>,
      ),
    ).not.toThrow();
    expect(
      renderToString(
        <Popover anchorRef={createRef()} open>
          Popover content
        </Popover>,
      ),
    ).not.toContain("Popover content");
  });

  describe("uncontrolled", () => {
    const UncontrolledPopover = (props: PropsWithChildren<Partial<PopoverProps>>) => {
      const anchorRef = useRef<HTMLButtonElement>(null);
      return (
        <>
          <button ref={anchorRef}>anchor</button>
          <div>outside</div>
          <Popover anchorRef={anchorRef} {...props}>
            Popover content
            {props.children}
          </Popover>
        </>
      );
    };

    it("should toggle when the anchor is clicked", () => {
      render(<UncontrolledPopover />);
      expect(screen.queryByTestId("popover")).not.toBeInTheDocument();

      fireEvent.click(screen.getByText("anchor"));
      expect(screen.getByTestId("popover")).toBeInTheDocument();

      fireEvent.click(screen.getByText("anchor"));
      expect(screen.getByTestId("popover")).not.toHaveClass("visible");
    });

    it("should be open initially when defaultOpen is true", () => {
      render(<UncontrolledPopover defaultOpen />);
      expect(screen.getByTestId("popover")).toBeInTheDocument();
    });

    it("should close on outside click and Escape by default", () => {
      const onClose = jest.fn();
      render(<UncontrolledPopover defaultOpen onClose={onClose} />);

      fireEvent.mouseUp(screen.getByText("Popover content"));
      fireEvent.mouseUp(screen.getByText("anchor"));
      expect(onClose).not.toHaveBeenCalled();

      fireEvent.mouseUp(screen.getByText("outside"));
      expect(onClose).toHaveBeenCalledWith("outsideClick");

      fireEvent.click(screen.getByText("anchor"));
      fireEvent.keyDown(document, { key: "Escape" });
      expect(onClose).toHaveBeenLastCalledWith("escape");
    });

    it("should not close when clicked in a nested overlay rendered in its own portal", () => {
      const onClose = jest.fn();
      const NestedOverlay = () => createPortal(<button>nested</button>, document.body);
      render(
        <UncontrolledPopover defaultOpen onClose={onClose}>
          <NestedOverlay />
        </UncontrolledPopover>,
      );

      fireEvent.mouseUp(screen.getByText("nested"));
      expect(onClose).not.toHaveBeenCalled();

      fireEvent.mouseUp(screen.getByText("outside"));
      expect(onClose).toHaveBeenCalledWith("outsideClick");
    });

    it("should not close on outside click when closeOnOutsideClick is false", () => {
      const onClose = jest.fn();
      render(<UncontrolledPopover defaultOpen closeOnOutsideClick={false} onClose={onClose} />);

      fireEvent.mouseUp(screen.getByText("outside"));
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe("controlled", () => {
    it("should not close itself on outside click by default", () => {
      const onClose = jest.fn();
      render(
        <Popover anchorRef={createRef()} open onClose={onClose}>
          Popover content
        </Popover>,
      );

      fireEvent.mouseUp(document.body);
      fireEvent.keyDown(document, { key: "Escape" });
      expect(onClose).not.toHaveBeenCalled();
    });

    it("should request close on outside click when closeOnOutsideClick is true, and stay open until the open prop changes", async () => {
      const onClose = jest.fn();
      render(
        <Popover anchorRef={createRef()} open onClose={onClose} closeOnOutsideClick>
          Popover content
        </Popover>,
      );

      fireEvent.mouseUp(document.body);
      expect(onClose).toHaveBeenCalledWith("outsideClick");
      await waitFor(() => expect(screen.getByTestId("popover")).toHaveClass("visible"));
    });

    it("should request close on scroll when closeOnScroll is true", () => {
      const onClose = jest.fn();
      render(
        <Popover anchorRef={{ current: document.createElement("div") }} open onClose={onClose} closeOnScroll>
          Popover content
        </Popover>,
      );

      fireEvent.scroll(document);
      expect(onClose).toHaveBeenCalledWith("scroll");
    });
  });

  it("should flip to the opposite side and use it as its placement class when there is no room", () => {
    const anchor = document.createElement("div");
    jest.spyOn(anchor, "getBoundingClientRect").mockReturnValue({
      top: 700,
      bottom: 740,
      left: 400,
      right: 500,
      width: 100,
      height: 40,
      x: 400,
      y: 700,
      toJSON: () => {},
    });
    const offsetHeight = jest.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(100);

    render(
      <Popover anchorRef={{ current: anchor }} placeOn="bottom" open>
        Popover content
      </Popover>,
    );
    expect(screen.getByTestId("popover")).toHaveClass("top");
    offsetHeight.mockRestore();
  });
});
