import { render } from "@testing-library/react";
import ProgressCircle from "@/components/ProgressCircle/ProgressCircle";

describe("ProgressCircle", () => {
  it("should be rendered with only required props", () => {
    expect(render(<ProgressCircle />).container).toMatchSnapshot();
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
      expect(render(<ProgressCircle variant={variant} />).container.firstChild).toHaveClass(variant);
    });
  });

  it("should be rendered in a size given with the size prop", () => {
    const sizes: ("sm" | "md" | "lg" | "xl")[] = ["sm", "md", "lg", "xl"];
    sizes.forEach(size => {
      expect(render(<ProgressCircle size={size} />).container.firstChild).toHaveClass(size);
    });
  });

  it("should be rendered as circle", () => {
    const { container } = render(<ProgressCircle />);
    expect(container.firstElementChild?.tagName.toLocaleLowerCase()).not.toBe("div");
    expect(container.firstElementChild?.tagName.toLocaleLowerCase()).toBe("svg");
  });

  it("should render percentage info when showPercentage prop is set to true", () => {
    expect(render(<ProgressCircle progress={45} showPercentage size="lg" />).queryByText("45%")).toBeInTheDocument();
  });

  it("should fill the area same with the given progress info", () => {
    expect(render(<ProgressCircle progress={45} />).container.getElementsByClassName("circle")[0]).toHaveStyle("--percentage: 45");
  });

  it("should show percentage info and filled area in sync when percentage has changed", () => {
    const { container, rerender, queryByText } = render(<ProgressCircle progress={70} showPercentage size="lg" />);
    expect(container.getElementsByClassName("circle")[0]).toHaveStyle("--percentage: 70");
    expect(queryByText("70%")).toBeInTheDocument();

    rerender(<ProgressCircle progress={75} showPercentage size="lg" />);
    expect(container.getElementsByClassName("circle")[0]).toHaveStyle("--percentage: 75");
    expect(queryByText("75%")).toBeInTheDocument();
  });

  it("should not show percentage info when indeterminate prop is set to true regardless of the showPercentage prop value", () => {
    expect(render(<ProgressCircle progress={50} showPercentage indeterminate size="lg" />).queryByText("50%")).not.toBeInTheDocument();
  });

  it("should not show percentage info when the size is smaller than lg", () => {
    const { rerender, queryByText } = render(<ProgressCircle progress={50} showPercentage size="lg" />);
    expect(queryByText("50%")).toBeInTheDocument();
    rerender(<ProgressCircle progress={50} showPercentage size="xl" />);
    expect(queryByText("50%")).toBeInTheDocument();
    rerender(<ProgressCircle progress={50} showPercentage size="sm" />);
    expect(queryByText("50%")).not.toBeInTheDocument();
    rerender(<ProgressCircle progress={50} showPercentage size="md" />);
    expect(queryByText("50%")).not.toBeInTheDocument();
  });

  it("should apply given style and className props", () => {
    const { container } = render(<ProgressCircle className="testClass" style={{ background: "red" }} />);
    expect(container.firstChild).toHaveClass("testClass");
    expect(container.firstChild).toHaveStyle("background: red");
  });

  it("should be able to use maxProgress prop and calculate the percentage accordingly", () => {
    const progress = 50;
    const maxProgress = 250;
    const percentage = Math.floor((progress / maxProgress) * 100);

    const { container, queryByText } = render(<ProgressCircle progress={progress} maxProgress={maxProgress} showPercentage size="lg" />);
    expect(queryByText("50")).not.toBeInTheDocument();
    expect(container.getElementsByClassName("circle")[0]).not.toHaveStyle("--percentage: 50");
    expect(queryByText(percentage + "%")).toBeInTheDocument();
    expect(container.getElementsByClassName("circle")[0]).toHaveStyle("--percentage: " + percentage);
  });

  it("should reset progress to zero when given progress is a negative number", () => {
    const { container, queryByText } = render(<ProgressCircle progress={-10} size="lg" showPercentage />);
    expect(queryByText("-10")).not.toBeInTheDocument();
    expect(container.getElementsByClassName("circle")[0]).not.toHaveStyle("--percentage: -10");
    expect(queryByText("0%")).toBeInTheDocument();
    expect(container.getElementsByClassName("circle")[0]).toHaveStyle("--percentage: 0");
  });

  it("should reset progress to the maxProgress when given progress exceeds it", () => {
    const { container, queryByText } = render(<ProgressCircle progress={200} showPercentage maxProgress={150} size="lg" />);
    expect(queryByText("200")).not.toBeInTheDocument();
    expect(container.getElementsByClassName("circle")[0]).not.toHaveStyle("--percentage: 200");
    expect(queryByText("100%")).toBeInTheDocument();
    expect(container.getElementsByClassName("circle")[0]).toHaveStyle("--percentage: 100");
  });

  it("should be rendered as linear counting down when countdown prop is set", () => {
    const duration = 10000;

    const { rerender, container } = render(<ProgressCircle countdown={{ duration }} />);
    expect(container.firstChild).toHaveClass("countdown");
    expect(container.getElementsByClassName("circle")[0]).toHaveStyle("--countdown-duration: " + duration + "ms");

    rerender(<ProgressCircle countdown={{ duration, paused: true }} />);
    expect(container.firstChild).toHaveClass("paused");
  });
});
