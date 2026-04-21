import BusinessCard from "@/components/BusinessCard/BusinessCard";
import { fireEvent, render } from "@testing-library/react";
import { runIconPropTest } from "../../../utils/testUtils";

describe("BusinessCard", () => {
  it("should be rendered with only required props and should have default prop values stated here", () => {
    const { container } = render(<BusinessCard />);
    expect(container).toMatchSnapshot();

    // position: center
    expect(container.firstElementChild).toHaveClass("center");
    // variant: neutral
    expect(container.firstElementChild).toHaveClass("neutral");
  });

  it("should render given text in the title prop", () => {
    const { getByText } = render(<BusinessCard title="title" />);
    expect(getByText("title")).toBeInTheDocument();
  });

  it("should render given text in the description prop", () => {
    const { getByText } = render(<BusinessCard description="description" />);
    expect(getByText("description")).toBeInTheDocument();
  });

  it("should render the main icon given in the icon prop", () => {
    runIconPropTest(icon => render(<BusinessCard icon={icon} />), "icon");
  });

  it("should render an anchor with the props given in the link prop", () => {
    const { getByText } = render(<BusinessCard link={{ text: "my link", href: "https://motif-ui.com", targetBlank: true }} />);
    const anchor = getByText("my link");
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveAttribute("href", "https://motif-ui.com");
    expect(anchor).toHaveAttribute("target", "_blank");
  });

  it("should be clickable and fire the given callback in the onClick prop", () => {
    const onClick = jest.fn();
    const { container } = render(<BusinessCard onClick={onClick} />);
    fireEvent.click(container.firstElementChild as Element);
    expect(onClick).toHaveBeenCalled();
  });

  it("should render as elevated when elevated prop is true", () => {
    const { container } = render(<BusinessCard elevated />);
    expect(container.firstElementChild).toHaveClass("elevated");
  });

  it("should render as outlined when outline prop is true", () => {
    const { container } = render(<BusinessCard outline />);
    expect(container.firstElementChild).toHaveClass("outline");
  });

  it("should render in solid colors when solid prop is true", () => {
    const { container } = render(<BusinessCard solid />);
    expect(container.firstElementChild).toHaveClass("solid");
  });

  it("should allow applying outline, solid, elevated props at the same time with all the combinations", () => {
    const { container, rerender } = render(<BusinessCard outline solid />);
    expect(container.firstElementChild).toHaveClass("solid");
    expect(container.firstElementChild).toHaveClass("outline");
    expect(container.firstElementChild).not.toHaveClass("elevated");

    rerender(<BusinessCard outline elevated />);
    expect(container.firstElementChild).not.toHaveClass("solid");
    expect(container.firstElementChild).toHaveClass("outline");
    expect(container.firstElementChild).toHaveClass("elevated");

    rerender(<BusinessCard solid elevated />);
    expect(container.firstElementChild).toHaveClass("solid");
    expect(container.firstElementChild).not.toHaveClass("outline");
    expect(container.firstElementChild).toHaveClass("elevated");

    rerender(<BusinessCard outline solid elevated />);
    expect(container.firstElementChild).toHaveClass("solid");
    expect(container.firstElementChild).toHaveClass("outline");
    expect(container.firstElementChild).toHaveClass("elevated");
  });

  it("should render an icon button with the icon and onClick props given in the iconButton prop", () => {
    const onClick = jest.fn();
    const { getByTestId } = render(<BusinessCard iconButton={{ icon: "download", onClick }} />);
    const iconButton = getByTestId("iconButtonTestId");
    expect(iconButton).toBeInTheDocument();
    iconButton.click();
    expect(onClick).toHaveBeenCalled();
  });

  it("should render an image retrieved the uri given in the image prop", () => {
    const { getByTestId } = render(<BusinessCard image="https://picsum.photos/seed/motifui/80" />);
    const avatar = getByTestId("avatarItem");
    expect(avatar).toBeInTheDocument();
    expect(avatar.getElementsByTagName("img")[0]).toHaveAttribute("src", "https://picsum.photos/seed/motifui/80");
  });

  it("should render in the variant given in the variant  prop", () => {
    const variants = ["neutral", "primary", "secondary", "info", "success", "warning", "danger"] as const;
    variants.forEach(variant => {
      const { container } = render(<BusinessCard variant={variant} />);
      expect(container.firstElementChild).toHaveClass(variant);
    });
  });

  it("should justify the content according to the position prop", () => {
    const positions: ("left" | "center" | "right")[] = ["left", "center", "right"];
    positions.forEach(position => {
      const { container } = render(<BusinessCard position={position} />);
      expect(container.firstElementChild).toHaveClass(position);
    });
  });
});
