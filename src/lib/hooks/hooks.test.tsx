import { act, renderHook } from "@testing-library/react";
import useTimeout from "./useTimeout";

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
