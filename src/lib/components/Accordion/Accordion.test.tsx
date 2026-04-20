import "@testing-library/jest-dom";
import Accordion from "@/components/Accordion/Accordion";
import { render, screen, fireEvent } from "@testing-library/react";
import { runIconPropTest } from "@/components/Motif/GlobalIconWrapper/GlobalIconWrapper.test";

describe("Accordion", () => {
  it("should be rendered with only required props", () => {
    expect(render(<Accordion title="Accordion Title" />).container).toMatchSnapshot();
  });

  it("should display title given with title prop", () => {
    render(<Accordion title="Accordion Title" />);
    expect(screen.getByText("Accordion Title")).toBeInTheDocument();
  });

  it("should render text given in the text prop as expanded content", () => {
    render(<Accordion title="Accordion Title" text="text content" />);
    expect(screen.getByText("text content")).toBeInTheDocument();
  });

  it("should give precedence to the text prop if it is given along with a child content", () => {
    render(
      <Accordion title="Accordion Title" text="text content">
        <table />
      </Accordion>,
    );
    expect(screen.getByText("text content")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("should be rendered collapsed by default", () => {
    expect(render(<Accordion title="Accordion Title" />).container.firstChild).not.toHaveClass("expanded");
  });

  it("should be rendered as expanded when expanded prop is true", () => {
    expect(render(<Accordion title="Accordion Title" expanded />).container.firstChild).toHaveClass("expanded");
  });

  it("should render the main icon given in the icon prop", () => {
    runIconPropTest(icon => render(<Accordion title="Accordion Title" icon={icon} />), "icon");
  });

  it("should trigger the event given in the onToggle prop when toggled", () => {
    const handleToggle = jest.fn();
    const { container } = render(<Accordion title="Accordion Title" onToggle={handleToggle} />);
    fireEvent.click(container.getElementsByClassName("header")[0]);
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it("should render any given child element as expanded content", () => {
    render(
      <Accordion title="Accordion Title">
        <table />
      </Accordion>,
    );
    expect(screen.getByRole("table")).toBeInTheDocument();
  });
});
