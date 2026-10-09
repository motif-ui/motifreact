import { act, renderHook } from "@testing-library/react";
import useVisibilityTransition from "./useVisibilityTransition";

describe("useVisibilityTransition", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  // The enter transition waits two animation frames
  const waitFrames = () => {
    act(() => jest.runOnlyPendingTimers());
    act(() => jest.runOnlyPendingTimers());
  };

  const renderTransition = (open: boolean, duration?: number) =>
    renderHook(({ open }) => useVisibilityTransition(open, duration), { initialProps: { open } });

  it("should follow the open state immediately without a duration", () => {
    const { result, rerender } = renderTransition(false);
    expect(result.current).toEqual({ attached: false, visible: false });

    rerender({ open: true });
    expect(result.current).toEqual({ attached: true, visible: true });

    rerender({ open: false });
    expect(result.current).toEqual({ attached: false, visible: false });
  });

  it("should be attached but not visible until the enter transition starts", () => {
    const { result, rerender } = renderTransition(false, 300);

    rerender({ open: true });
    expect(result.current).toEqual({ attached: true, visible: false });

    waitFrames();
    expect(result.current).toEqual({ attached: true, visible: true });
  });

  it("should stay attached during the exit transition", () => {
    const { result, rerender } = renderTransition(true, 300);
    waitFrames();

    rerender({ open: false });
    expect(result.current).toEqual({ attached: true, visible: false });

    act(() => jest.advanceTimersByTime(299));
    expect(result.current.attached).toBe(true);
    act(() => jest.advanceTimersByTime(1));
    expect(result.current).toEqual({ attached: false, visible: false });
  });

  it("should play the enter transition when it is open on mount", () => {
    const { result } = renderTransition(true, 300);
    expect(result.current).toEqual({ attached: true, visible: false });

    waitFrames();
    expect(result.current.visible).toBe(true);
  });

  it("should not be attached on mount when it is closed", () => {
    const { result } = renderTransition(false, 300);
    act(() => jest.advanceTimersByTime(300));
    expect(result.current).toEqual({ attached: false, visible: false });
  });

  it("should not become visible when it is closed before the enter transition starts", () => {
    const { result, rerender } = renderTransition(false, 300);

    rerender({ open: true });
    rerender({ open: false });
    waitFrames();
    expect(result.current.visible).toBe(false);

    act(() => jest.advanceTimersByTime(300));
    expect(result.current.attached).toBe(false);
  });

  it("should stay attached and enter again when it is opened during the exit transition", () => {
    const { result, rerender } = renderTransition(true, 300);
    waitFrames();

    rerender({ open: false });
    act(() => jest.advanceTimersByTime(100));
    rerender({ open: true });
    expect(result.current.attached).toBe(true);

    act(() => jest.advanceTimersByTime(300));
    expect(result.current).toEqual({ attached: true, visible: true });
  });
});
