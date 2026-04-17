import "@testing-library/jest-dom";
import Accordion from "@/components/Accordion/Accordion";
import AccordionGroup from "@/components/Accordion/AccordionGroup/AccordionGroup";
import { render, screen, fireEvent } from "@testing-library/react";

describe("AccordionGroup", () => {
  it("should be rendered with only required props", () => {
    expect(
      render(
        <AccordionGroup>
          <Accordion title="Accordion Title 1" index={0} />
          <Accordion title="Accordion Title 2" index={1} />
        </AccordionGroup>,
      ).container,
    ).toMatchSnapshot();
  });

  it("should be rendered as condensed when condensed prop is true", () => {
    const { container, rerender } = render(
      <AccordionGroup>
        <Accordion title="Accordion Title 1" index={0} />
        <Accordion title="Accordion Title 2" index={1} />
      </AccordionGroup>,
    );
    expect(container.firstChild).not.toHaveClass("group_condensed");

    rerender(
      <AccordionGroup condensed>
        <Accordion title="Accordion Title 1" index={0} />
        <Accordion title="Accordion Title 2" index={1} />
      </AccordionGroup>,
    );
    expect(container.firstChild).toHaveClass("group_condensed");
  });

  it("should be rendered as multi or single expanded form by multiExpand prop", () => {
    const { rerender } = render(
      <AccordionGroup>
        <Accordion title="Accordion Title 1" index={0} />
        <Accordion title="Accordion Title 2" index={1} />
      </AccordionGroup>,
    );
    const accordions = screen.getAllByTestId("accordionItem");
    fireEvent.click(accordions[0].firstChild!);
    fireEvent.click(accordions[1].firstChild!);
    expect(accordions[0]).not.toHaveClass("expanded");
    expect(accordions[1]).toHaveClass("expanded");
    fireEvent.click(accordions[1].firstChild!);

    rerender(
      <AccordionGroup multiExpand>
        <Accordion title="Accordion Title 1" index={0} />
        <Accordion title="Accordion Title 2" index={1} />
      </AccordionGroup>,
    );
    fireEvent.click(accordions[0].firstChild!);
    fireEvent.click(accordions[1].firstChild!);
    expect(accordions[0]).not.toHaveClass("collapsed");
    expect(accordions[1]).not.toHaveClass("collapsed");
  });

  it("should collapse expanded accordion when clicked collapsed accordion if multiExpand prop is given as false and there is an expanded accordion", () => {
    render(
      <AccordionGroup>
        <Accordion title="Accordion Title 1" index={0} />
        <Accordion title="Accordion Title 2" index={1} expanded />
      </AccordionGroup>,
    );
    const accordions = screen.getAllByTestId("accordionItem");
    fireEvent.click(accordions[0].firstChild!);
    expect(accordions[0]).toHaveClass("expanded");
    expect(accordions[1]).not.toHaveClass("expanded");
  });

  it("should remain expanded on mount when expanded prop is true inside a multiExpand=false group", () => {
    render(
      <AccordionGroup multiExpand={false}>
        <Accordion title="Accordion Title 1" index={0} expanded />
        <Accordion title="Accordion Title 2" index={1} />
        <Accordion title="Accordion Title 3" index={2} />
      </AccordionGroup>,
    );
    const accordions = screen.getAllByTestId("accordionItem");
    expect(accordions[0]).toHaveClass("expanded");
    expect(accordions[1]).not.toHaveClass("expanded");
    expect(accordions[2]).not.toHaveClass("expanded");
  });
});
