import { ReactElement } from "react";
import AlertModal from "@/components/AlertModal/AlertModal";
import { fireEvent, render, screen, cleanup, act, within } from "@testing-library/react";
import MotifIcon from "@/components/Motif/Icon/MotifIcon";
import { Size4LG, StandardPropsWithRef, Variant } from "../../types";
import { AlertModalButtonPosition, AlertModalContentPosition, IconPosition } from "@/components/AlertModal/types";
import { userEvent } from "@testing-library/user-event";
import { runSnapshotDefaultsAndStandardPropsTest } from "src/utils/testUtils";

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

const TITLE = "Alert Modal Title";

describe("AlertModal", () => {
  runSnapshotDefaultsAndStandardPropsTest(
    (props: StandardPropsWithRef<HTMLDivElement>) =>
      renderExt(
        <AlertModal
          title={TITLE}
          open
          icon={<MotifIcon name="home" />}
          actionButton={{ text: "Confirm", onClick: jest.fn() }}
          {...props}
        />,
      ),
    {
      getRoot: ({ getBackdrop }) => getBackdrop(),
      assertDefaults: ({ getBackdrop, getModalActions }) => {
        // size: md
        expect(getBackdrop()).toHaveClass("md");
        // contentPosition: center
        expect(getBackdrop()).toHaveClass("content_center");
        // buttonsPosition: center
        expect(getBackdrop()).toHaveClass("actions_center");
        //enableDivider : false
        expect(getBackdrop()).not.toHaveClass("withDivider");
        // variant default: "primary" → propagated to icon and action button
        expect(screen.getByText("home")).toHaveClass("primary");
        expect(getModalActions().querySelector("button")).toHaveClass("primary");
      },
    },
  );
  it("should render the modal when open is true", () => {
    const { rerender, queryByTestId, getBackdrop } = renderExt(<AlertModal title={TITLE} open={false} />);
    expect(queryByTestId("alertModalBackdrop")).not.toBeInTheDocument();
    rerender(<AlertModal title={TITLE} open />);
    expect(getBackdrop()).toBeInTheDocument();
  });

  it("should render the title given in the title prop", () => {
    const { getModalContent } = renderExt(<AlertModal title="Alert Title" open />);
    expect(getModalContent()).toHaveTextContent("Alert Title");
  });

  it("should render the text given in the text prop", () => {
    const { getModalContent } = renderExt(<AlertModal title={TITLE} open text="Alert Text" />);
    expect(getModalContent()).toHaveTextContent("Alert Text");
  });

  it("should render the icon given in the icon prop", () => {
    const { getModalContent } = renderExt(<AlertModal title={TITLE} open icon={<MotifIcon name="home" />} />);
    expect(within(getModalContent()).getByText("home")).toBeInTheDocument();
  });
  it("should close the modal when clicked outside of it when closable prop is true", async () => {
    const user = userEvent.setup({ delay: null });
    jest.useFakeTimers();

    const handleClose = jest.fn();
    const { getBackdrop } = renderExt(<AlertModal title={TITLE} open closable onClose={handleClose} />);

    await act(async () => {
      await user.click(getBackdrop());
      jest.advanceTimersByTime(300);
    });
    expect(handleClose).toHaveBeenCalled();

    jest.useRealTimers();
  });

  it("should not close the modal when clicked outside of it when closable prop is false", () => {
    const handleClose = jest.fn();
    const { getBackdrop } = renderExt(<AlertModal title={TITLE} open closable={false} onClose={handleClose} />);
    fireEvent.click(getBackdrop());
    expect(handleClose).not.toHaveBeenCalled();
  });

  it("should render action button and call action handler when clicked", () => {
    const handleAction = jest.fn();
    renderExt(<AlertModal title={TITLE} open actionButton={{ text: "Confirm", onClick: handleAction }} />);
    fireEvent.click(screen.getByText("Confirm"));
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it("should not render the actions area when neither action button nor alternate button is provided", () => {
    renderExt(<AlertModal title={TITLE} open />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should render divider when enableDivider is true and buttons are provided", () => {
    const { getBackdrop } = renderExt(
      <AlertModal title={TITLE} open enableDivider actionButton={{ text: "Confirm", onClick: jest.fn() }} />,
    );
    expect(getBackdrop()).toHaveClass("withDivider");
  });

  it("should not render divider when enableDivider is true but neither action button nor alternate button is provided", () => {
    renderExt(<AlertModal title={TITLE} open enableDivider />);
    expect(screen.queryByTestId("alertModalActions")).not.toBeInTheDocument();
  });

  it("should be rendered with the given size in size prop", () => {
    const sizes: Size4LG[] = ["sm", "md", "lg", "xl"];
    sizes.forEach(size => {
      const { getBackdrop } = renderExt(<AlertModal title={TITLE} open size={size} />);
      expect(getBackdrop()).toHaveClass(size);
      cleanup();
    });
  });

  it("should remove the backdrop when removeBackdrop prop is true", () => {
    const { getBackdrop } = renderExt(<AlertModal title={TITLE} open removeBackdrop />);
    expect(getBackdrop()).not.toHaveClass("backdrop");
  });

  it("should render with border when bordered prop is true", () => {
    const { getBackdrop } = renderExt(<AlertModal title={TITLE} open bordered />);
    expect(getBackdrop()).toHaveClass("bordered");
  });

  it("should render as elevated when elevated prop is true", () => {
    const { getBackdrop } = renderExt(<AlertModal title={TITLE} open elevated />);
    expect(getBackdrop()).toHaveClass("elevated");
  });

  it("should render alternate button and call handler when clicked", () => {
    const handleCancel = jest.fn();
    renderExt(<AlertModal title={TITLE} open alternateButton={{ text: "Cancel", onClick: handleCancel }} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it("should position the content given in contentPosition prop", () => {
    const contentPosition: AlertModalContentPosition[] = ["left", "center", "right"];
    contentPosition.forEach(contentPosition => {
      const { getBackdrop } = renderExt(<AlertModal title={TITLE} open contentPosition={contentPosition} />);
      expect(getBackdrop()).toHaveClass(`content_${contentPosition}`);
      cleanup();
    });
  });

  it("should position the buttons as given in buttonsPosition prop", () => {
    const positions: AlertModalButtonPosition[] = ["left", "center", "right", "spaceBetween", "stretch", "fullWidth"];
    positions.forEach(buttonsPosition => {
      const { getBackdrop } = renderExt(
        <AlertModal title={TITLE} open buttonsPosition={buttonsPosition} actionButton={{ text: "Confirm", onClick: jest.fn() }} />,
      );
      expect(getBackdrop()).toHaveClass(`actions_${buttonsPosition}`);
      cleanup();
    });
  });

  it("should render with icon when given to action and alternate buttons", () => {
    renderExt(
      <AlertModal
        title={TITLE}
        open
        actionButton={{ text: "Confirm", onClick: jest.fn(), icon: "home" }}
        alternateButton={{ text: "Cancel", onClick: jest.fn(), icon: "home" }}
      />,
    );
    expect(within(screen.getByText("Confirm").closest("button")!).getByText("home")).toBeInTheDocument();
    expect(within(screen.getByText("Cancel").closest("button")!).getByText("home")).toBeInTheDocument();
  });

  it("should position action and alternate button icons based on iconPosition", () => {
    const positions: IconPosition[] = ["left", "right"];
    positions.forEach(iconPosition => {
      renderExt(
        <AlertModal
          title={TITLE}
          open
          actionButton={{ text: "Confirm", onClick: jest.fn(), icon: "home", iconPosition }}
          alternateButton={{ text: "Cancel", onClick: jest.fn(), icon: "home", iconPosition }}
        />,
      );
      expect(screen.getByText("Confirm").closest("button")).toHaveClass(`icon-${iconPosition}`);
      expect(screen.getByText("Cancel").closest("button")).toHaveClass(`icon-${iconPosition}`);
      cleanup();
    });
  });

  it("should render with the given variant ", () => {
    const variants: Variant[] = ["primary", "secondary", "info", "success", "warning", "danger"];
    variants.forEach(variant => {
      const { getModalActions } = renderExt(
        <AlertModal
          title={TITLE}
          open
          variant={variant}
          icon={<MotifIcon name="home" />}
          actionButton={{ text: "Confirm", onClick: jest.fn() }}
        />,
      );
      expect(screen.getByText("home")).toHaveClass(variant);
      expect(getModalActions().querySelector("button")).toHaveClass(variant);
      cleanup();
    });
  });
});
