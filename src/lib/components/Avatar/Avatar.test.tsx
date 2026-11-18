import { render, screen } from "@testing-library/react";
import Avatar from "@/components/Avatar/Avatar";
import { runIconPropTest, runSnapshotDefaultsAndStandardPropsTest } from "../../../utils/testUtils";
import { StandardPropsWithRef, VariantV2 } from "../../../lib/types";
describe("Avatar", () => {
  runSnapshotDefaultsAndStandardPropsTest((props: StandardPropsWithRef<HTMLDivElement>) => render(<Avatar {...props} />), {
    assertDefaults: ({ container }) => {
      // variant: neutral
      expect(container.firstElementChild).toHaveClass("neutral");
      // size: md
      expect(container.firstElementChild).toHaveClass("md");
    },
  });

  it("should display the first two letters of given letters prop in upper case.", () => {
    expect(render(<Avatar letters="test" />).getByText("TE")).toBeInTheDocument();
  });

  it("should display only the first letter in the xs and sm sizes", () => {
    (["xs", "sm"] as const).forEach(size => {
      const { getByText, unmount } = render(<Avatar letters="test" size={size} />);
      expect(getByText("T")).toBeInTheDocument();
      unmount();
    });
  });

  it("should render the main icon given in the icon prop", () => {
    runIconPropTest(icon => render(<Avatar icon={icon} />));
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
    const variants: VariantV2[] = ["neutral", "primary", "secondary", "accent", "info", "success", "warning", "danger"];

    variants.forEach(variant => {
      const { container, unmount } = render(<Avatar variant={variant} />);
      expect(container.firstChild).toHaveClass(variant);
      unmount();
    });
  });
});
