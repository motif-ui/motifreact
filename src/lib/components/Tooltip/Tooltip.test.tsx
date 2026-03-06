import { screen, render, waitFor, act } from "@testing-library/react";

import Tooltip from "@/components/Tooltip/Tooltip";
import Button from "../Button/Button";
import { userEvent } from "@testing-library/user-event";
import { Position } from "@/components/Tooltip/types";
import { Size4SM } from "../../types";

describe("Tooltip", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  const user = userEvent.setup({ delay: null });

  it("should be rendered with only required props and should have default prop values stated here", async () => {
    expect(
      render(
        <Tooltip text="Description">
          <Button label="Test Button" />
        </Tooltip>,
      ).container,
    ).toMatchSnapshot();

    await act(() => user.hover(screen.getByText("Test Button")));
    const tooltip = screen.queryByTestId("tooltipItem");

    // position: top
    expect(tooltip).toHaveClass("top");

    // variant: light
    expect(tooltip).toHaveClass("light");

    // size: md
    expect(tooltip).toHaveClass("md");
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
    const positions: Position[] = ["top", "right", "bottom", "left", "topLeft", "topRight", "bottomLeft", "bottomRight"];

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

  it("should be rendered in another position clockwise when it overflows the screen", async () => {
    /*
    What this test aims to show when the tooltip overflows the screen, it should try to render in another position
    clockwise. Especially in this test, the tooltip is tried to render in "topRight" position, but it is mocked to
    overflow the screen from the left. And then automatically, it is tried to render in "top" position but this time it
    is mocked to overflow from the top. And finally, when it is tried to render in "topLeft" position, it fits into the
    screen and the final expected position becomes "topLeft".
    */

    const { container } = render(
      <Tooltip text="test" position="topRight">
        <Button label="Test Button" />
      </Tooltip>,
    );

    // This section is to render the tooltip once to be able to mock. This has nothing to do with the test states
    await act(() => user.hover(screen.getByText("Test Button")));
    const tooltip = screen.queryByTestId("tooltipItem") as HTMLElement;
    await act(() => user.hover(container)); // Hovering the container to remove the tooltip

    //
    // Actual test starts here
    //

    // Setting the screen width to 800px
    jest.spyOn(document.documentElement, "clientWidth", "get").mockReturnValue(800);
    // Setting the screen width to 600px
    jest.spyOn(document.documentElement, "clientHeight", "get").mockReturnValue(600);
    jest
      .spyOn(tooltip, "getBoundingClientRect")
      // 1. Trying position: "topRight". Mocking the tooltip to overflow the screen from LEFT
      .mockImplementationOnce(
        () =>
          ({
            left: -100,
            right: 300,
            width: 400,
            top: 0,
            bottom: 200,
            height: 200,
          }) as DOMRect,
      )
      // 2. Trying position: "top". Mocking the tooltip to overflow the screen from TOP
      .mockImplementationOnce(
        () =>
          ({
            top: -100,
            bottom: 100,
            height: 200,
            left: 100,
            right: 500,
            width: 400,
          }) as DOMRect,
      )
      // 3. Trying position: "topLeft". Mocking the tooltip to stay within the screen
      .mockImplementationOnce(
        () =>
          ({
            top: 0,
            bottom: 200,
            height: 200,
            left: 100,
            right: 500,
            width: 400,
          }) as DOMRect,
      );

    await act(() => user.hover(screen.getByText("Test Button")));
    // 1. tries "topRight" position but overflows from the left. Next try: "top"
    // 2. tries "top" position but overflows from the top. Next try: "topLeft"
    // 3. tries "topLeft" position and fits into the screen
    expect(screen.queryByTestId("tooltipItem")).toHaveClass("topLeft");

    jest.clearAllMocks();
  });
});
