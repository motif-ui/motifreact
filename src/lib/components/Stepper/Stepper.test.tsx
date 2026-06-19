import "@testing-library/jest-dom";
import { act, cleanup, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { t } from "src/utils/testUtils";
import Stepper from "./Stepper";
import useStepper from "./hooks/useStepper";
import { StepperItemProps, StepperProps } from "@/components/Stepper/types.ts";

const NEXT = t("g.next");
const PREV = t("g.previous");
const FINISH = t("g.finish");

const renderExt = (props: StepperProps = {}, itemProps?: StepperItemProps[]) => {
  const items = itemProps?.length ? itemProps : [{ title: "Step 1" }, { title: "Step 2" }, { title: "Step 3" }];

  const renderResult = render(
    <Stepper {...props}>
      {items.map((item, i) => (
        <Stepper.Item key={i} {...item}>{`Content ${i + 1}`}</Stepper.Item>
      ))}
    </Stepper>,
  );

  const getRoot = () => renderResult.container.firstElementChild as HTMLElement;

  return {
    getRoot,
    ...renderResult,
  };
};

describe("Stepper", () => {
  it("should render with only required props and have default prop values stated here", () => {
    const { container, getRoot } = renderExt();
    expect(container).toMatchSnapshot();

    // orientation = horizontal
    expect(getRoot()).toHaveClass("horizontal");

    // stepType = number
    expect(getRoot()).toHaveClass("number");

    // itemOrientation = vertical
    expect(getRoot()).toHaveClass("vertical-items");

    // variant = primary
    expect(container.querySelector(".active")).toHaveClass("primary");
  });

  it("should render in the orientation given in orientation prop", () => {
    const { rerender, getRoot } = renderExt({ orientation: "horizontal" });
    expect(getRoot()).toHaveClass("horizontal");

    rerender(
      <Stepper orientation="vertical">
        <Stepper.Item title="Step 1">Content 1</Stepper.Item>
      </Stepper>,
    );
    expect(getRoot()).toHaveClass("vertical");
  });

  it("should the items in the orientation given in itemOrientation prop", () => {
    const { getRoot, rerender } = renderExt({ itemOrientation: "horizontal" });
    expect(getRoot()).toHaveClass("horizontal-items");

    rerender(
      <Stepper itemOrientation="vertical">
        <Stepper.Item title="Step 1">Content 1</Stepper.Item>
      </Stepper>,
    );
    expect(getRoot()).toHaveClass("vertical-items");
  });

  it("should render in the stepType given in stepType prop", () => {
    (["dot", "number", "icon", "text"] as const).forEach(stepType => {
      const { getRoot, unmount } = renderExt({ stepType });
      expect(getRoot()).toHaveClass(stepType);
      unmount();
    });
  });

  it("should render in the variant given in variant prop", () => {
    (["primary", "secondary", "success", "warning", "danger"] as const).forEach(variant => {
      const { container, unmount } = renderExt({ variant });
      expect(container.querySelector(".active")).toHaveClass(variant);
      unmount();
    });
  });

  it("should render step counter when showCount prop is true", () => {
    renderExt();
    expect(screen.queryByText("/ 3")).not.toBeInTheDocument();
    cleanup();

    renderExt({ showCount: true });
    expect(screen.getByText("/ 3")).toBeInTheDocument();
  });

  it("should render the correct initial active step using defaultActiveStep", () => {
    const { container } = renderExt({ defaultActiveStep: 1 });
    const stepItems = container.querySelectorAll(".stepItem");
    expect(stepItems[0]).toHaveClass("completed");
    expect(stepItems[1]).toHaveClass("active");
    expect(stepItems[2]).toHaveClass("upcoming");
  });

  it("should clamp defaultActiveStep to valid range", () => {
    const { container, unmount } = renderExt({ defaultActiveStep: -1 });
    expect(container.querySelectorAll(".stepItem")[0]).toHaveClass("active");
    unmount();

    const { container: highContainer } = renderExt({ defaultActiveStep: 99 });
    expect(highContainer.querySelectorAll(".stepItem")[2]).toHaveClass("active");
  });

  it("should render step content of the active step only", () => {
    renderExt();
    expect(screen.getByText("Content 1")).toBeInTheDocument();
    expect(screen.queryByText("Content 2")).not.toBeInTheDocument();
  });

  it("should call onStepChange with correct index when navigation occurs", () => {
    const onStepChange = jest.fn();
    renderExt({ onStepChange });
    fireEvent.click(screen.getByText(NEXT));
    expect(onStepChange).toHaveBeenCalledWith(1);
  });

  it("should call onNextClick when the next button is clicked", () => {
    const onNextClick = jest.fn();
    renderExt({ onNextClick });
    fireEvent.click(screen.getByText(NEXT));
    expect(onNextClick).toHaveBeenCalledTimes(1);
  });

  it("should not automatically navigate when onNextClick is provided", () => {
    renderExt({ onNextClick: jest.fn() });
    fireEvent.click(screen.getByText(NEXT));
    expect(screen.getByText("Content 1")).toBeInTheDocument();
    expect(screen.queryByText("Content 2")).not.toBeInTheDocument();
  });

  it("should call onPrevClick when the previous button is clicked", () => {
    const onPrevClick = jest.fn();
    renderExt({ defaultActiveStep: 1, onPrevClick });
    fireEvent.click(screen.getByText(PREV));
    expect(onPrevClick).toHaveBeenCalledTimes(1);
  });

  it("should not automatically navigate when onPrevClick is provided", () => {
    renderExt({ defaultActiveStep: 1, onPrevClick: jest.fn() });
    fireEvent.click(screen.getByText(PREV));
    expect(screen.getByText("Content 2")).toBeInTheDocument();
    expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
  });

  it("should call onFinishClick when the finish button is clicked on the last step", () => {
    const onFinishClick = jest.fn();
    renderExt({ defaultActiveStep: 2, onFinishClick });
    fireEvent.click(screen.getByText(FINISH));
    expect(onFinishClick).toHaveBeenCalledTimes(1);
  });

  it("should navigate to next step when the next button is clicked", () => {
    renderExt();
    expect(screen.getByText("Content 1")).toBeInTheDocument();
    fireEvent.click(screen.getByText(NEXT));
    expect(screen.getByText("Content 2")).toBeInTheDocument();
  });

  it("should navigate to previous step when the previous button is clicked", () => {
    renderExt({ defaultActiveStep: 1 });
    expect(screen.getByText("Content 2")).toBeInTheDocument();
    fireEvent.click(screen.getByText(PREV));
    expect(screen.getByText("Content 1")).toBeInTheDocument();
  });

  it("should disable previous button on first step", () => {
    renderExt();
    expect(screen.getByText(PREV).closest("button")).toBeDisabled();
  });

  it("should show the finish button instead of the next on last step", () => {
    renderExt({ defaultActiveStep: 2 });
    expect(screen.getByText(FINISH)).toBeInTheDocument();
    expect(screen.queryByText(NEXT)).not.toBeInTheDocument();
  });

  it("should use finishButtonLabel prop to override the finish button label", () => {
    renderExt({ defaultActiveStep: 2, finishButtonLabel: "Submit" });
    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.queryByText(FINISH)).not.toBeInTheDocument();
  });

  it("should show the finish button instead of the next when all remaining steps are disabled", () => {
    renderExt({}, [{ title: "Step 1" }, { title: "Step 2", disabled: true }, { title: "Step 3", disabled: true }]);
    expect(screen.getByText(FINISH)).toBeInTheDocument();
  });

  it("should skip disabled steps when navigating with the navigation buttons", () => {
    const steps = [{ title: "Step 1" }, { title: "Step 2", disabled: true }, { title: "Step 3" }];

    const { container: nextContainer } = renderExt({}, steps);
    fireEvent.click(screen.getByText(NEXT));
    expect(nextContainer.querySelectorAll(".stepItem")[2]).toHaveClass("active");

    cleanup();

    const { container: prevContainer } = renderExt({ defaultActiveStep: 2 }, steps);
    fireEvent.click(screen.getByText(PREV));
    expect(prevContainer.querySelectorAll(".stepItem")[0]).toHaveClass("active");
  });

  it("should not mark a disabled step as completed even when active step is beyond it", () => {
    const { container } = renderExt({ defaultActiveStep: 2 }, [
      { title: "Step 1" },
      { title: "Step 2", disabled: true },
      { title: "Step 3" },
    ]);
    const stepItems = container.querySelectorAll(".stepItem");
    expect(stepItems[1]).not.toHaveClass("completed");
    expect(stepItems[1]).toHaveClass("upcoming");
  });

  it("should render Stepper.Item as disabled when disabled prop is set true for the item", () => {
    const { container } = renderExt({}, [{ title: "Step 1", disabled: true }, { title: "Step 2" }]);
    expect(container.querySelectorAll(".stepItem")[0]).toHaveClass("disabled");
  });

  it("should render Stepper.Item as errored when error prop is set true for the item", () => {
    const { container } = renderExt({}, [{ title: "Step 1", error: true }, { title: "Step 2" }]);
    expect(container.querySelectorAll(".stepItem")[0]).toHaveClass("error");
  });

  it("should make completed steps clickable", () => {
    const onStepChange = jest.fn();
    const { container } = renderExt({ defaultActiveStep: 2, onStepChange });
    const firstStep = container.querySelectorAll(".stepItem")[0];
    expect(firstStep).toHaveClass("clickable");
    fireEvent.click(firstStep.querySelector(".stepHeader")!);
    expect(onStepChange).toHaveBeenCalledWith(0);
  });

  it("should not make disabled steps clickable", () => {
    const { container } = renderExt({ defaultActiveStep: 2 }, [
      { title: "Step 1" },
      { title: "Step 2", disabled: true },
      { title: "Step 3" },
    ]);
    expect(container.querySelectorAll(".stepItem")[1]).not.toHaveClass("clickable");
  });

  it("should call onStepClick when a completed step header is clicked", () => {
    const onStepClick = jest.fn();
    const { container } = renderExt({ defaultActiveStep: 2, onStepClick });
    fireEvent.click(container.querySelectorAll(".stepHeader")[0]);
    expect(onStepClick).toHaveBeenCalledWith(0);
  });

  it("should use external state from useStepper when state prop is provided", () => {
    const { result } = renderHook(() => useStepper(1));
    const { container } = render(
      <Stepper state={result.current}>
        <Stepper.Item title="Step 1">Content 1</Stepper.Item>
        <Stepper.Item title="Step 2">Content 2</Stepper.Item>
        <Stepper.Item title="Step 3">Content 3</Stepper.Item>
      </Stepper>,
    );
    const stepItems = container.querySelectorAll(".stepItem");
    expect(stepItems[1]).toHaveClass("active");
  });

  it("should update external state when navigating with state prop", () => {
    const { result } = renderHook(() => useStepper());
    render(
      <Stepper state={result.current}>
        <Stepper.Item title="Step 1">Content 1</Stepper.Item>
        <Stepper.Item title="Step 2">Content 2</Stepper.Item>
      </Stepper>,
    );
    fireEvent.click(screen.getByText(NEXT));
    expect(result.current.activeStep).toBe(1);
  });

  it("should auto-correct external state that lands on a disabled step", async () => {
    const { result } = renderHook(() => useStepper(1));
    render(
      <Stepper state={result.current}>
        <Stepper.Item title="Step 1">Content 1</Stepper.Item>
        <Stepper.Item title="Step 2" disabled>
          Content 2
        </Stepper.Item>
        <Stepper.Item title="Step 3">Content 3</Stepper.Item>
      </Stepper>,
    );
    await act(async () => {});
    expect(result.current.activeStep).toBe(2);
  });

  it("should not render navigation buttons when hideNavigation is true", () => {
    renderExt({ hideNavigation: true });
    expect(screen.queryByText(PREV)).not.toBeInTheDocument();
    expect(screen.queryByText(NEXT)).not.toBeInTheDocument();
  });
});

describe("useStepper", () => {
  it("should initialise with defaultActiveStep", () => {
    const { result } = renderHook(() => useStepper(2));
    expect(result.current.activeStep).toBe(2);
  });

  it("should clamp negative defaultActiveStep to 0", () => {
    const { result } = renderHook(() => useStepper(-5));
    expect(result.current.activeStep).toBe(0);
  });

  it("should default to step 0 when no defaultActiveStep is given", () => {
    const { result } = renderHook(() => useStepper());
    expect(result.current.activeStep).toBe(0);
  });

  it("should update activeStep when goToStep is called", () => {
    const { result } = renderHook(() => useStepper());
    act(() => result.current.goToStep(2));
    expect(result.current.activeStep).toBe(2);
  });

  it("should not go below 0 with goToStep", () => {
    const { result } = renderHook(() => useStepper());
    act(() => result.current.goToStep(-5));
    expect(result.current.activeStep).toBe(0);
  });

  it("should increment activeStep by 1 when goToNextStep is called", () => {
    const { result } = renderHook(() => useStepper());
    act(() => result.current.goToNextStep());
    expect(result.current.activeStep).toBe(1);
  });

  it("should decrement activeStep by 1 when goToPrevStep is called", () => {
    const { result } = renderHook(() => useStepper(2));
    act(() => result.current.goToPrevStep());
    expect(result.current.activeStep).toBe(1);
  });

  it("should not go below 0 with goToPrevStep", () => {
    const { result } = renderHook(() => useStepper(0));
    act(() => result.current.goToPrevStep());
    expect(result.current.activeStep).toBe(0);
  });

  it("should store step data via setStepData and retrieve it via stepData", () => {
    const { result } = renderHook(() => useStepper());
    act(() => result.current.setStepData(0, { name: "John" }));
    expect(result.current.stepData[0]).toEqual({ name: "John" });
  });

  it("should merge step data on subsequent setStepData calls for the same step", () => {
    const { result } = renderHook(() => useStepper());
    act(() => result.current.setStepData(0, { name: "John" }));
    act(() => result.current.setStepData(0, { age: 30 }));
    expect(result.current.stepData[0]).toEqual({ name: "John", age: 30 });
  });

  it("should store data independently for different step indices", () => {
    const { result } = renderHook(() => useStepper());
    act(() => result.current.setStepData(0, { name: "John" }));
    act(() => result.current.setStepData(1, { city: "Istanbul" }));
    expect(result.current.stepData[0]).toEqual({ name: "John" });
    expect(result.current.stepData[1]).toEqual({ city: "Istanbul" });
  });

  it("should initialise with empty stepData", () => {
    const { result } = renderHook(() => useStepper());
    expect(result.current.stepData).toEqual({});
  });
});
