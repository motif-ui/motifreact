import "@testing-library/jest-dom";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Carousel from "./Carousel";
import { IndicatorShape, Theme } from "./types";
import { ReactNode } from "react";

const renderExt = (props = {}, component?: ReactNode) => {
  const result = render(
    component ?? (
      <Carousel height={400} {...props}>
        <Carousel.Item title="Slide 1" subtitle="Subtitle 1">
          <img src="img1.jpg" alt="Image 1" />
        </Carousel.Item>
        <Carousel.Item title="Slide 2" subtitle="Subtitle 2">
          <img src="img2.jpg" alt="Image 2" />
        </Carousel.Item>
      </Carousel>
    ),
  );

  const { container } = result;
  const getTrack = () => container.getElementsByClassName("track")[0];
  const getIndicators = () => container.getElementsByClassName("indicators")[0];
  const getIndicatorItems = () => container.querySelectorAll("ul li");
  const getNextButton = () => screen.getAllByText("arrow_forward_ios")[1];
  const getPrevButton = () => screen.getAllByText("arrow_forward_ios")[0];

  return {
    ...result,
    getTrack,
    getIndicators,
    getIndicatorItems,
    getNextButton,
    getPrevButton,
  };
};

describe("Carousel", () => {
  it("should be rendered with only required props and should have default prop values", () => {
    jest.useFakeTimers();
    const { getIndicators, getTrack, container, rerender } = renderExt();
    const autoplayIntervalDefault = 3000;
    expect(container).toMatchSnapshot();

    expect(getIndicators()).toBeInTheDocument();
    expect(screen.getAllByText("arrow_forward_ios")).toHaveLength(2);
    expect(container.firstChild).toHaveClass("light");

    rerender(
      <Carousel height={400} autoplay>
        <Carousel.Item title="Slide 1" />
        <Carousel.Item title="Slide 2" />
      </Carousel>,
    );
    act(() => {
      jest.advanceTimersByTime(autoplayIntervalDefault);
    });
    expect(getTrack()).toHaveStyle({ transform: "translateX(-100%)" });

    jest.useRealTimers();
  });

  it("should render all carousel items as children", () => {
    renderExt();
    expect(screen.getByText("Slide 1")).toBeInTheDocument();
    expect(screen.getByText("Slide 2")).toBeInTheDocument();
  });

  it("should apply the given height via style", () => {
    expect(renderExt({ height: 500 }).container.firstChild).toHaveStyle({ height: "500px" });
    expect(renderExt({ height: "50vh" }).container.firstChild).toHaveStyle({ height: "50vh" });
    expect(renderExt({ height: "50%" }).container.firstChild).toHaveStyle({ height: "50%" });
  });

  it("should be rendered with the given theme in theme prop", () => {
    const themes: Theme[] = ["light", "dark"];
    themes.forEach(theme => {
      const { container, unmount } = renderExt({ theme });
      expect(container.firstChild).toHaveClass(theme);
      unmount();
    });
  });

  it("should not render indicators when removeIndicators prop is true", () => {
    const { getIndicators } = renderExt({ removeIndicators: true });
    expect(getIndicators()).toBeUndefined();
  });

  it("should not render control buttons when removeControls prop is true", () => {
    renderExt({ removeControls: true });
    expect(screen.queryAllByText("arrow_forward_ios")).toHaveLength(0);
  });

  it("should render indicators with the given shape in indicatorShape prop", () => {
    const shapes: IndicatorShape[] = ["dot", "line"];
    shapes.forEach(shape => {
      const { getIndicators, unmount } = renderExt({ indicatorShape: shape });
      expect(getIndicators()).toHaveClass(shape);
      unmount();
    });
  });

  it("should render the correct number of indicator items matching the children count", () => {
    const { getIndicatorItems } = renderExt();
    expect(getIndicatorItems()).toHaveLength(2);
  });

  it("should navigate to the next slide when the next button is clicked", () => {
    const { getTrack, getNextButton } = renderExt(
      {},
      <Carousel height={400}>
        <Carousel.Item title="Slide 1" />
        <Carousel.Item title="Slide 2" />
        <Carousel.Item title="Slide 3" />
      </Carousel>,
    );

    expect(getTrack()).toHaveStyle({ transform: "translateX(-0%)" });

    fireEvent.click(getNextButton());
    expect(getTrack()).toHaveStyle({ transform: "translateX(-100%)" });

    fireEvent.click(getNextButton());
    expect(getTrack()).toHaveStyle({ transform: "translateX(-200%)" });
  });

  it("should navigate to the previous slide when the prev button is clicked", () => {
    const { getTrack, getPrevButton } = renderExt(
      {},
      <Carousel height={400} activeIndex={2}>
        <Carousel.Item title="Slide 1" />
        <Carousel.Item title="Slide 2" />
        <Carousel.Item title="Slide 3" />
      </Carousel>,
    );

    expect(getTrack()).toHaveStyle({ transform: "translateX(-200%)" });

    fireEvent.click(getPrevButton());
    expect(getTrack()).toHaveStyle({ transform: "translateX(-100%)" });

    fireEvent.click(getPrevButton());
    expect(getTrack()).toHaveStyle({ transform: "translateX(-0%)" });
  });

  it("should wrap around to the first slide when clicking next on the last slide", () => {
    const { getTrack, getNextButton } = renderExt({ activeIndex: 1 });

    expect(getTrack()).toHaveStyle({ transform: "translateX(-100%)" });

    fireEvent.click(getNextButton());
    expect(getTrack()).toHaveStyle({ transform: "translateX(-0%)" });
  });

  it("should wrap around to the last slide when clicking prev on the first slide", () => {
    const { getTrack, getPrevButton } = renderExt({ activeIndex: 1 });

    expect(getTrack()).toHaveStyle({ transform: "translateX(-100%)" });

    fireEvent.click(getPrevButton());
    expect(getTrack()).toHaveStyle({ transform: "translateX(-0%)" });

    fireEvent.click(getPrevButton());
    expect(getTrack()).toHaveStyle({ transform: "translateX(-100%)" });
  });

  it("should navigate to the corresponding slide when an indicator is clicked", () => {
    const { getTrack, getIndicatorItems } = renderExt(
      {},
      <Carousel height={400}>
        <Carousel.Item title="Slide 1" />
        <Carousel.Item title="Slide 2" />
        <Carousel.Item title="Slide 3" />
        <Carousel.Item title="Slide 4" />
      </Carousel>,
    );

    fireEvent.click(getIndicatorItems()[2]);
    expect(getTrack()).toHaveStyle({ transform: "translateX(-200%)" });
  });

  it("should mark the indicator of the current slide as active", () => {
    const { getIndicatorItems } = renderExt();

    expect(getIndicatorItems()[0]).toHaveClass("active");
    expect(getIndicatorItems()[1]).not.toHaveClass("active");

    fireEvent.click(getIndicatorItems()[1]);
    expect(getIndicatorItems()[0]).not.toHaveClass("active");
    expect(getIndicatorItems()[1]).toHaveClass("active");
  });

  it("should initially display the child that is in the order specified by the activeIndex.", () => {
    const { getTrack } = renderExt({ activeIndex: 1 });
    expect(getTrack()).toHaveStyle({ transform: "translateX(-100%)" });
  });

  it("should fallback to the first slide when given an invalid activeIndex", () => {
    const { getTrack } = renderExt({ activeIndex: 5 });
    expect(getTrack()).toHaveStyle({ transform: "translateX(-0%)" });
  });

  it("should auto-advance slides when autoplay is true", () => {
    jest.useFakeTimers();
    const { getTrack } = renderExt(
      {},
      <Carousel height={400} autoplay>
        <Carousel.Item title="Slide 1" />
        <Carousel.Item title="Slide 2" />
        <Carousel.Item title="Slide 3" />
      </Carousel>,
    );

    expect(getTrack()).toHaveStyle({ transform: "translateX(-0%)" });

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getTrack()).toHaveStyle({ transform: "translateX(-100%)" });

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getTrack()).toHaveStyle({ transform: "translateX(-200%)" });

    jest.useRealTimers();
  });

  it("should pause autoplay on mouse enter when autoplay and pauseOnHover is true", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null, advanceTimers: jest.advanceTimersByTime });

    const { getTrack, container } = renderExt(
      {},
      <Carousel height={400} autoplay pauseOnHover>
        <Carousel.Item title="Slide 1" />
        <Carousel.Item title="Slide 2" />
        <Carousel.Item title="Slide 3" />
      </Carousel>,
    );

    expect(getTrack()).toHaveStyle({ transform: "translateX(-0%)" });

    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(getTrack()).toHaveStyle({ transform: "translateX(-100%)" });

    await act(async () => {
      await user.hover(container.firstChild as HTMLElement);
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(getTrack()).toHaveStyle({ transform: "translateX(-100%)" });

    await act(async () => {
      await user.unhover(container.firstChild as HTMLElement);
    });

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getTrack()).toHaveStyle({ transform: "translateX(-200%)" });

    jest.useRealTimers();
  });

  it("should render children with the given content", () => {
    renderExt(
      {},
      <Carousel height={400}>
        <Carousel.Item>
          <div>Custom Content</div>
        </Carousel.Item>
      </Carousel>,
    );
    expect(screen.getByText("Custom Content")).toBeInTheDocument();
  });

  it("should render title when title prop is given", () => {
    renderExt(
      {},
      <Carousel height={400}>
        <Carousel.Item title="Test Title">content</Carousel.Item>
      </Carousel>,
    );
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("should render subtitle when subtitle prop is given", () => {
    renderExt(
      {},
      <Carousel height={400}>
        <Carousel.Item subtitle="Test Subtitle">content</Carousel.Item>
      </Carousel>,
    );
    expect(screen.getByText("Test Subtitle")).toBeInTheDocument();
  });

  it("should render both title and subtitle when both props are given", () => {
    renderExt(
      {},
      <Carousel height={400}>
        <Carousel.Item title="Test Title" subtitle="Test Subtitle">
          content
        </Carousel.Item>
      </Carousel>,
    );
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Subtitle")).toBeInTheDocument();
  });

  it("should stop autoplay when autoplay prop changes to false", () => {
    jest.useFakeTimers();
    const { getTrack, rerender } = renderExt(
      {},
      <Carousel height={400} autoplay autoplayInterval={1000}>
        <Carousel.Item title="Slide 1" />
        <Carousel.Item title="Slide 2" />
        <Carousel.Item title="Slide 3" />
      </Carousel>,
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(getTrack()).toHaveStyle({ transform: "translateX(-100%)" });

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(getTrack()).toHaveStyle({ transform: "translateX(-200%)" });

    rerender(
      <Carousel height={400} autoplayInterval={1000}>
        <Carousel.Item title="Slide 1" />
        <Carousel.Item title="Slide 2" />
        <Carousel.Item title="Slide 3" />
      </Carousel>,
    );

    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(getTrack()).toHaveStyle({ transform: "translateX(-200%)" });

    jest.useRealTimers();
  });
});
