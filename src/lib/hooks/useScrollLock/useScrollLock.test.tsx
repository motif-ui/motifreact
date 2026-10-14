import { renderHook } from "@testing-library/react";
import useScrollLock from "./useScrollLock";

describe("useScrollLock", () => {
  const { style } = document.documentElement;

  afterEach(() => style.removeProperty("overflow"));

  it("should lock the page's scroll while enabled, and restore the page's own style", () => {
    style.overflow = "auto";
    const { rerender } = renderHook(({ enabled }) => useScrollLock(enabled), { initialProps: { enabled: false } });
    expect(style.overflow).toBe("auto");

    rerender({ enabled: true });
    expect(style.overflow).toBe("hidden");

    rerender({ enabled: false });
    expect(style.overflow).toBe("auto");
  });

  it("should keep the page locked until the last lock is released, e.g. a modal opened from another one", () => {
    const first = renderHook(() => useScrollLock(true));
    const second = renderHook(() => useScrollLock(true));

    first.unmount();
    expect(style.overflow).toBe("hidden");

    second.unmount();
    expect(style.overflow).toBe("");
  });
});
