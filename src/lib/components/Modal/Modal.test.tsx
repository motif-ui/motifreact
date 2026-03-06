import Modal from "@/components/Modal/Modal";
import { fireEvent, render, screen, cleanup, act } from "@testing-library/react";
import Button from "../Button";
import { Size3 } from "../../types";
import Link from "../Link";
import IconButton from "../IconButton";
import { userEvent } from "@testing-library/user-event";

describe("Modal", () => {
  it("should render with only required props", () => {
    expect(render(<Modal open>Test content</Modal>).container).toMatchSnapshot();
  });

  it("should render the modal when open is true", () => {
    const { rerender } = render(<Modal open={false}>Test content</Modal>);
    expect(screen.queryByText("Test content")).not.toBeInTheDocument();
    rerender(<Modal open>Test content</Modal>);
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("should render title given in the title prop", () => {
    render(
      <Modal open title="Modal Title">
        Test content
      </Modal>,
    );
    expect(screen.getByText("Modal Title")).toBeInTheDocument();
  });
  it("should render subtitle given in the subtitle prop", () => {
    render(
      <Modal open subtitle="Modal Subtitle">
        Test content
      </Modal>,
    );
    expect(screen.getByText("Modal Subtitle")).toBeInTheDocument();
  });

  it("should render close button to close the modal when closable is true", () => {
    const handleClose = jest.fn();
    const { rerender } = render(
      <Modal open closable onClose={handleClose}>
        Test content
      </Modal>,
    );
    const closeIcon = screen.getByTestId("iconButtonTestId");
    expect(closeIcon).toBeInTheDocument();
    fireEvent.click(closeIcon);
    expect(handleClose).toHaveBeenCalledTimes(1);
    rerender(
      <Modal open closable={false} onClose={handleClose}>
        Test content
      </Modal>,
    );
    expect(screen.queryByTestId("iconButtonTestId")).not.toBeInTheDocument();
  });

  it("should close the modal when clicked outside of it when closable prop is true", async () => {
    const user = userEvent.setup({ delay: null });
    jest.useFakeTimers();

    const handleClose = jest.fn();
    const { rerender } = render(
      <Modal open closable onClose={handleClose}>
        Test content
      </Modal>,
    );

    await act(async () => {
      await user.click(screen.getByTestId("modalBackdrop"));
      jest.advanceTimersByTime(300);
    });
    expect(handleClose).toHaveBeenCalled();

    rerender(
      <Modal open closable={false} onClose={handleClose}>
        Test content
      </Modal>,
    );
    const handleClose2 = jest.fn();
    fireEvent.click(screen.getByTestId("modalBackdrop"));
    expect(handleClose2).not.toHaveBeenCalled();

    jest.useRealTimers();
  });

  it("should render action button and call action handler when clicked", () => {
    const handleAction = jest.fn();
    const { getByText } = render(
      <Modal open actionButton={{ text: "Action", onClick: handleAction }}>
        Test content
      </Modal>,
    );
    fireEvent.click(getByText("Action"));
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it("should render alternate button and call alternate handler when clicked ", () => {
    const handleAlternate = jest.fn();
    render(
      <Modal open alternateButton={{ text: "Alternate button", onClick: handleAlternate }}>
        Test content
      </Modal>,
    );
    fireEvent.click(screen.getByText("Alternate button"));
    expect(handleAlternate).toHaveBeenCalledTimes(1);
  });

  it("should render Button, Link or IconButton given in the buttons prop", () => {
    render(
      <Modal
        open
        buttons={[
          <Button key="1" label="button 1" />,
          <Link key="2" label="motif link" url="https://motif-ui.com" />,
          <IconButton key="3" name="download" />,
        ]}
      >
        Test content
      </Modal>,
    );
    expect(screen.getByText("button 1")).toBeInTheDocument();
    expect(screen.getByText("motif link")).toBeInTheDocument();
    expect(screen.getByText("download")).toBeInTheDocument();
  });

  it("should render children with the given content", () => {
    render(
      <Modal open>
        <div>Child Content</div>
      </Modal>,
    );
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });

  it("should have a default size of md", () => {
    render(<Modal open>Test content</Modal>);
    expect(screen.getByTestId("modalBackdrop")).toHaveClass("md");
  });

  it("should be rendered with the given size in size prop", () => {
    const sizes: Size3[] = ["sm", "md", "lg"];
    for (const size of sizes) {
      render(
        <Modal open size={size}>
          Test content
        </Modal>,
      );

      expect(screen.getByTestId("modalBackdrop")).toHaveClass(size);
      cleanup();
    }
  });

  it("should be rendered as maximized when maximizable prop is true", () => {
    render(
      <Modal open maximizable>
        Test content
      </Modal>,
    );

    expect(screen.getByTestId("modalBackdrop")).toHaveClass("maximized");
  });

  it("should render the content without a gap around it when noContentPadding is true", () => {
    render(
      <Modal open noContentPadding>
        Test content
      </Modal>,
    );

    expect(screen.getByTestId("modalBackdrop")).toHaveClass("noContentPadding");
  });
});
