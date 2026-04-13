import { render, screen } from "@testing-library/react";
import Avatar from "@/components/Avatar/Avatar";

describe("Avatar", () => {
  it("should be rendered with only required props", () => {
    expect(render(<Avatar />).container).toMatchSnapshot();
  });

  it("should display the first two letters of given letters prop in upper case.", () => {
    expect(render(<Avatar letters="test" />).getByText("TE")).toBeInTheDocument();
  });

  it("should render icon when icon is set", () => {
    expect(render(<Avatar icon="info" />).getByText("info")).toBeInTheDocument();
  });

  it("should display image when image is set", () => {
    render(<Avatar image="https://picsum.photos/seed/motifui/200" />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "https://picsum.photos/seed/motifui/200");
  });

  it("should give precedence to letters prop when letters and icon are both set", () => {
    render(<Avatar letters="Test" icon="info" />);
    expect(screen.getByText("TE")).toBeInTheDocument();
    expect(screen.queryByText("info")).not.toBeInTheDocument();
  });

  it("should give precedence to image prop when image and icon are both set", () => {
    render(<Avatar image="https://picsum.photos/seed/motifui/200" icon="info" />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "https://picsum.photos/seed/motifui/200");
    expect(screen.queryByText("info")).not.toBeInTheDocument();
  });

  it("should give precedence to image when letters and image are both set", () => {
    render(<Avatar image="https://picsum.photos/seed/motifui/200" letters="Test" />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "https://picsum.photos/seed/motifui/200");
    expect(screen.queryByText("TE")).not.toBeInTheDocument();
  });

  it("should give precedence to image when image, letters and icon are all set", () => {
    render(<Avatar image="https://picsum.photos/seed/motifui/200" letters="Test" icon="info" />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "https://picsum.photos/seed/motifui/200");
    expect(screen.queryByText("TE")).not.toBeInTheDocument();
    expect(screen.queryByText("info")).not.toBeInTheDocument();
  });

  it("should be rendered with the size given in size prop", () => {
    const sizes = ["xs", "sm", "md", "lg", "xl", "xxl"] as const;
    sizes.forEach(size => {
      const { container, unmount } = render(<Avatar size={size} />);
      expect(container.firstChild).toHaveClass(size);
      unmount();
    });
  });

  it("should be rendered with different colors considering the given variant prop", () => {
    const variants = ["primary", "secondary", "info", "success", "warning", "danger"] as const;

    variants.forEach(variant => {
      const { container, unmount } = render(<Avatar variant={variant} />);
      expect(container.firstChild).toHaveClass(variant);
      unmount();
    });
  });
});
