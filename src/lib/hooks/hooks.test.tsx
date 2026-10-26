import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { useEffect, useLayoutEffect } from "react";
import type { RefObject } from "react";
import useDomReady from "./useDomReady";
import useOutsideClick from "./useOutsideClick";
import useTimeout from "./useTimeout";
import useToggle from "./useToggle";

describe("useTimeout", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("should fire the callback after given delay time when started", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useTimeout(callback, 1000));

    act(() => result.current.start());

    act(() => jest.advanceTimersByTime(999));
    expect(callback).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(1));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should not fire the callback when pause() is called after started", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useTimeout(callback, 1000));

    act(() => result.current.start());
    act(() => jest.advanceTimersByTime(300));
    act(() => result.current.pause());

    act(() => jest.runAllTimers());
    expect(callback).not.toHaveBeenCalled();

    // Resuming should fire after the remaining 700ms, proving the timer was actually running before the pause.
    act(() => result.current.start());
    act(() => jest.advanceTimersByTime(700));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should handle multiple pauses and fire the callback on time", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useTimeout(callback, 1000));

    act(() => result.current.start());
    act(() => jest.advanceTimersByTime(300));
    act(() => result.current.pause());
    act(() => jest.advanceTimersByTime(5000));
    expect(callback).not.toHaveBeenCalled();

    // Start timer
    act(() => result.current.start());
    act(() => jest.advanceTimersByTime(300));
    act(() => result.current.pause());
    act(() => jest.advanceTimersByTime(5000));
    expect(callback).not.toHaveBeenCalled();

    // Resume timer after 5000ms
    act(() => result.current.start());
    act(() => jest.advanceTimersByTime(399));
    expect(callback).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(1));
    expect(callback).toHaveBeenCalledTimes(1);
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

  it("should never fire the callback when delay is undefined", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useTimeout(callback, undefined));

    act(() => result.current.start());
    act(() => jest.runAllTimers());
    expect(callback).not.toHaveBeenCalled();
  });

  it("should treat pause() before start() as a no-op", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useTimeout(callback, 1000));

    act(() => result.current.pause());
    act(() => result.current.start());

    act(() => jest.advanceTimersByTime(999));
    expect(callback).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(1));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should reset the remaining time when clear() is called", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useTimeout(callback, 1000));

    act(() => result.current.start());
    act(() => jest.advanceTimersByTime(600));
    act(() => result.current.clear());

    act(() => jest.runAllTimers());
    expect(callback).not.toHaveBeenCalled();

    act(() => result.current.start());
    act(() => jest.advanceTimersByTime(999));
    expect(callback).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(1));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should reset the remaining time when clear() is called while paused", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useTimeout(callback, 1000));

    act(() => result.current.start());
    act(() => jest.advanceTimersByTime(600));
    act(() => result.current.pause());
    act(() => result.current.clear());
    act(() => result.current.start());

    act(() => jest.advanceTimersByTime(999));
    expect(callback).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(1));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should be restartable with the full delay after the callback fired", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useTimeout(callback, 1000));

    act(() => result.current.start());
    act(() => jest.advanceTimersByTime(1000));
    expect(callback).toHaveBeenCalledTimes(1);

    act(() => result.current.start());
    act(() => jest.advanceTimersByTime(999));
    expect(callback).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(1));
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("should call the latest callback when it changes while running", () => {
    const firstCallback = jest.fn();
    const secondCallback = jest.fn();
    const { result, rerender } = renderHook(({ callback }) => useTimeout(callback, 1000), {
      initialProps: { callback: firstCallback },
    });

    act(() => result.current.start());
    rerender({ callback: secondCallback });

    act(() => jest.advanceTimersByTime(1000));
    expect(firstCallback).not.toHaveBeenCalled();
    expect(secondCallback).toHaveBeenCalledTimes(1);
  });

  it("should keep the returned controls referentially stable across renders", () => {
    const { result, rerender } = renderHook(() => useTimeout(() => {}, 1000));
    const initialControls = result.current;

    rerender();
    expect(result.current).toBe(initialControls);
  });

  it("should stop and reset to the new delay when delay changes", () => {
    const callback = jest.fn();
    const { result, rerender } = renderHook(({ delay }) => useTimeout(callback, delay), {
      initialProps: { delay: 1000 },
    });

    act(() => result.current.start());
    act(() => jest.advanceTimersByTime(200));
    rerender({ delay: 5000 });

    act(() => jest.advanceTimersByTime(1000));
    expect(callback).not.toHaveBeenCalled();

    act(() => result.current.start());
    act(() => jest.advanceTimersByTime(4999));
    expect(callback).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(1));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should keep a timer started in a layout effect on mount", () => {
    const callback = jest.fn();
    renderHook(() => {
      const timer = useTimeout(callback, 1000);
      useLayoutEffect(() => timer.start(), [timer]);
    });

    act(() => jest.advanceTimersByTime(1000));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should keep a timer started in a child effect on mount", () => {
    const callback = jest.fn();
    const Child = ({ start }: { start: () => void }) => {
      useEffect(() => start(), [start]);
      return null;
    };
    const Parent = () => {
      const timer = useTimeout(callback, 1000);
      return <Child start={timer.start} />;
    };
    render(<Parent />);

    act(() => jest.advanceTimersByTime(1000));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should not fire the callback after unmount", () => {
    const callback = jest.fn();
    const { result, unmount } = renderHook(() => useTimeout(callback, 1000));

    act(() => result.current.start());
    unmount();

    act(() => jest.runAllTimers());
    expect(callback).not.toHaveBeenCalled();
  });
});

describe("useToggle", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("should toggle visibility when called without arguments", () => {
    const { result } = renderHook(() => useToggle());

    act(() => result.current.toggle());
    expect(result.current.visible).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.visible).toBe(false);
  });

  it("should force the visibility when a boolean is given", () => {
    const { result } = renderHook(() => useToggle());

    act(() => result.current.toggle(true));
    act(() => result.current.toggle(true));
    expect(result.current.visible).toBe(true);
    act(() => result.current.toggle(false));
    expect(result.current.visible).toBe(false);
  });

  it("should toggle when used directly as an event handler", () => {
    const { result } = renderHook(() => useToggle());

    act(() => (result.current.toggle as unknown as (e: object) => void)({ type: "click" }));
    expect(result.current.visible).toBe(true);
    act(() => (result.current.toggle as unknown as (e: object) => void)({ type: "click" }));
    expect(result.current.visible).toBe(false);
  });

  it("should keep the hiding state for the given duration", () => {
    const { result } = renderHook(() => useToggle({ initialVisible: true, duration: 300 }));

    act(() => result.current.hide());
    expect(result.current.visible).toBe(false);
    expect(result.current.toggleState).toBe("hiding");

    act(() => jest.advanceTimersByTime(300));
    expect(result.current.toggleState).toBeUndefined();
  });

  it("should respect initialVisible", () => {
    const { result } = renderHook(() => useToggle({ initialVisible: true }));

    expect(result.current.visible).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.visible).toBe(false);
  });

  it("should become visible after two animation frames and clear the showing state after the duration", () => {
    const { result } = renderHook(() => useToggle({ duration: 300 }));

    act(() => result.current.show());
    expect(result.current.visible).toBe(false);
    expect(result.current.toggleState).toBe("showing");

    act(() => jest.advanceTimersByTime(32));
    expect(result.current.visible).toBe(true);
    expect(result.current.toggleState).toBe("showing");

    act(() => jest.advanceTimersByTime(300));
    expect(result.current.toggleState).toBeUndefined();
  });

  it("should cancel a pending show when hide() is called before the animation frames run", () => {
    const { result } = renderHook(() => useToggle({ duration: 300 }));

    act(() => result.current.show());
    act(() => result.current.hide());
    act(() => jest.runAllTimers());

    expect(result.current.visible).toBe(false);
    expect(result.current.toggleState).toBeUndefined();
  });

  it("should not let a stale hiding timeout clear the showing state", () => {
    const { result } = renderHook(() => useToggle({ initialVisible: true, duration: 300 }));

    act(() => result.current.hide());
    act(() => jest.advanceTimersByTime(100));
    act(() => result.current.show());

    // The hide timeout would have fired at 300ms; showing must still be in progress.
    act(() => jest.advanceTimersByTime(250));
    expect(result.current.visible).toBe(true);
    expect(result.current.toggleState).toBe("showing");

    act(() => jest.advanceTimersByTime(100));
    expect(result.current.toggleState).toBeUndefined();
  });

  it("should cancel pending animation frames and timeouts on unmount", () => {
    const cancelAnimationFrameSpy = jest.spyOn(global, "cancelAnimationFrame");
    const { result, unmount } = renderHook(() => useToggle({ duration: 300 }));

    act(() => result.current.show());
    unmount();

    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
    expect(jest.getTimerCount()).toBe(0);

    cancelAnimationFrameSpy.mockRestore();
  });
});

describe("useDomReady", () => {
  it("should return false on the first render and true after mount", () => {
    const values: boolean[] = [];
    const { result } = renderHook(() => {
      const domReady = useDomReady();
      values.push(domReady);
      return domReady;
    });

    expect(values[0]).toBe(false);
    expect(result.current).toBe(true);
  });

  it("should stay true on rerender without extra renders", () => {
    const values: boolean[] = [];
    const { result, rerender } = renderHook(() => {
      const domReady = useDomReady();
      values.push(domReady);
      return domReady;
    });

    rerender();
    rerender();

    expect(result.current).toBe(true);
    expect(values).toEqual([false, true, true, true]);
  });

  it("should start from false again when remounted", () => {
    const first = renderHook(() => useDomReady());
    expect(first.result.current).toBe(true);
    first.unmount();

    const values: boolean[] = [];
    const { result } = renderHook(() => {
      const domReady = useDomReady();
      values.push(domReady);
      return domReady;
    });

    expect(values[0]).toBe(false);
    expect(result.current).toBe(true);
  });
});

describe("useOutsideClick", () => {
  const TestComponent = ({
    callback,
    excludedRefs,
  }: {
    callback: (event: MouseEvent | TouchEvent) => void;
    excludedRefs?: RefObject<HTMLElement | null>[];
  }) => {
    const ref = useOutsideClick<HTMLDivElement>(callback, excludedRefs);
    return (
      <div ref={ref}>
        <button>inside</button>
      </div>
    );
  };

  it("should call the callback when clicked outside of the ref element", () => {
    const callback = jest.fn();
    render(
      <>
        <TestComponent callback={callback} />
        <button>outside</button>
      </>,
    );

    fireEvent.mouseUp(screen.getByText("inside"));
    expect(callback).not.toHaveBeenCalled();

    fireEvent.mouseUp(screen.getByText("outside"));
    expect(callback).toHaveBeenCalledTimes(1);

    fireEvent.touchEnd(screen.getByText("outside"));
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("should not call the callback when clicked on an excluded element", () => {
    const callback = jest.fn();
    const excludedElement = document.createElement("button");
    document.body.appendChild(excludedElement);
    const excludedRefs = [{ current: excludedElement }];

    render(<TestComponent callback={callback} excludedRefs={excludedRefs} />);

    fireEvent.mouseUp(excludedElement);
    expect(callback).not.toHaveBeenCalled();

    excludedElement.remove();
  });

  it("should remove the listeners on unmount", () => {
    const callback = jest.fn();
    const { unmount } = render(<TestComponent callback={callback} />);

    unmount();
    fireEvent.mouseUp(document.body);
    fireEvent.touchEnd(document.body);
    expect(callback).not.toHaveBeenCalled();
  });

  it("should not call the callback when the ref is not attached to any element", () => {
    const callback = jest.fn();
    const Unattached = () => {
      useOutsideClick<HTMLDivElement>(callback);
      return <button>outside</button>;
    };
    render(<Unattached />);

    fireEvent.mouseUp(screen.getByText("outside"));
    expect(callback).not.toHaveBeenCalled();
  });

  it("should pass the triggering event to the callback", () => {
    const callback = jest.fn();
    render(<TestComponent callback={callback} />);

    fireEvent.mouseUp(document.body);
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({ type: "mouseup", target: document.body }));
  });

  it("should ignore excluded refs that are not attached", () => {
    const callback = jest.fn();
    const excludedRefs = [{ current: null }];
    render(<TestComponent callback={callback} excludedRefs={excludedRefs} />);

    fireEvent.mouseUp(document.body);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should call only the latest callback after it changes", () => {
    const firstCallback = jest.fn();
    const secondCallback = jest.fn();
    const { rerender } = render(<TestComponent callback={firstCallback} />);

    rerender(<TestComponent callback={secondCallback} />);
    fireEvent.mouseUp(document.body);

    expect(firstCallback).not.toHaveBeenCalled();
    expect(secondCallback).toHaveBeenCalledTimes(1);
  });
});
