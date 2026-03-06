import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Link from "./Link";

describe("Link Component Tests", () => {
  it("should not render if both label and url are not provided", () => {
    const { container } = render(<Link />);
    expect(container.childElementCount).toBe(0);
  });

  it("should render url when label is not provided", () => {
    const url = "https://motif-ui.com/";
    render(<Link url={url} />);
    expect(screen.getByText(url)).toBeInTheDocument();
  });

  it("should have disabled cursor style when disable", () => {
    render(<Link label="Motif" disabled />);
    expect(screen.getByTestId("linkComponent")).toHaveClass("disabled");
  });
  it("should underline the text when underline prop is set to true", () => {
    render(<Link label="Motif" underline />);
    expect(screen.getByTestId("linkComponent")).toHaveClass("underline");
  });
  it("should render the external icon if external prop is given", () => {
    render(<Link external url="https://motif-ui.com/" />);
    expect(screen.getByText("external")).toBeInTheDocument();
  });

  it("should fire onClick event even if url and onClick are set together", () => {
    const handleClick = jest.fn();
    const url = "https://motif-ui.com/";
    render(<Link url={url} onClick={handleClick} />);
    const linkElement = screen.getByRole("link");
    fireEvent.click(linkElement);
    expect(handleClick).toHaveBeenCalled();
  });
  it("should fire onClick event even if label and onClick are set together", () => {
    const handleClick = jest.fn();
    const label = "Motif";
    render(<Link label={label} onClick={handleClick} />);
    const linkElement = screen.getByText(label);
    fireEvent.click(linkElement);
    expect(handleClick).toHaveBeenCalled();
  });
});
