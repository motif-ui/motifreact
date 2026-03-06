import "@testing-library/jest-dom";
import { fireEvent, render, screen, act } from "@testing-library/react";
import { useToast } from "@/components/Toast/useToast";
import { AddToastOptions, ToastVariant } from "@/components/Toast/types";
import { useEffect } from "react";

describe("Toast", () => {
  type ToasterProps = AddToastOptions & { variant: ToastVariant; content: string };
  const Toaster = (props: ToasterProps) => {
    const toast = useToast();
    const { variant, content, ...rest } = props;

    useEffect(() => {
      toast[variant](content, rest);
      // eslint-disable-next-line
    }, []);

    return toast.toasts;
  };
  const content = "content";

  it("should render with only required props and have default prop values stated here", () => {
    jest.useFakeTimers();

    const { getByText, queryByText } = render(<Toaster content={content} variant="info" />);
    expect(getByText(content)).toBeInTheDocument();
    expect(screen.getAllByTestId("toast")[0]).toHaveClass("info");

    // default position: topRight
    expect(document.querySelector(".topRight")).toContainElement(screen.getAllByTestId("toast")[0]);
    // default closable: true
    expect(screen.getByText("close")).toBeInTheDocument();
    // default duration: 3000
    act(() => jest.advanceTimersByTime(1000));
    expect(getByText(content)).toBeInTheDocument();
    act(() => jest.advanceTimersByTime(3000));
    expect(queryByText(content)).not.toBeInTheDocument();

    jest.useRealTimers();
  });

  it("should display title when title prop is given", () => {
    render(<Toaster content={content} variant="info" />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.queryByText(content)).toBeInTheDocument();
  });

  it("should display the content given in the content prop", () => {
    const { getByText } = render(<Toaster content={content} variant="info" />);
    expect(getByText(content)).toBeInTheDocument();
  });

  it("should collapse content with three dot when maxContentLength value is exceeded", () => {
    const { getByText } = render(<Toaster content="Bu bir toast mesajıdır" maxContentLength={6} variant="info" />);
    expect(getByText("Bu bir...")).toBeInTheDocument();
  });

  it("should display the exact given content when the length of content is less than maxContentLength", () => {
    const { getByText, queryByText } = render(<Toaster content={content} maxContentLength={25} variant="info" />);
    expect(getByText(content)).toBeInTheDocument();
    expect(queryByText("...")).not.toBeInTheDocument();
  });

  it("should be closable when closable prop is true", () => {
    const { queryByText } = render(<Toaster content={content} closable={false} variant="info" />);
    expect(queryByText("close")).not.toBeInTheDocument();

    const { getByText } = render(<Toaster content={content} closable variant="info" />);
    expect(getByText("close")).toBeInTheDocument();
  });

  it("should be removed when close icon is clicked", () => {
    jest.useFakeTimers();

    const { getByText, queryByText } = render(<Toaster content={content} closable variant="info" />);
    fireEvent.click(getByText("close"));
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(queryByText(content)).not.toBeInTheDocument();

    jest.useRealTimers();
  });

  it("should display given icon by icon prop", () => {
    const { getByText } = render(<Toaster content={content} icon="home" variant="info" />);
    expect(getByText("home")).toBeInTheDocument();
  });

  it("should be rendered in the variant given in the variant prop", () => {
    const variants = ["secondary", "error", "warning", "info", "success"] as const;

    variants.forEach((variant, i) => {
      render(<Toaster content={content} variant={variant} />);
      expect(screen.getAllByTestId("toast")[i]).toHaveClass(variant === "error" ? "danger" : variant);
    });
  });

  it("should be rendered in given position by position prop", () => {
    const positions = ["topLeft", "topRight", "top", "bottomLeft", "bottomRight", "bottom"] as const;
    positions.forEach((position, i) => {
      render(<Toaster content={content} position={position} variant="info" />);
      expect(document.querySelector(`.${position}`)).toContainElement(screen.getAllByTestId("toast")[i]);
    });
  });

  it("should not be shown after given duration by duration prop", () => {
    jest.useFakeTimers();

    const { queryByText } = render(<Toaster content={content} duration={500} variant="info" />);
    act(() => {
      jest.advanceTimersByTime(800);
    });
    expect(queryByText(content)).not.toBeInTheDocument();

    jest.useRealTimers();
  });

  it("should display multiple toasts as given duration when multiple toasts triggered", () => {
    jest.useFakeTimers();

    render(<Toaster content={content} duration={2000} variant="info" />);
    render(<Toaster content={content} duration={2000} variant="info" />);
    render(<Toaster content={content} duration={2000} variant="info" />);
    expect(screen.queryAllByText(content)).toHaveLength(3);

    act(() => {
      jest.advanceTimersByTime(2300);
    });
    expect(screen.queryAllByText(content)).toHaveLength(0);

    jest.useRealTimers();
  });

  it("should pause animated progress when mouseover on the container", () => {
    jest.useFakeTimers();
    const content = "content";

    const { getByText, getByTestId } = render(<Toaster content={content} duration={500} variant="info" />);

    fireEvent.mouseEnter(getByTestId("toast"));
    expect(getByTestId("progressBar")).toHaveClass("paused");

    act(() => {
      jest.advanceTimersByTime(800);
    });
    expect(getByText(content)).toBeInTheDocument();

    fireEvent.mouseLeave(getByTestId("toast"));
    expect(getByTestId("progressBar")).not.toHaveClass("paused");

    jest.useRealTimers();
  });
});
