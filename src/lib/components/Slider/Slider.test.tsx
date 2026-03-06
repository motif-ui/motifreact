import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Slider from "@/components/Slider/Slider";
import { InputSize } from "../Form/types";

describe("Slider", () => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

  beforeEach(() => {
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      top: 0,
      left: 0,
      bottom: 1,
      right: 100,
      width: 100,
      height: 1,
      x: 0,
      y: 0,
      toJSON: jest.fn(),
    }));
  });

  afterEach(() => {
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it("should be rendered with only required props and should have default prop values stated here", () => {
    const { container } = render(<Slider />);
    expect(container).toMatchSnapshot();

    // Default Props

    // variant: primary
    expect(container.firstChild).toHaveClass("primary");

    // size: md
    expect(container.firstChild).toHaveClass("md");

    // fill: left, start: 0, end: 100
    // combination of these 3 props results in 0% width fill at 0% left
    expect(container.firstElementChild?.getElementsByClassName("fill")[0]).toHaveStyle("width: 0%; left: 0%;");

    const slider = screen.getByRole("slider");

    // value: 0
    expect(slider).toHaveValue("0");

    // min: 0
    expect(slider).toHaveAttribute("min", "0");

    // max: 100
    expect(slider).toHaveAttribute("max", "100");

    // step
    fireEvent.change(slider, { target: { value: 0.5 } });
    expect(slider).toHaveValue("1");
  });

  it("should be rendered with different colors considering the given variant prop", () => {
    const variants = ["primary", "secondary", "success", "warning", "danger"] as const;
    variants.forEach(variant => {
      const { container, unmount } = render(<Slider variant={variant} />);
      expect(container.firstChild).toHaveClass(variant);
      unmount();
    });
  });

  it("should be rendered with the given size in size prop", () => {
    const sizes: InputSize[] = ["xs", "sm", "md", "lg"];
    const { container, rerender } = render(<Slider />);

    sizes.forEach(size => {
      rerender(<Slider size={size} />);
      expect(container.firstChild).toHaveClass(size);
    });
  });

  it("should render the current value in tooltip", async () => {
    render(<Slider value={14} />);
    await waitFor(() => expect(screen.getByText("14")).toBeInTheDocument());
  });

  it("should not render tooltip when hideTooltip prop is true", async () => {
    render(<Slider value={14} hideTooltip />);
    await waitFor(() => expect(screen.queryByText("14")).not.toBeInTheDocument());
  });

  it("should be rendered as disabled when disabled prop is given", async () => {
    const user = userEvent.setup();

    render(<Slider value={14} disabled />);
    await user.hover(screen.getByRole("slider"));
    await waitFor(() => expect(screen.getByText("14")).toBeInTheDocument());
    expect(screen.getByTestId("slider")).toHaveClass("disabled");
    expect(screen.getByRole("slider")).toBeDisabled();
    cleanup();
  });

  it("should set value with a mouse click", async () => {
    render(<Slider step={10} />);
    const slider = screen.getByRole("slider");
    fireEvent.click(screen.getByTestId("slider"), { clientX: 50 });
    await waitFor(() => expect(slider).toHaveValue("50"));
  });

  it("should fire onChange event when slider value is changed by a click on the bar", async () => {
    const onChange = jest.fn();
    const { getByTestId } = render(<Slider onChange={onChange} />);
    const sliderWrapper = getByTestId("slider");
    fireEvent.click(sliderWrapper, { clientX: 80 });
    await waitFor(() => expect(onChange).toHaveBeenCalledWith(80));
  });

  it("should allow selecting value only between min and max normalized with step value", async () => {
    render(<Slider min={34} max={69} step={10} value={118} />);
    const slider = screen.getByRole("slider");

    await waitFor(() => expect(slider).toHaveValue("64"));

    fireEvent.change(slider, { target: { value: 18 } });
    await waitFor(() => expect(slider).toHaveValue("34"));

    fireEvent.change(slider, { target: { value: 70 } });
    await waitFor(() => expect(slider).toHaveValue("64"));
  });

  it("should allow selecting value normalized with the step prop, between min and max even when start and end props are set", async () => {
    render(<Slider start={20} min={34} max={69} end={80} step={10} value={118} />);
    const slider = screen.getByRole("slider");

    await waitFor(() => expect(slider).toHaveValue("64"));

    fireEvent.change(slider, { target: { value: 18 } });
    await waitFor(() => expect(slider).toHaveValue("34"));

    fireEvent.change(slider, { target: { value: 70 } });
    await waitFor(() => expect(slider).toHaveValue("64"));
  });

  it("should not allow selecting other values when min and max values are the same", async () => {
    const maxValue = 61;
    render(<Slider min={61} max={maxValue} />);

    const slider = screen.getByRole("slider");
    expect(slider).toHaveValue("61");

    fireEvent.change(slider, { target: { value: 34 } });
    await waitFor(() => expect(slider).toHaveValue(maxValue.toString()));

    fireEvent.change(slider, { target: { value: 80 } });
    await waitFor(() => expect(slider).toHaveValue(maxValue.toString()));

    fireEvent.change(slider, { target: { value: 62 } });
    await waitFor(() => expect(slider).toHaveValue(maxValue.toString()));

    fireEvent.click(slider, { clientX: 100 });
    await waitFor(() => expect(slider).toHaveValue(maxValue.toString()));
  });

  it("should allow selecting from the min value and incrementing by step multiples", async () => {
    const minValue = 40;
    render(<Slider min={minValue} step={13} />);

    const slider = screen.getByRole("slider");
    expect(slider).toHaveValue(minValue.toString());

    fireEvent.change(slider, { target: { value: 34 } });
    await waitFor(() => expect(slider).toHaveValue(minValue.toString()));

    fireEvent.change(slider, { target: { value: 49 } });
    await waitFor(() => expect(slider).toHaveValue("53"));

    fireEvent.click(screen.getByTestId("slider"), { clientX: 100 });
    await waitFor(() => expect(slider).toHaveValue("92"));

    fireEvent.change(slider, { target: { value: 53 } });
    await waitFor(() => expect(slider).toHaveValue("53"));
  });

  it("should not allow exceeding the max value and round it to the nearest valid step below the max", async () => {
    render(<Slider min={40} max={78} step={13} />);

    const slider = screen.getByRole("slider");

    fireEvent.change(slider, { target: { value: 80 } });
    await waitFor(() => expect(slider).toHaveValue("66"));

    fireEvent.click(screen.getByTestId("slider"), { clientX: 100 });
    await waitFor(() => expect(slider).not.toHaveValue(78));
    await waitFor(() => expect(slider).toHaveValue("66"));
  });

  it("should not allow selecting a value below the min prop", async () => {
    const minValue = 40;
    render(<Slider min={minValue} />);

    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: 34 } });
    await waitFor(() => expect(slider).toHaveValue(minValue.toString()));
  });

  it("should not have long floating value for double step", async () => {
    render(<Slider min={0} max={100} value={6} step={1.2} />);

    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: 7.2 } });
    await waitFor(() => expect(slider).toHaveValue("7.2"));
    await waitFor(() => expect(slider).not.toHaveValue("7.199999999999999"));
  });

  it("should change value by moving the thumb progress bar", async () => {
    const { container } = render(<Slider />);
    const sliderContainer = container.firstElementChild!;

    const user = userEvent.setup();
    await user.click(sliderContainer);
    await user.pointer([{ keys: "[MouseLeft>]", target: sliderContainer }, { coords: { x: 30, y: 0 } }, { keys: "[/MouseLeft]" }]);
    await waitFor(() => expect(screen.getByRole("slider")).toHaveValue("30"));
  });
});
