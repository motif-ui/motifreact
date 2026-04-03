import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataView from "@/components/DataView/DataView";

describe("DataView", () => {
  afterEach(() => cleanup());

  it("should be rendered with only required props and should have default prop values stated here", () => {
    const { container } = render(
      <DataView>
        <DataView.Item label="Test Content" />
      </DataView>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toMatchSnapshot();
    //Default value control for removeBorder prop
    expect(wrapper).toHaveClass("bordered");
    //Default value control for valueAlignment prop
    expect(wrapper).toHaveClass("leftAlign");
    //Default value control for cols prop
    expect(wrapper).toHaveClass("xs-1");
    expect(wrapper).toHaveClass("sm-1");
    expect(wrapper).toHaveClass("md-1");
    expect(wrapper).toHaveClass("lg-1");
    expect(wrapper).toHaveClass("xl-1");
    //Default value control for orientation prop
    expect(wrapper).toHaveClass("horizontal");
  });

  it("should render number of columns given in the cols and each screen size prop", () => {
    const { container } = render(
      <DataView cols={4} sm={1} md={2} lg={3} xl={4}>
        <DataView.Item label="Col Content" />
      </DataView>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("xs-4");
    expect(wrapper).toHaveClass("sm-1");
    expect(wrapper).toHaveClass("md-2");
    expect(wrapper).toHaveClass("lg-3");
    expect(wrapper).toHaveClass("xl-4");
  });

  it("should remove the borders when removeBorder is true", () => {
    const { container } = render(
      <DataView removeBorder>
        <DataView.Item label="content" />
      </DataView>,
    );
    const withoutBorder = container.firstChild as HTMLElement;
    expect(withoutBorder).not.toHaveClass("bordered");
  });

  it("should render given 'DataView.Item' as children", () => {
    const { getByText } = render(
      <DataView>
        <DataView.Item label="Name" value="Motif" />
        <DataView.Item label="Platform" value="Web, mobile" />
      </DataView>,
    );

    expect(getByText("Name")).toBeInTheDocument();
    expect(getByText("Motif")).toBeInTheDocument();
    expect(getByText("Platform")).toBeInTheDocument();
    expect(getByText("Web, mobile")).toBeInTheDocument();
  });

  it("should render DataView.Item s with the color variant given in variant prop", () => {
    const variants: ("primary" | "info" | "success" | "warning" | "danger")[] = ["primary", "info", "success", "warning", "danger"];
    variants.forEach(variant => {
      const { getByText, unmount } = render(
        <DataView>
          <DataView.Item label="Name" value="Motif" variant={variant} />
        </DataView>,
      );
      expect(getByText("Name").parentElement).toHaveClass(variant);
      unmount();
    });
  });

  it("should apply alignment based on valueAlignment prop", () => {
    const alignments: Array<"left" | "center" | "right"> = ["left", "center", "right"];

    alignments.forEach(align => {
      const { container, unmount } = render(
        <DataView valueAlignment={align}>
          <DataView.Item label="align" />
        </DataView>,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass(`${align}Align`);
      unmount();
    });
  });

  it("should apply variants given in the variant prop", () => {
    const rowVariants: Array<"stripe" | "solid"> = ["stripe", "solid"];

    rowVariants.forEach(rowVariant => {
      const { container, unmount } = render(
        <DataView rowVariant={rowVariant} cols={1}>
          <DataView.Item label={`${rowVariant}`} />
        </DataView>,
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass(rowVariant);
      unmount();
    });
  });

  it("should render in the same number of columns which is given in a column prop (cols, sm, md, lg, xl), until a greater column prop is found", () => {
    const { container } = render(
      <DataView cols={4} md={2}>
        <DataView.Item label="Col Content" />
      </DataView>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("xs-4");
    expect(wrapper).toHaveClass("sm-4");
    expect(wrapper).toHaveClass("md-2");
    expect(wrapper).toHaveClass("lg-2");
    expect(wrapper).toHaveClass("xl-2");
  });

  it("should apply orientation based on orientation prop", () => {
    const { container, rerender } = render(
      <DataView orientation="vertical">
        <DataView.Item label="label" />
      </DataView>,
    );
    expect(container.firstChild).toHaveClass("vertical");

    rerender(
      <DataView orientation="horizontal">
        <DataView.Item label="label" />
      </DataView>,
    );
    expect(container.firstChild).toHaveClass("horizontal");
  });

  it("should render icon component when icon prop is given as a component in DataView.Item", () => {
    const IconComponent = () => <span data-testid="custom-icon">icon-svg</span>;
    const { getByTestId } = render(
      <DataView>
        <DataView.Item label="Name" icon={<IconComponent />} />
      </DataView>,
    );
    expect(getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("should render the children of DataView.Item", () => {
    const { getByText } = render(
      <DataView>
        <DataView.Item label="Name">
          <strong>Motif</strong>
        </DataView.Item>
      </DataView>,
    );

    expect(getByText("Motif").tagName.toLowerCase()).toBe("strong");
  });

  it("should render only the children when children and value props are both provided in DataView.Item", () => {
    const { queryByText, getByText } = render(
      <DataView>
        <DataView.Item label="Country" value="Türkiye">
          Custom Country Content
        </DataView.Item>
      </DataView>,
    );

    expect(getByText("Custom Country Content")).toBeInTheDocument();
    expect(queryByText("Türkiye")).not.toBeInTheDocument();
  });
});
