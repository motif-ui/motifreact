import "@testing-library/jest-dom";
import { render, RenderResult } from "@testing-library/react";
import GlobalIconWrapper from "./GlobalIconWrapper";
import { ReactElement } from "react";

export type ComponentWithIconRender = (icon: string | ReactElement) => RenderResult;

export const runIconPropTest = (renderIcon: ComponentWithIconRender, className?: string) => {
  const iconName = "home";

  const testStringIcon = () => {
    const { getByText } = renderIcon(iconName);
    const iconElement = getByText(iconName);
    expect(iconElement.tagName.toLowerCase()).toBe("span");
    className && expect(iconElement).toHaveClass(className);
  };

  const testReactElementIcon = () => {
    const { getByText } = renderIcon(<span>icon-element</span>);
    const externalIcon = getByText("icon-element");
    expect(externalIcon.tagName.toLowerCase()).toBe("span");
    expect(externalIcon.parentElement).toHaveClass("Root");
    className && expect(externalIcon.parentElement).toHaveClass(className);
  };

  testStringIcon();
  testReactElementIcon();
};

describe("GlobalIconWrapper", () => {
  it("should render the main icon given in the icon prop", () => {
    runIconPropTest(icon => render(<GlobalIconWrapper icon={icon} className="testClass" />), "testClass");
  });
});
