import "@testing-library/jest-dom";
import Badge from "@/components/Badge/Badge";
import { getByTestId, render, screen } from "@testing-library/react";
import { runIconPropTest } from "../../../utils/testUtils";

describe("Badge", () => {
  it("should be rendered with only required props", () => {
    expect(
      render(
        <Badge>
          <button />
        </Badge>,
      ).container,
    ).toMatchSnapshot();
  });

  it("should not be rendered when no children is given", () => {
    const { container } = render(<Badge />);
    expect(container.childElementCount).toBe(0);
  });

  it("should not render badge part when no props given", () => {
    const { container } = render(
      <Badge>
        <button />
      </Badge>,
    );
    expect(container.childElementCount).toBe(1);
  });

  it("content should be rendered as it is when content is not-a-number", () => {
    const content = "test content";
    render(
      <Badge content={content}>
        <button />
      </Badge>,
    );
    expect(screen.getByText(content)).toBeInTheDocument();
  });

  it("should the max number with a plus near it when content is a number greater than the max", () => {
    render(
      <Badge content="58" max={55}>
        <button />
      </Badge>,
    );
    expect(screen.getByText("55+")).toBeInTheDocument();
  });

  it("should be rendered as it is when content is a number less than or equal to the max", () => {
    render(
      <Badge content="53" max={55}>
        <button />
      </Badge>,
    );
    expect(screen.getByText("53")).toBeInTheDocument();
  });

  it("should declare the max as 999 when the max is not defined", () => {
    render(
      <Badge content="1000">
        <button />
      </Badge>,
    );
    expect(screen.getByText("999+")).toBeInTheDocument();
  });

  it("content should be rendered as it is when the max is set as a non positive", () => {
    render(
      <Badge content="123" max={-3}>
        <button />
      </Badge>,
    );
    expect(screen.getByText("123")).toBeInTheDocument();
  });

  it("should only render the icon when icon is set", () => {
    const testContent = "test-content";
    const { container } = render(
      <Badge icon="check" content={testContent}>
        <button />
      </Badge>,
    );
    expect(getByTestId(container, "badgeItem").textContent).toBe("check");
    expect(getByTestId(container, "badgeItem").textContent).not.toBe(testContent);
  });

  it("should render the main icon given in the icon prop", () => {
    runIconPropTest(
      icon =>
        render(
          <Badge icon={icon}>
            <button />
          </Badge>,
        ),
      "icon",
    );
  });

  it("should render no text content when the dot is true", () => {
    const { container } = render(
      <Badge content="test" dot>
        <button />
      </Badge>,
    );
    expect(getByTestId(container, "badgeItem")).toBeEmptyDOMElement();
  });

  it("should render no icon when the dot is true", () => {
    const { container } = render(
      <Badge icon="test" dot>
        <button />
      </Badge>,
    );
    expect(getByTestId(container, "badgeItem")).toBeEmptyDOMElement();
  });
});
