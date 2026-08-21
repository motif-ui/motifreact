import { ReactElement } from "react";
import AlertModal from "@/components/AlertModal/AlertModal";
import { fireEvent, render, screen, cleanup, act } from "@testing-library/react";
import Button from "../Button";
import MotifIcon from "@/components/Motif/Icon/MotifIcon";
import { Size3 } from "../../types";
import { userEvent } from "@testing-library/user-event";

const renderExt = (ui: ReactElement) => {
  const result = render(ui);

  const getBackdrop = () => result.getByTestId("alertModalBackdrop");

  return {
    ...result,
    getBackdrop,
  };
};

describe("AlertModal", () => {
  it("should be rendered with only required props and should have default prop values stated here", () => {
    const { container, getBackdrop } = renderExt(<AlertModal title="Alert Modal Title" open />);
    expect(container).toMatchSnapshot();

    // size: md
    expect(getBackdrop()).toHaveClass("md");
  });

  it("should render the modal when open is true", () => {
    const { rerender, queryByTestId, getBackdrop } = renderExt(<AlertModal title="Alert Modal Title" open={false} />);
    expect(queryByTestId("alertModalBackdrop")).not.toBeInTheDocument();
    rerender(<AlertModal title="Alert Modal Title" open />);
    expect(getBackdrop()).toBeInTheDocument();
  });

  it("should render the title given in the title prop", () => {
    renderExt(<AlertModal title="Alert Title" open />);
    expect(screen.getByText("Alert Title")).toBeInTheDocument();
  });

  it("should render the subtitle given in the subtitle prop", () => {
    renderExt(<AlertModal title="Alert Modal Title" open subtitle="Alert Subtitle" />);
    expect(screen.getByText("Alert Subtitle")).toBeInTheDocument();
  });

  it("should render the icon given in the icon prop", () => {
    renderExt(<AlertModal title="Alert Modal Title" open icon={<MotifIcon name="home" />} />);
    expect(screen.getByText("home")).toBeInTheDocument();
  });

  it("should call onClose when clicked outside the modal", async () => {
    const user = userEvent.setup({ delay: null });
    jest.useFakeTimers();

    const handleClose = jest.fn();
    const { getBackdrop } = renderExt(<AlertModal title="Alert Modal Title" open onClose={handleClose} />);

    await act(async () => {
      await user.click(getBackdrop());
      jest.advanceTimersByTime(300);
    });
    expect(handleClose).toHaveBeenCalled();

    jest.useRealTimers();
  });

  it("should render buttonAction and call its handler when clicked", () => {
    const handleAction = jest.fn();
    renderExt(<AlertModal title="Alert Modal Title" open buttonAction={[<Button key="1" label="Confirm" onClick={handleAction} />]} />);
    fireEvent.click(screen.getByText("Confirm"));
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it("should render multiple buttonAction buttons", () => {
    const handleConfirm = jest.fn();
    const handleCancel = jest.fn();
    renderExt(
      <AlertModal
        title="Alert Modal Title"
        open
        buttonAction={[
          <Button key="1" label="Confirm" onClick={handleConfirm} />,
          <Button key="2" label="Cancel" onClick={handleCancel} />,
        ]}
      />,
    );
    fireEvent.click(screen.getByText("Confirm"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it("should not render the actions area when buttonAction is not provided", () => {
    renderExt(<AlertModal title="Alert Modal Title" open />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should not render divider when enableDivider is false", () => {
    renderExt(<AlertModal title="Alert Modal Title" open enableDivider={false} buttonAction={[<Button key="1" label="Confirm" />]} />);
    expect(screen.queryByTestId("dividerItem")).not.toBeInTheDocument();
  });

  it("should not render divider when enableDivider is true but buttonAction is not provided", () => {
    renderExt(<AlertModal title="Alert Modal Title" open enableDivider />);
    expect(screen.queryByTestId("dividerItem")).not.toBeInTheDocument();
  });

  it("should be rendered with the given size in size prop", () => {
    const sizes: Size3[] = ["sm", "md", "lg"];
    sizes.forEach(size => {
      const { getBackdrop } = renderExt(<AlertModal title="Alert Modal Title" open size={size} />);
      expect(getBackdrop()).toHaveClass(size);
      cleanup();
    });
  });

  it("should remove the backdrop when removeBackdrop prop is true", () => {
    const { getBackdrop } = renderExt(<AlertModal title="Alert Modal Title" open removeBackdrop />);
    expect(getBackdrop()).toHaveClass("noBackdrop");
  });

  it("should render with border when bordered prop is true", () => {
    const { getBackdrop } = renderExt(<AlertModal title="Alert Modal Title" open bordered />);
    expect(getBackdrop()).toHaveClass("bordered");
  });

  it("should render as elevated when elevated prop is true", () => {
    const { getBackdrop } = renderExt(<AlertModal title="Alert Modal Title" open elevated />);
    expect(getBackdrop()).toHaveClass("elevated");
  });
});
