import { render } from "@testing-library/react";
import ProgressBar from "@/components/ProgressBar/ProgressBar";

describe("ProgressBar", () => {
  it("should be rendered with only required props", () => {
    expect(render(<ProgressBar />).container).toMatchSnapshot();
  });

  it("should be rendered in different color scheme based on the variant prop", () => {
    const variants: ("primary" | "success" | "danger" | "warning" | "info" | "secondary")[] = [
      "primary",
      "success",
      "danger",
      "warning",
      "info",
      "secondary",
    ];
    variants.forEach(variant => {
      expect(render(<ProgressBar variant={variant} />).container.firstChild).toHaveClass(variant);
    });
  });

  it("should be rendered in a size given with the size prop", () => {
    const sizes: ("sm" | "md" | "lg" | "xl")[] = ["sm", "md", "lg", "xl"];
    sizes.forEach(size => {
      expect(render(<ProgressBar size={size} />).container.firstChild).toHaveClass(size);
    });
  });

  it("should be rendered as bar by default", () => {
    const { container } = render(<ProgressBar />);
    expect(container.firstElementChild?.tagName.toLocaleLowerCase()).toBe("div");
  });

  it("should render percentage info when showPercentage prop is set to true", () => {
    expect(render(<ProgressBar progress={40} showPercentage />).queryByText("40%")).toBeInTheDocument();
  });

  it("should fill the area same with the given progress info", () => {
    expect(render(<ProgressBar progress={40} />).container.getElementsByClassName("bar")[0]).toHaveStyle("--percentage: 40");
  });

  it("should show percentage info and filled area in sync when percentage has changed", () => {
    const { container, rerender, queryByText } = render(<ProgressBar progress={40} showPercentage />);
    expect(container.getElementsByClassName("bar")[0]).toHaveStyle("--percentage: 40");
    expect(queryByText("40%")).toBeInTheDocument();

    rerender(<ProgressBar progress={60} showPercentage />);
    expect(container.getElementsByClassName("bar")[0]).toHaveStyle("--percentage: 60");
    expect(queryByText("60%")).toBeInTheDocument();
  });

  it("should not show percentage info when indeterminate prop is set to true regardless of the showPercentage prop value", () => {
    expect(render(<ProgressBar progress={40} showPercentage indeterminate />).queryByText("40%")).not.toBeInTheDocument();
  });

  it("should apply given style and className props", () => {
    const { container } = render(<ProgressBar className="testClass" style={{ background: "red" }} />);
    expect(container.firstChild).toHaveClass("testClass");
    expect(container.firstChild).toHaveStyle("background: red");
  });

  it("should be able to use maxProgress prop and calculate the percentage accordingly", () => {
    const progress = 50;
    const maxProgress = 250;
    const percentage = Math.floor((progress / maxProgress) * 100);

    const { container, queryByText } = render(<ProgressBar progress={progress} maxProgress={maxProgress} showPercentage />);
    expect(queryByText("50")).not.toBeInTheDocument();
    expect(container.getElementsByClassName("bar")[0]).not.toHaveStyle("--percentage: 50");
    expect(queryByText(percentage + "%")).toBeInTheDocument();
    expect(container.getElementsByClassName("bar")[0]).toHaveStyle("--percentage: " + percentage);
  });

  it("should reset progress to zero when given progress is a negative number", () => {
    const { container, queryByText } = render(<ProgressBar progress={-5} showPercentage />);
    expect(queryByText("-5")).not.toBeInTheDocument();
    expect(container.getElementsByClassName("bar")[0]).not.toHaveStyle("--percentage: -5");
    expect(queryByText("0%")).toBeInTheDocument();
    expect(container.getElementsByClassName("bar")[0]).toHaveStyle("--percentage: 0");
  });

  it("should reset progress to the maxProgress when given progress exceeds it", () => {
    const { container, queryByText } = render(<ProgressBar progress={200} showPercentage maxProgress={150} />);
    expect(queryByText("200")).not.toBeInTheDocument();
    expect(container.getElementsByClassName("bar")[0]).not.toHaveStyle("--percentage: 200");
    expect(queryByText("100%")).toBeInTheDocument();
    expect(container.getElementsByClassName("bar")[0]).toHaveStyle("--percentage: 100");
  });

  it("should be rendered as linear counting down when countdown prop is set", () => {
    const duration = 10000;

    const { rerender, container } = render(<ProgressBar countdown={{ duration }} />);
    expect(container.firstChild).toHaveClass("countdown");
    expect(container.getElementsByClassName("bar")[0]).toHaveStyle("--countdown-duration: " + duration + "ms");

    rerender(<ProgressBar countdown={{ duration, paused: true }} />);
    expect(container.firstChild).toHaveClass("paused");
  });
});
