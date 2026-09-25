import { act, renderHook } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import useTimeout from "./useTimeout";
import useViewport from "./useViewport";

describe("useTimeout", () => {
  jest.useFakeTimers();
  jest.spyOn(global, "setTimeout");
  jest.spyOn(global, "clearTimeout");

  it("should fire the callback after given delay time when started", () => {
    let startTime = 0;

    const { result } = renderHook(() =>
      useTimeout(() => {
        const totalTime = new Date().getTime() - startTime;
        expect(totalTime).toBe(1000);
      }, 1000),
    );

    act(() => {
      result.current.start();
      startTime = new Date().getTime();
      jest.runAllTimers();
    });
  });

  it("should not fire the callback when pause() is called after started", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useTimeout(callback, 1000));

    act(() => result.current.start());

    setTimeout(() => act(() => result.current.pause()), 300);
    jest.runAllTimers();
    expect(callback).not.toHaveBeenCalled();
  });

  it("should handle multiple pauses and fire the callback on time", () => {
    let startTime = 0;

    const { result } = renderHook(() =>
      useTimeout(() => {
        const totalTime = new Date().getTime() - startTime;
        expect(totalTime).toBe(11000);
      }, 1000),
    );

    // Start timer
    act(() => {
      result.current.start();
      startTime = new Date().getTime();
    });

    // Pause timer after 300ms
    setTimeout(() => act(() => result.current.pause()), 300);

    // Resume timer after 5000ms
    setTimeout(() => act(() => result.current.start()), 5300);

    // Pause timer after 300ms
    setTimeout(() => act(() => result.current.pause()), 5600);

    // Resume timer after 5000ms
    setTimeout(() => act(() => result.current.start()), 10600);

    jest.runAllTimers();
  });

  it("should not fire early when pause() is called twice in a row without an intervening start()", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useTimeout(callback, 1000));

    act(() => result.current.start());
    act(() => jest.advanceTimersByTime(300));

    // Simulate a duplicate pause, e.g. mouseenter and touchstart both firing for one hover.
    act(() => result.current.pause());
    act(() => result.current.pause());

    act(() => result.current.start());

    // 700ms should remain. Without an idempotent pause(), the second pause() would
    // subtract the elapsed time again and the timer would fire almost immediately.
    act(() => jest.advanceTimersByTime(699));
    expect(callback).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(1));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should ignore a duplicate start() call while already running instead of rescheduling the timer", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useTimeout(callback, 1000));

    act(() => result.current.start());
    act(() => jest.advanceTimersByTime(500));

    act(() => result.current.start());

    act(() => jest.advanceTimersByTime(499));
    expect(callback).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(1));
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe("useViewport", () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  const setWindowSize = (width: number, height: number) => {
    Object.defineProperty(window, "innerWidth", { value: width, writable: true, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: height, writable: true, configurable: true });
  };

  afterEach(() => setWindowSize(originalInnerWidth, originalInnerHeight));

  it("should return the current window dimensions on the first render", () => {
    setWindowSize(1024, 768);
    const { result } = renderHook(() => useViewport());
    expect(result.current).toEqual({ width: 1024, height: 768 });
  });

  it("should update the dimensions when the window is resized", () => {
    setWindowSize(1024, 768);
    const { result } = renderHook(() => useViewport());

    act(() => {
      setWindowSize(375, 667);
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toEqual({ width: 375, height: 667 });
  });

  it("should keep the same object reference while the dimensions are unchanged", () => {
    setWindowSize(1024, 768);
    const { result, rerender } = renderHook(() => useViewport());
    const firstViewport = result.current;

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });
    rerender();

    expect(result.current).toBe(firstViewport);
  });

  it("should share the latest dimensions between multiple consumers", () => {
    setWindowSize(1024, 768);
    const { result: first } = renderHook(() => useViewport());
    const { result: second } = renderHook(() => useViewport());

    act(() => {
      setWindowSize(800, 600);
      window.dispatchEvent(new Event("resize"));
    });

    expect(first.current).toEqual({ width: 800, height: 600 });
    expect(second.current).toBe(first.current);
  });

  it("should remove the resize listener on unmount", () => {
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useViewport());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });

  it("should return zero dimensions during server rendering", () => {
    const ViewportText = () => {
      const { width, height } = useViewport();
      return <span>{`${width}x${height}`}</span>;
    };

    expect(renderToString(<ViewportText />)).toContain("0x0");
  });
});
