import { fireEvent, render, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import SliderRange from "@/components/SliderRange/SliderRange";
import Slider from "@/components/Slider/Slider";

describe("SliderRange", () => {
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
    const { container } = render(<SliderRange />);
    expect(container).toMatchSnapshot();

    // size: md
    expect(container.firstElementChild).toHaveClass("md");

    const checkDefaultProps = (sliderItem: Element, val: string, min: string, fillStyle: string) => {
      // variant: primary
      expect(sliderItem).toHaveClass("primary");
      // size: md
      expect(sliderItem).toHaveClass("md");

      // fill, start, end
      // combination of these 3 props results in 0% width fill at 0% left
      expect(sliderItem.getElementsByClassName("fill")[0]).toHaveStyle(fillStyle);

      const slider = sliderItem.querySelector('input[type="range"]')!;

      // value
      expect(slider).toHaveValue(val);
      // min
      expect(slider).toHaveAttribute("min", min);
      // max: 100
      expect(slider).toHaveAttribute("max", "100");
      // step
      fireEvent.change(slider, { target: { value: 0.5 } });
      expect(slider).toHaveValue("1");
    };

    const slider1 = container.firstElementChild?.firstElementChild as HTMLDivElement;
    checkDefaultProps(slider1, "0", "0", "display: none;");
    const slider2 = container.firstElementChild?.lastElementChild as HTMLDivElement;
    checkDefaultProps(slider2, "100", "1", "width: 99%; left: 1%;");
  });

  it("should be rendered with different colors considering the given variant prop", () => {
    const variants = ["primary", "secondary", "success", "warning", "danger"] as const;
    variants.forEach(variant => {
      const { getAllByTestId, unmount } = render(<SliderRange variant={variant} />);
      const [slider1, slider2] = getAllByTestId("slider");
      expect(slider1).toHaveClass(variant);
      expect(slider2).toHaveClass(variant);
      unmount();
    });
  });

  it("should be rendered with the given size in size prop", () => {
    const sizes = ["xs", "sm", "md", "lg"] as const;
    sizes.forEach(size => {
      const { getAllByTestId, unmount } = render(<SliderRange size={size} />);
      const [slider1, slider2] = getAllByTestId("slider");
      expect(slider1).toHaveClass(size);
      expect(slider2).toHaveClass(size);
      unmount();
    });
  });

  it("should render tooltip with the current value for each slider", () => {
    const { getByText } = render(<SliderRange value={[14, 70]} />);

    expect(getByText("14")).toBeInTheDocument();
    expect(getByText("70")).toBeInTheDocument();
  });

  it("should not render tooltips when hideTooltip prop is true", async () => {
    const { queryByText } = render(<SliderRange value={[14, 70]} hideTooltip />);
    await waitFor(() => expect(queryByText("14")).not.toBeInTheDocument());
    await waitFor(() => expect(queryByText("70")).not.toBeInTheDocument());
  });

  it("should be rendered as disabled when disabled prop is given", () => {
    const { getAllByTestId } = render(<SliderRange value={[14, 70]} disabled />);
    const [slider1, slider2] = getAllByTestId("slider");

    expect(slider1).toHaveClass("disabled");
    expect(slider1.querySelector("input")).toBeDisabled();

    expect(slider2).toHaveClass("disabled");
    expect(slider2.querySelector("input")).toBeDisabled();
  });

  it("should change the first slider value when it is clicked on the left side of the first thumb", async () => {
    const onChange = jest.fn();
    const { container, getAllByRole } = render(<SliderRange onChange={onChange} value={[20, 60]} />);
    fireEvent.click(container.firstElementChild!, { clientX: 10 });
    await waitFor(() => {
      const [slider1, slider2] = getAllByRole("slider");
      expect(slider1).toHaveValue("10");
      expect(slider2).not.toHaveValue("10");
    });
  });

  it("should change the first slider value when it is clicked between the thumbs", async () => {
    const onChange = jest.fn();
    const { container, getAllByRole } = render(<SliderRange onChange={onChange} />);
    fireEvent.click(container.firstElementChild!, { clientX: 30 });
    await waitFor(() => {
      const [slider1, slider2] = getAllByRole("slider");
      expect(slider1).toHaveValue("30");
      expect(slider2).not.toHaveValue("30");
    });
  });

  it("should change the second slider value when it is clicked on the right side of the second thumb", async () => {
    const onChange = jest.fn();
    const { container, getAllByRole } = render(<SliderRange onChange={onChange} value={[20, 60]} />);
    fireEvent.click(container.firstElementChild!, { clientX: 70 });
    await waitFor(() => {
      const [slider1, slider2] = getAllByRole("slider");
      expect(slider2).toHaveValue("70");
      expect(slider1).not.toHaveValue("70");
    });
  });

  it("should fire onChange event when the value is changed via a click on the bar", async () => {
    const onChange = jest.fn();
    const { container } = render(<SliderRange onChange={onChange} />);
    fireEvent.click(container.firstElementChild!, { clientX: 30 });
    await waitFor(() => expect(onChange).toHaveBeenCalledWith([30, 100]));
  });

  it("should adjust the second value to the nearest valid step multiple below max when the given second value is above the max", async () => {
    const { getAllByRole } = render(<SliderRange min={40} max={62} step={7} value={[44, 80]} />);

    const secondSlider = getAllByRole("slider")[1];
    await waitFor(() => expect(secondSlider).toHaveValue("61"));

    fireEvent.change(secondSlider, { target: { value: 90 } });
    await waitFor(() => expect(secondSlider).toHaveValue("61"));
  });

  it("should adjust the first value to the min value when the given first value is below min", async () => {
    const minValue = 40;
    const { getAllByRole } = render(<SliderRange min={minValue} value={[38, 50]} />);
    const firstSlider = getAllByRole("slider")[0];

    await waitFor(() => expect(firstSlider).toHaveValue(minValue.toString()));

    fireEvent.change(firstSlider, { target: { value: 30 } });
    await waitFor(() => expect(firstSlider).toHaveValue(minValue.toString()));
  });

  it("should render min and the max values as selected when no value is given", () => {
    const minValue = 40;
    const maxValue = 60;
    const { getAllByRole } = render(<SliderRange min={minValue} max={maxValue} />);

    const [slider1, slider2] = getAllByRole("slider");
    expect(slider1).toHaveValue(minValue.toString());
    expect(slider2).toHaveValue(maxValue.toString());
  });

  it("should only allow selecting value between min-max that normalized with step value", async () => {
    const { getAllByRole } = render(<SliderRange min={40} max={62} step={7} />);

    const [slider1, slider2] = getAllByRole("slider");

    fireEvent.change(slider1, { target: { value: 33 } });
    await waitFor(() => expect(slider1).toHaveValue("40"));

    fireEvent.change(slider1, { target: { value: 47 } });
    await waitFor(() => expect(slider1).toHaveValue("47"));

    fireEvent.change(slider1, { target: { value: 45 } });
    await waitFor(() => expect(slider1).toHaveValue("47"));

    fireEvent.change(slider2, { target: { value: 54 } });
    await waitFor(() => expect(slider2).toHaveValue("54"));

    fireEvent.change(slider2, { target: { value: 55 } });
    await waitFor(() => expect(slider2).toHaveValue("54"));
  });

  it("should not allow selecting other values when min and max props are equal", async () => {
    const defaultValue = 50;
    const { getAllByRole } = render(<SliderRange min={defaultValue} max={defaultValue} value={[30, 60]} />);

    const [slider1] = getAllByRole("slider");
    expect(slider1).toHaveValue(defaultValue.toString());

    fireEvent.change(slider1, { target: { value: 34 } });
    await waitFor(() => expect(slider1).toHaveValue(defaultValue.toString()));
  });

  it("should not allow exceeding the max value and round it to the nearest valid step below the max", async () => {
    const { getAllByRole, container } = render(<SliderRange min={40} max={78} step={13} />);
    const [, slider2] = getAllByRole("slider");

    fireEvent.change(slider2, { target: { value: 80 } });
    await waitFor(() => expect(slider2).toHaveValue("66"));

    fireEvent.click(container.firstElementChild!, { clientX: 80 });
    await waitFor(() => expect(slider2).toHaveValue("66"));
  });

  it("should allow selecting from the min value and incrementing by step multiples", async () => {
    const minValue = 40;
    const { container, getAllByRole } = render(<SliderRange min={minValue} step={13} />);

    const [slider1] = getAllByRole("slider");
    expect(slider1).toHaveValue(minValue.toString());

    fireEvent.click(container.firstElementChild!, { clientX: 34 });
    await waitFor(() => expect(slider1).toHaveValue(minValue.toString()));

    fireEvent.click(container.firstElementChild!, { clientX: 49 });
    await waitFor(() => expect(slider1).toHaveValue("53"));

    fireEvent.click(container.firstElementChild!, { clientX: 75 });
    await waitFor(() => expect(slider1).toHaveValue("79"));

    fireEvent.click(container.firstElementChild!, { clientX: 53 });
    await waitFor(() => expect(slider1).toHaveValue("53"));
  });

  it("should change value by moving the thumb progress bar", async () => {
    const { container, getAllByRole } = render(<SliderRange value={[0, 70]} />);
    const [slider1, slider2] = getAllByRole("slider");
    const sliderRange = container.firstElementChild!;

    const user = userEvent.setup();
    await user.click(sliderRange);
    await user.pointer([{ keys: "[MouseLeft>]", target: sliderRange }, { coords: { x: 30, y: 0 } }, { keys: "[/MouseLeft]" }]);
    await waitFor(() => expect(slider1).toHaveValue("30"));

    await user.pointer([{ keys: "[MouseLeft>]", coords: { x: 70, y: 0 } }, { coords: { x: 90, y: 0 } }, { keys: "[/MouseLeft]" }]);
    await waitFor(() => expect(slider2).toHaveValue("90"));
  });

  it("should allow selecting value normalized with the step prop, between min and max even when start and end props are set", async () => {
    const { getAllByRole } = render(<SliderRange start={20} min={34} max={69} end={80} step={10} value={[5, 118]} />);
    const [slider1, slider2] = getAllByRole("slider");

    await waitFor(() => {
      expect(slider1).toHaveValue("34");
      expect(slider2).toHaveValue("64");
    });

    fireEvent.change(slider1, { target: { value: 18 } });
    await waitFor(() => expect(slider1).toHaveValue("34"));

    fireEvent.change(slider2, { target: { value: 70 } });
    await waitFor(() => expect(slider2).toHaveValue("64"));
  });

  it("should only have long 1 digit after the dot when step prop is a double value", async () => {
    const { getAllByRole } = render(<Slider value={6} step={1.2} />);

    const [slider1] = getAllByRole("slider");
    fireEvent.change(slider1, { target: { value: 7.2 } });
    await waitFor(() => expect(slider1).toHaveValue("7.2"));
    await waitFor(() => expect(slider1).not.toHaveValue("7.199999999999999"));
  });
});
