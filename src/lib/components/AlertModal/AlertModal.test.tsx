import { ReactElement } from "react";
import AlertModal from "@/components/AlertModal/AlertModal";
import { fireEvent, render, screen, cleanup, act, within } from "@testing-library/react";
import MotifIcon from "@/components/Motif/Icon/MotifIcon";
import { Size4LG } from "../../types";
import { AlertModalProps } from "@/components/AlertModal/types";
import { userEvent } from "@testing-library/user-event";

const renderExt = (ui: ReactElement) => {
  const result = render(ui);

  const getBackdrop = () => result.getByTestId("alertModalBackdrop");
  const getModalActions = () => screen.getByTestId("alertModalActions");
  const getModalContent = () => screen.getByTestId("alertModalContent");

  return {
    ...result,
    getBackdrop,
    getModalActions,
    getModalContent,
  };
};

describe("AlertModal", () => {
  it("should be rendered with only required props and should have default prop values stated here", () => {
    const { container, getBackdrop, getModalActions } = renderExt(
      <AlertModal title="Alert Modal Title" open actionButton={{ text: "Confirm", onClick: jest.fn() }} />,
    );
    expect(container).toMatchSnapshot();

    // size: md
    expect(getBackdrop()).toHaveClass("md");
    // removeBackdrop: false (backdrop görünür)
    expect(getBackdrop()).toHaveClass("backdrop");
    // bordered: false
    expect(getBackdrop()).not.toHaveClass("bordered");
    // elevated: false
    expect(getBackdrop()).not.toHaveClass("elevated");
    // contentPosition: center
    expect(getBackdrop().querySelector(".content_center")).toBeInTheDocument();
    // buttonsPosition: center
    expect(getModalActions()).toHaveClass("actions_center");
    // enableDivider: false
    expect(getModalActions()).not.toHaveClass("withDivider");
  });

  it("should render the modal when open is true", () => {
    const { rerender, queryByTestId, getBackdrop } = renderExt(<AlertModal title="Alert Modal Title" open={false} />);
    expect(queryByTestId("alertModalBackdrop")).not.toBeInTheDocument();
    rerender(<AlertModal title="Alert Modal Title" open />);
    expect(getBackdrop()).toBeInTheDocument();
  });

  it("should render the title given in the title prop", () => {
    const { getModalContent } = renderExt(<AlertModal title="Alert Title" open />);
    expect(getModalContent()).toHaveTextContent("Alert Title");
  });

  it("should render the text given in the text prop", () => {
    const { getModalContent } = renderExt(<AlertModal title="Alert Modal Title" open text="Alert Text" />);
    expect(getModalContent()).toHaveTextContent("Alert Text");
  });

  it("should render the icon given in the icon prop", () => {
    const { getModalContent } = renderExt(<AlertModal title="Alert Modal Title" open icon={<MotifIcon name="home" />} />);
    expect(within(getModalContent()).getByText("home")).toBeInTheDocument();
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

  it("should render action button and call action handler when clicked", () => {
    const handleAction = jest.fn();
    renderExt(<AlertModal title="Alert Modal Title" open actionButton={{ text: "Confirm", onClick: handleAction }} />);
    fireEvent.click(screen.getByText("Confirm"));
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it("should call each handler when action button and alternate button are clicked", () => {
    const handleConfirm = jest.fn();
    const handleCancel = jest.fn();
    renderExt(
      <AlertModal
        title="Alert Modal Title"
        open
        actionButton={{ text: "Confirm", onClick: handleConfirm }}
        alternateButton={{ text: "Cancel", onClick: handleCancel }}
      />,
    );
    fireEvent.click(screen.getByText("Confirm"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it("should not render the actions area when neither action button nor alternate button is provided", () => {
    renderExt(<AlertModal title="Alert Modal Title" open />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should render divider when enableDivider is true and buttons are provided", () => {
    const { getModalActions } = renderExt(
      <AlertModal title="Alert Modal Title" open enableDivider actionButton={{ text: "Confirm", onClick: jest.fn() }} />,
    );
    expect(getModalActions()).toHaveClass("withDivider");
  });

  it("should not render divider when enableDivider is true but neither action button nor alternate button is provided", () => {
    renderExt(<AlertModal title="Alert Modal Title" open enableDivider />);
    expect(screen.queryByTestId("alertModalActions")).not.toBeInTheDocument();
  });

  it("should be rendered with the given size in size prop", () => {
    const sizes: Size4LG[] = ["sm", "md", "lg", "xl"];
    sizes.forEach(size => {
      const { getBackdrop } = renderExt(<AlertModal title="Alert Modal Title" open size={size} />);
      expect(getBackdrop()).toHaveClass(size);
      cleanup();
    });
  });

  it("should remove the backdrop when removeBackdrop prop is true", () => {
    const { getBackdrop } = renderExt(<AlertModal title="Alert Modal Title" open removeBackdrop />);
    expect(getBackdrop()).not.toHaveClass("backdrop");
  });

  it("should render with border when bordered prop is true", () => {
    const { getBackdrop } = renderExt(<AlertModal title="Alert Modal Title" open bordered />);
    expect(getBackdrop()).toHaveClass("bordered");
  });

  it("should render as elevated when elevated prop is true", () => {
    const { getBackdrop } = renderExt(<AlertModal title="Alert Modal Title" open elevated />);
    expect(getBackdrop()).toHaveClass("elevated");
  });

  it("should apply variant class to icon when variant is provided", () => {
    renderExt(<AlertModal title="Alert Modal Title" open variant="danger" icon={<MotifIcon name="home" />} />);
    expect(screen.getByText("home")).toHaveClass("danger");
  });

  it("should apply variant class to actionButton when variant is provided", () => {
    const { getModalActions } = renderExt(
      <AlertModal title="Alert Modal Title" open variant="danger" actionButton={{ text: "Confirm", onClick: jest.fn() }} />,
    );
    expect(getModalActions().querySelector("button")).toHaveClass("danger");
  });

  it("should render alternate button and call handler when clicked", () => {
    const handleCancel = jest.fn();
    renderExt(<AlertModal title="Alert Modal Title" open alternateButton={{ text: "Cancel", onClick: handleCancel }} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it("should apply the given contentPosition class", () => {
    const { getBackdrop } = renderExt(<AlertModal title="Alert Modal Title" open contentPosition="left" />);
    expect(getBackdrop().querySelector(".content_left")).toBeInTheDocument();
  });

  it("should apply the given buttonsPosition class to the actions area", () => {
    const positions: AlertModalProps["buttonsPosition"][] = ["left", "center", "right", "spaceBetween", "stretch", "fullWidth"];
    positions.forEach(buttonsPosition => {
      const { getModalActions } = renderExt(
        <AlertModal
          title="Alert Modal Title"
          open
          buttonsPosition={buttonsPosition}
          actionButton={{ text: "Confirm", onClick: jest.fn() }}
        />,
      );
      expect(getModalActions()).toHaveClass(`actions_${buttonsPosition}`);
      cleanup();
    });
  });
});
