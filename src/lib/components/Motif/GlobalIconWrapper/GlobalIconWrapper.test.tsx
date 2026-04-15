import "@testing-library/jest-dom";
import { render, RenderResult } from "@testing-library/react";
import GlobalIconWrapper from "./GlobalIconWrapper";
import { ReactElement } from "react";

export type IconRender = (icon: string | ReactElement) => RenderResult;

export const runIconPropTest = (renderIcon: IconRender, className?: string, iconName = "home") => {
  it("should render string icon with correct name and element type", () => {
    const { getByText } = renderIcon(iconName);
    const iconElement = getByText(iconName);
    expect(iconElement.tagName.toLowerCase()).toBe("span");
    className && expect(iconElement).toHaveClass(className);
  });

  it("should render ReactElement icon with correct element type and wrapper class", () => {
    const { getByText } = renderIcon(<span>icon-element</span>);
    const externalIcon = getByText("icon-element");
    expect(externalIcon.tagName.toLowerCase()).toBe("span");
    expect(externalIcon.parentElement).toHaveClass("externalIcon");
    className && expect(externalIcon.parentElement).toHaveClass(className);
  });
};

describe("GlobalIconWrapper", () => {
  runIconPropTest(icon => render(<GlobalIconWrapper icon={icon} className="testClass" />), "testClass");
});
