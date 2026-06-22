import { act, renderHook } from "@testing-library/react";
import MotifProvider, { useMotifContext } from "../context/MotifProvider";
import usePropsWithThemeDefaults from "./usePropsWithThemeDefaults";
import type { ComponentDefaults } from "../types/contextProps";

describe("usePropsWithThemeDefaults", () => {
  it("should merge defaults with provided props", () => {
    const componentDefaults: ComponentDefaults = {
      Button: { variant: "primary", size: "md" },
    };

    const { result } = renderHook(() => usePropsWithThemeDefaults("Button", { label: "Test" }), {
      wrapper: ({ children }) => <MotifProvider componentDefaults={componentDefaults}>{children}</MotifProvider>,
    });

    expect(result.current).toEqual({
      variant: "primary",
      size: "md",
      label: "Test",
    });
  });

  it("should allow props to override defaults", () => {
    const componentDefaults: ComponentDefaults = {
      Button: { variant: "primary", size: "md" },
    };

    const { result } = renderHook(() => usePropsWithThemeDefaults("Button", { label: "Test", variant: "secondary" }), {
      wrapper: ({ children }) => <MotifProvider componentDefaults={componentDefaults}>{children}</MotifProvider>,
    });

    expect(result.current).toEqual({
      variant: "secondary",
      size: "md",
      label: "Test",
    });
  });

  it("should merge classNames from defaults and props", () => {
    const componentDefaults: ComponentDefaults = {
      Button: { className: "btn-solid" },
    };

    const { result } = renderHook(() => usePropsWithThemeDefaults("Button", { className: "highlight" }), {
      wrapper: ({ children }) => <MotifProvider componentDefaults={componentDefaults}>{children}</MotifProvider>,
    });

    expect(result.current).toEqual({
      className: "btn-solid highlight",
    });
  });

  it("should have default className when props do not provide one", () => {
    const componentDefaults: ComponentDefaults = {
      Button: { className: "btn-solid" },
    };

    const { result } = renderHook(() => usePropsWithThemeDefaults("Button", { label: "Test" }), {
      wrapper: ({ children }) => <MotifProvider componentDefaults={componentDefaults}>{children}</MotifProvider>,
    });

    expect(result.current).toEqual({
      className: "btn-solid",
      label: "Test",
    });
  });

  it("should have provided className when defaults do not provide one", () => {
    const componentDefaults: ComponentDefaults = {
      Button: { variant: "primary" },
    };

    const { result } = renderHook(() => usePropsWithThemeDefaults("Button", { className: "highlight" }), {
      wrapper: ({ children }) => <MotifProvider componentDefaults={componentDefaults}>{children}</MotifProvider>,
    });

    expect(result.current).toEqual({
      variant: "primary",
      className: "highlight",
    });
  });

  it("should not merge className when it is an empty string", () => {
    const componentDefaults: ComponentDefaults = {
      Button: { className: "btn-solid" },
    };

    const { result } = renderHook(() => usePropsWithThemeDefaults("Button", { className: "" }), {
      wrapper: ({ children }) => <MotifProvider componentDefaults={componentDefaults}>{children}</MotifProvider>,
    });

    expect(result.current).toEqual({
      className: "",
    });
  });

  it("should preserve all props during merge", () => {
    const componentDefaults: ComponentDefaults = {
      Button: { variant: "primary", size: "md" },
    };
    const onClick = jest.fn();

    const { result } = renderHook(
      () =>
        usePropsWithThemeDefaults("Button", {
          label: "Click me",
          disabled: true,
          onClick,
          htmlType: "submit",
        }),
      {
        wrapper: ({ children }) => <MotifProvider componentDefaults={componentDefaults}>{children}</MotifProvider>,
      },
    );

    expect(result.current).toEqual({
      variant: "primary",
      size: "md",
      label: "Click me",
      disabled: true,
      onClick,
      htmlType: "submit",
    });
  });

  it("should merge different defaults for different components", () => {
    const componentDefaults: ComponentDefaults = {
      Badge: { max: 10 },
      Alert: { variant: "info" },
    };

    const { result: badgeResult } = renderHook(() => usePropsWithThemeDefaults("Badge", { content: "20" }), {
      wrapper: ({ children }) => <MotifProvider componentDefaults={componentDefaults}>{children}</MotifProvider>,
    });

    const { result: alertResult } = renderHook(() => usePropsWithThemeDefaults("Alert", { message: "Warning" }), {
      wrapper: ({ children }) => <MotifProvider componentDefaults={componentDefaults}>{children}</MotifProvider>,
    });

    expect(badgeResult.current).toEqual({
      max: 10,
      content: "20",
    });

    expect(alertResult.current).toEqual({
      variant: "info",
      message: "Warning",
    });
  });

  it("should reflect updated defaults from context", () => {
    const componentDefaults: ComponentDefaults = {
      Button: { variant: "primary" },
    };

    const { result } = renderHook(
      () => ({
        props: usePropsWithThemeDefaults("Button", { label: "Test" }),
        setComponentDefaults: useMotifContext().setComponentDefaults,
      }),
      {
        wrapper: ({ children }) => <MotifProvider componentDefaults={componentDefaults}>{children}</MotifProvider>,
      },
    );

    expect(result.current.props).toEqual({
      variant: "primary",
      label: "Test",
    });

    act(() => {
      result.current.setComponentDefaults({
        Button: { variant: "secondary", size: "lg" },
      });
    });

    expect(result.current.props).toEqual({
      variant: "secondary",
      size: "lg",
      label: "Test",
    });
  });

  it("should fall back when component is not in defaults", () => {
    const componentDefaults: ComponentDefaults = {
      Badge: { max: 10 },
      Alert: { variant: "info" },
    };

    const { result } = renderHook(() => usePropsWithThemeDefaults("Button", { label: "Test" }), {
      wrapper: ({ children }) => <MotifProvider componentDefaults={componentDefaults}>{children}</MotifProvider>,
    });

    expect(result.current).toEqual({ label: "Test" });
  });

  it("should fall back when component is removed from defaults", () => {
    const componentDefaults: ComponentDefaults = {
      Button: { variant: "primary" },
    };

    const { result } = renderHook(
      () => ({
        props: usePropsWithThemeDefaults("Button", { label: "Test" }),
        setComponentDefaults: useMotifContext().setComponentDefaults,
      }),
      {
        wrapper: ({ children }) => <MotifProvider componentDefaults={componentDefaults}>{children}</MotifProvider>,
      },
    );

    expect(result.current.props).toEqual({
      variant: "primary",
      label: "Test",
    });

    act(() => {
      result.current.setComponentDefaults({
        Badge: { max: 10 },
      });
    });

    expect(result.current.props).toEqual({ label: "Test" });
  });

  it("should handle partial override with className merge", () => {
    const componentDefaults: ComponentDefaults = {
      Button: { className: "btn-base", variant: "primary", size: "md" },
    };

    const { result } = renderHook(
      () =>
        usePropsWithThemeDefaults("Button", {
          className: "custom",
          variant: "danger",
          label: "Delete",
        }),
      {
        wrapper: ({ children }) => <MotifProvider componentDefaults={componentDefaults}>{children}</MotifProvider>,
      },
    );

    expect(result.current).toEqual({
      className: "btn-base custom",
      variant: "danger",
      size: "md",
      label: "Delete",
    });
  });
});
