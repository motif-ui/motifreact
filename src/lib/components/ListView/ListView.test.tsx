import { act, render } from "@testing-library/react";

import ListView from "./ListView";
import { expectToThrow } from "../../../utils/testUtils";

describe("ListView", () => {
  it("should render with only required props", () => {
    expect(
      render(
        <ListView>
          <ListView.Item title="Test Item" />
        </ListView>,
      ).container,
    ).toMatchSnapshot();
  });

  it("should render dividers when enableDividers is true", () => {
    const { container } = render(
      <ListView enableDividers>
        <ListView.Item title="Item 1" />
        <ListView.Item title="Item 2" />
        <ListView.Item title="Item 3" />
      </ListView>,
    );

    expect(container.getElementsByClassName("divider")).toHaveLength(3);
  });

  it("should disable avatar view when disableAvatars is true", () => {
    const { container } = render(
      <ListView disableAvatars>
        <ListView.Item title="Item 1" icon="folder" />
        <ListView.Item title="Item 2" abbr="test" />
        <ListView.Item title="Item 3" image="https://picsum.photos/seed/motifui/20" />
      </ListView>,
    );

    expect(container.getElementsByClassName("hasAvatar")).toHaveLength(0);
  });

  it("should enable multi line texts when enableMultiLine is true", () => {
    const { container } = render(
      <ListView enableMultiLine>
        <ListView.Item
          title="Item 1"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae fermentum arcu, vitae dignissim quam."
        />
        <ListView.Item
          title="Item 2"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae fermentum arcu, vitae dignissim quam."
        />
      </ListView>,
    );

    expect(container.getElementsByClassName("singleLine")).toHaveLength(0);
  });

  it("should make items selectable and show checkboxes to select when selectable is true", () => {
    const { queryAllByRole } = render(
      <ListView selectable>
        <ListView.Item title="Item 1" id="1" />
        <ListView.Item title="Item 2" id="2" />
      </ListView>,
    );

    expect(queryAllByRole("checkbox")).toHaveLength(2);
  });

  it("should not render icon, abbreviation or image when selectable is true", () => {
    const { queryByText, queryByRole } = render(
      <ListView selectable>
        <ListView.Item title="Item 1" icon="folder" id="1" />
        <ListView.Item title="Item 2" abbr="abbr" id="2" />
        <ListView.Item title="Item 3" image="https://picsum.photos/seed/motifui/20" id="3" />
      </ListView>,
    );

    expect(queryByText("folder")).toBeNull();
    expect(queryByRole("img")).toBeNull();
    expect(queryByText("abbr")).toBeNull();
  });

  it("should throw an error when selectable is true but id prop is not given for any list item", () => {
    expectToThrow(
      () =>
        render(
          <ListView selectable>
            <ListView.Item title="Item 1" id="1" />
            <ListView.Item title="Item 2" />
          </ListView>,
        ),
      "id is required when selectable is true",
    );
  });

  it("should fire onSelectionChange when an item is selected or deselected", () => {
    const onSelectionChange = jest.fn();
    const { queryAllByRole } = render(
      <ListView selectable onSelectionChange={onSelectionChange}>
        <ListView.Item title="Item 1" id="1" />
        <ListView.Item title="Item 2" id="2" />
      </ListView>,
    );

    const checkboxes = queryAllByRole("checkbox");
    checkboxes.forEach(checkbox => {
      act(() => checkbox.click());
      act(() => checkbox.click());
    });

    expect(onSelectionChange).toHaveBeenCalledTimes(4);
  });
});
