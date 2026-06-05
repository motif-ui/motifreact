import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import Table from "@/components/Table/Table";
import { ReactNode } from "react";
import { userEvent } from "@testing-library/user-event";
import { RowColor } from "@/components/Table/types";
import { t } from "./../../../utils/testUtils";

describe("Table", () => {
  const cols = [{ title: "Test Title", dataKey: "testData", sorting: {} }];
  const data = [{ testData: "M Test" }, { testData: "A Test" }, { testData: "Z Test" }];
  const renderExt = (ui: ReactNode) => {
    const result = render(ui);
    const { getByTestId, getAllByTestId, queryByTestId, getByRole, container } = result;
    const getTableContainer = () => getByRole("table").parentElement as HTMLDivElement;
    const getFilterableTableInput = () => getByTestId("inputItem").firstElementChild as HTMLInputElement;
    const getCheckboxes = () => getAllByTestId("checkbox") as HTMLDivElement[];
    const getSelectAllCheckbox = () => getCheckboxes()[0].firstElementChild as HTMLInputElement;
    const getPaginationBar = () => queryByTestId("pagination") as HTMLDivElement;
    const getSortButton = () => container.getElementsByClassName("sortButton")[0];
    const getFirstRow = () => getTableBody().firstElementChild as HTMLTableRowElement;
    const getTableBody = () => getByTestId("TableBody") as HTMLDivElement;
    const getCountText = () => getByTestId("FooterForNumbers").firstElementChild as HTMLDivElement;

    return {
      ...result,
      getFilterableTableInput,
      getSortButton,
      getSelectAllCheckbox,
      getCheckboxes,
      getPaginationBar,
      getFirstRow,
      getCountText,
      getTableBody,
      getTableContainer,
    };
  };

  it("should render with only required props", () => {
    const { getTableContainer, container, rerender } = renderExt(<Table columns={cols} data={data} />);
    expect(container).toMatchSnapshot();
    expect(getTableContainer()).toHaveClass("cellBorders");
    expect(getTableContainer()).toHaveClass("bordered");
    rerender(<Table key="empty" columns={cols} data={[]} />);
    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("should not change selected rows when it is filtered or filtered text is removed", async () => {
    const { getFilterableTableInput, getSelectAllCheckbox } = renderExt(<Table columns={cols} data={data} filterableTable selectable />);
    const filterInput = getFilterableTableInput();
    const firstCheckbox = getSelectAllCheckbox();
    await userEvent.click(firstCheckbox);
    await userEvent.type(filterInput, data[0].testData);
    expect(firstCheckbox).toBeChecked();
    await userEvent.clear(filterInput);
    expect(firstCheckbox).toBeChecked();
  });

  it("should filter data based on partial text match", async () => {
    const { getFilterableTableInput, getFirstRow } = renderExt(<Table columns={cols} data={data} filterableTable selectable />);
    await userEvent.type(getFilterableTableInput(), data[2].testData.slice(0, 1));
    expect(within(getFirstRow()).getByText(data[2].testData)).toBeInTheDocument();
  });

  it("should show no data message when filter input does not match any row", async () => {
    const { getFilterableTableInput, getFirstRow } = renderExt(<Table columns={cols} data={data} filterableTable selectable />);
    const filterInput = getFilterableTableInput();
    await userEvent.type(filterInput, data[2].testData.slice(0, 1));
    expect(within(getFirstRow()).getByText(data[2].testData)).toBeInTheDocument();
    await userEvent.type(filterInput, data[2].testData.slice(0, 1) + "aa");
    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("should not change the sorted order of the rows when data is filtered ", async () => {
    const data = [{ testData: "M Test" }, { testData: "A Test" }, { testData: "M Test Same" }, { testData: "N Test" }];
    const { getFilterableTableInput, getSortButton, getFirstRow, getTableBody } = renderExt(
      <Table columns={cols} data={data} filterableTable />,
    );
    const filterInput = getFilterableTableInput();
    await userEvent.click(getSortButton());
    await userEvent.type(filterInput, data[0].testData);
    expect(within(getFirstRow()).getByText(data[0].testData)).toBeInTheDocument();
    expect(within(getTableBody().children[1] as HTMLTableRowElement).getByText(data[2].testData)).toBeInTheDocument();
    await userEvent.clear(filterInput);
    expect(within(getFirstRow()).getByText(data[1].testData)).toBeInTheDocument();
  });

  it("should not change the selections when the data is filtered ", async () => {
    const { getFilterableTableInput, getSelectAllCheckbox } = renderExt(<Table columns={cols} data={data} filterableTable selectable />);
    const filterInput = getFilterableTableInput();
    const firstCheckbox = getSelectAllCheckbox();
    await userEvent.click(firstCheckbox);
    await userEvent.type(filterInput, data[0].testData);
    expect(firstCheckbox).toBeChecked();
    await userEvent.clear(filterInput);
    expect(firstCheckbox).toBeChecked();
  });

  it("should return to page 1 when pagination is enabled and filtering is applied in any page", async () => {
    const data = [
      { testData: "M Test" },
      { testData: "A Test" },
      { testData: "Z Test" },
      { testData: "A Test same" },
      { testData: "M Test same" },
      { testData: "Z Test same" },
    ];
    const { getFilterableTableInput, getByText, getPaginationBar } = renderExt(
      <Table
        columns={cols}
        data={data}
        filterableTable
        pagination={{
          rowsPerPage: 2,
        }}
      />,
    );
    const paginationBar = getPaginationBar();
    await userEvent.click(within(paginationBar).getByText("2"));
    expect(within(paginationBar).getByText("2")).toHaveClass("active");
    expect(getByText(data[2].testData)).toBeInTheDocument();
    const filterInput = getFilterableTableInput();
    await userEvent.type(filterInput, "same");
    expect(within(getPaginationBar()).getByText("1")).toHaveClass("active");
  });

  it("should return to page 1 when data is sorted", async () => {
    const { getByText, getPaginationBar, getSortButton } = renderExt(
      <Table
        columns={cols}
        data={data}
        pagination={{
          rowsPerPage: 2,
        }}
      />,
    );
    const paginationBar = getPaginationBar();
    await userEvent.click(within(paginationBar).getByText("2"));
    expect(within(paginationBar).getByText("2")).toHaveClass("active");
    expect(getByText(data[2].testData)).toBeInTheDocument();
    await userEvent.click(getSortButton());
    expect(getByText(data[0].testData)).toBeInTheDocument();
    expect(within(getPaginationBar()).getByText("1")).toHaveClass("active");
  });

  it("should render the data without using reflectDataChanges prop when the data transforms to a valid value from undefined or empty, one-time", () => {
    const { rerender } = renderExt(<Table columns={cols} />);
    expect(screen.queryByText(data[0].testData)).not.toBeInTheDocument();

    rerender(<Table columns={cols} data={[]} />);
    expect(screen.queryByText(data[0].testData)).not.toBeInTheDocument();

    rerender(<Table columns={cols} data={data} />);
    expect(screen.queryByText(data[0].testData)).toBeInTheDocument();
  });

  it("should reflect the changes in the data prop to UI when reflectDataChanges is true", () => {
    const cols = [{ title: "My Title", dataKey: "myData" }];
    const { rerender } = render(<Table columns={cols} data={[{ myData: "My Data" }]} />);
    expect(screen.queryByText("My Data")).toBeInTheDocument();

    rerender(<Table columns={cols} data={[{ myData: "Data should not reflect" }]} />);
    expect(screen.queryByText("Data should not reflect")).not.toBeInTheDocument();

    rerender(<Table columns={cols} data={[{ myData: "My New Data" }]} reflectDataChanges />);
    expect(screen.queryByText("My New Data")).toBeInTheDocument();
  });

  it("should select the rows when selectable prop and the row data corresponding to the 'selectionKey' key is true", () => {
    const cols = [{ title: "My Title", dataKey: "myData" }];
    const data = [
      { myData: "Data Row 1", selected: false },
      { myData: "Data Row 2", selected: true },
    ];

    render(<Table columns={cols} data={data} selectable selectionKey="selected" />);

    const selections = screen.queryAllByTestId("checkbox");

    expect(selections[1].parentElement?.parentElement).not.toHaveClass("selected");
    expect(selections[2].parentElement?.parentElement).toHaveClass("selected");
  });

  it("should color the rows based on the function given in the rowColorCallback prop", () => {
    render(
      <Table
        columns={[{ title: "Age", dataKey: "age" }]}
        data={[{ age: 45 }, { age: 55 }, { age: 32 }]}
        rowColorCallback={rowData => (rowData.age > 40 ? "danger" : undefined)}
      />,
    );

    const numberOfRowsInDanger = screen.getAllByRole("row").filter(r => r.className.includes("danger")).length;
    expect(numberOfRowsInDanger).toBe(2);
  });

  it("should render correct row class for each RowColor variant", () => {
    const rowColors: RowColor[] = ["primary", "secondary", "light", "success", "danger", "warning", "info"];
    const { getTableBody, rerender } = renderExt(
      <Table columns={[{ title: "Age", dataKey: "age" }]} data={[{ age: 45 }]} rowColorCallback={() => "primary"} />,
    );

    rowColors.forEach(color => {
      rerender(<Table columns={[{ title: "Age", dataKey: "age" }]} data={[{ age: 45 }]} rowColorCallback={() => color} />);
      expect(getTableBody().firstElementChild).toHaveClass(color);
    });
  });

  it("should update the table when new data is provided (data1 -> data2)", () => {
    const { rerender } = render(<Table columns={cols} data={[{ testData: "Data 1" }]} reflectDataChanges />);
    expect(screen.getByText("Data 1")).toBeInTheDocument();

    rerender(<Table columns={cols} data={[{ testData: "Data 2" }]} reflectDataChanges />);
    expect(screen.queryByText("Data 1")).not.toBeInTheDocument();
    expect(screen.getByText("Data 2")).toBeInTheDocument();
  });

  it("should preserve selected rows across pages", async () => {
    const data = Array.from({ length: 10 }, (_, i) => ({ myData: `Row ${i}` }));
    const { getPaginationBar, getSelectAllCheckbox } = renderExt(
      <Table columns={cols} data={data} pagination={{ rowsPerPage: 5 }} selectable />,
    );

    await userEvent.click(getSelectAllCheckbox());
    await userEvent.click(within(getPaginationBar()).getByText("2"));
    await userEvent.click(within(getPaginationBar()).getByText("1"));

    expect(getSelectAllCheckbox()).toBeChecked();
  });

  it("should show default and custom no data message when data is empty", () => {
    const { rerender } = render(<Table columns={cols} data={[]} />);
    expect(screen.getByText("No data")).toBeInTheDocument();

    rerender(<Table columns={cols} data={[]} emptyMessage={<strong data-message="test">Custom No Data</strong>} />);
    expect(screen.getByText("Custom No Data")).toHaveAttribute("data-message", "test");
  });

  it("should show total number of data only when data is not empty", () => {
    const { rerender, getCountText } = renderExt(<Table columns={cols} data={data} />);
    expect(getCountText()).toBeInTheDocument();
    rerender(<Table columns={cols} data={[]} reflectDataChanges />);
    expect(getCountText()).not.toBeInTheDocument();
  });

  it("should update selected row count text when checkbox selection changes", async () => {
    const { getByText, getCheckboxes, getSelectAllCheckbox, getCountText } = renderExt(<Table columns={cols} data={data} selectable />);
    expect(getCountText()).toBeInTheDocument();
    await userEvent.click(getSelectAllCheckbox());
    expect(screen.getByText(t("table.totalSelectedRecords", { total: 3, selected: 3 }))).toBeInTheDocument();
    await userEvent.click(getCheckboxes()[1].firstElementChild as HTMLInputElement);
    expect(getByText(t("table.totalSelectedRecords", { total: 3, selected: 2 }))).toBeInTheDocument();
  });

  it("should render the row count section when there is data and then it is filtered to show none", async () => {
    const { getFilterableTableInput, getByText, getCountText } = renderExt(<Table columns={cols} data={data} filterableTable />);
    await userEvent.type(getFilterableTableInput(), "keywordWhichDoesNotExist");
    expect(getByText("No data")).toBeInTheDocument();
    expect(getCountText()).toBeInTheDocument();
  });

  it("should not modify the selections when page is changed", async () => {
    const { getPaginationBar, getCheckboxes, getFirstRow } = renderExt(
      <Table
        columns={cols}
        data={data}
        selectable
        filterableTable
        pagination={{
          rowsPerPage: 2,
        }}
      />,
    );
    await userEvent.click(getCheckboxes()[1].firstElementChild as HTMLInputElement);
    await userEvent.click(within(getPaginationBar()).getByText("2"));
    await userEvent.click(within(getPaginationBar()).getByText("1"));
    expect(getCheckboxes()[1].firstElementChild).toBeChecked();
    expect(within(getFirstRow()).getByText(data[0].testData)).toBeInTheDocument();
    await userEvent.click(within(getPaginationBar()).getByText("2"));
    expect(getCheckboxes()[1].firstElementChild).not.toBeChecked();
    expect(within(getFirstRow()).getByText(data[2].testData)).toBeInTheDocument();
  });

  it("should apply the borders to the elements given in the border prop", () => {
    const { getTableContainer, rerender } = renderExt(<Table columns={cols} data={data} border="cellBorders" />);
    expect(getTableContainer()).toHaveClass("cellBorders");

    rerender(<Table columns={cols} data={data} border="rowBorders" />);
    expect(getTableContainer()).toHaveClass("rowBorders");
  });

  it("should render fixed row numbers in the first column before the data, with the header of '#', regardless of the data, sorting or filtering when showFixedRowNumbers is true", async () => {
    const { getFirstRow, getSortButton, getByTestId, getFilterableTableInput } = renderExt(
      <Table columns={[{ title: "Test Title", dataKey: "testData", sorting: {}, filter: true }]} data={data} showFixedRowNumbers />,
    );
    expect(within(getByTestId("TableHead").firstElementChild as HTMLDivElement).getByText("#")).toBeInTheDocument();
    expect(within(getFirstRow()).getByText("1")).toBeInTheDocument();
    expect(within(getFirstRow()).getByText("M Test")).toBeInTheDocument();

    await userEvent.click(getSortButton());
    expect(within(getFirstRow()).getByText("1")).toBeInTheDocument();
    expect(within(getFirstRow()).getByText("A Test")).toBeInTheDocument();

    await userEvent.type(getFilterableTableInput(), "Z");
    expect(within(getFirstRow()).getByText("1")).toBeInTheDocument();
    expect(within(getFirstRow()).getByText("Z Test")).toBeInTheDocument();
  });

  it("should generate and show row numbers for each row of the data, which sticks to the row data when columns has an item with the dataKey of reserved keyword: '#'", async () => {
    const columnsForDataRowNumber = [
      { title: "Seq", dataKey: "#" },
      { title: "Test Title", dataKey: "testData", sorting: {}, filter: true },
    ];

    const { getFirstRow, getSortButton, getByTestId, getFilterableTableInput } = renderExt(
      <Table columns={columnsForDataRowNumber} data={data} />,
    );
    expect(within(getByTestId("TableHead").firstElementChild as HTMLDivElement).getByText("Seq")).toBeInTheDocument();
    expect(within(getFirstRow()).getByText("1")).toBeInTheDocument();
    expect(within(getFirstRow()).getByText("M Test")).toBeInTheDocument();

    await userEvent.click(getSortButton());
    expect(within(getFirstRow()).getByText("2")).toBeInTheDocument();
    expect(within(getFirstRow()).getByText("A Test")).toBeInTheDocument();

    await userEvent.type(getFilterableTableInput(), "Z");
    expect(within(getFirstRow()).getByText("3")).toBeInTheDocument();
    expect(within(getFirstRow()).getByText("Z Test")).toBeInTheDocument();
  });

  it("should distribute columns evenly when distributeColsEvenly prop is true", () => {
    const cols = [
      { title: "My Title", dataKey: "myData" },
      { title: "Another Title", dataKey: "anotherData" },
    ];
    const data = [{ myData: "Data 1", anotherData: "Data 2" }];
    const { getTableContainer, getFirstRow } = renderExt(<Table columns={cols} data={data} distributeColsEvenly />);
    expect(getTableContainer()).toHaveClass("distributeColsEvenly");
    const firstRowCells = within(getFirstRow()).getAllByRole("cell");
    expect(firstRowCells[0].style.width).toBe(firstRowCells[1].style.width);
  });

  it("should not show total records message when hideTotalRecords prop is true", () => {
    const { getCountText, rerender } = renderExt(<Table columns={cols} data={data} />);
    expect(getCountText()).toBeInTheDocument();
    rerender(<Table columns={cols} data={data} hideTotalRecords />);
    expect(getCountText()).not.toBeInTheDocument();
  });

  it("should show only skeleton but no data when loading prop is true", () => {
    const { getFirstRow, getByTestId } = renderExt(<Table columns={cols} data={data} loading />);
    expect(getFirstRow()).toHaveClass("loading");
    expect(getByTestId("Skeleton")).toBeInTheDocument();
  });

  it("should stripe rows when striped prop is true", () => {
    const { getTableBody } = renderExt(<Table columns={cols} data={data} striped />);
    expect(getTableBody()).toHaveClass("striped");
  });

  it("should make the rows hoverable when hoverable prop is true", () => {
    const { getTableContainer } = renderExt(<Table columns={cols} data={data} hoverable />);
    expect(getTableContainer()).toHaveClass("hoverable");
  });

  it("should show custom footer given in the footer prop", () => {
    const customFooter = <div>Custom Footer</div>;
    const { getByTestId } = renderExt(<Table columns={cols} data={data} footer={() => customFooter} />);
    expect(within(getByTestId("TableFooter")).getByText("Custom Footer")).toBeInTheDocument();
  });

  it("should render the given footer in 'solid' background type by default", () => {
    const customFooter = <div>Custom Footer</div>;
    const { getByTestId } = renderExt(<Table columns={cols} data={data} footer={() => customFooter} />);
    expect(getByTestId("TableFooter")).toHaveClass("solid");
  });

  it("should show custom header given in the header prop", () => {
    const customHeader = <div>Custom Header</div>;
    const { getTableContainer, getByTestId } = renderExt(<Table columns={cols} data={data} header={customHeader} />);
    expect(getByTestId("TableHead")).toHaveClass("solid");
    expect(within(getTableContainer()).getByText("Custom Header")).toBeInTheDocument();
  });

  it("should render the given header in 'solid' background type by default", () => {
    const customHeader = <div>Custom Header</div>;
    const { getByTestId } = renderExt(<Table columns={cols} data={data} header={customHeader} />);
    expect(getByTestId("TableHead")).toHaveClass("solid");
  });

  it("should render title when title prop is provided", () => {
    const { getByText } = renderExt(<Table columns={cols} data={data} title="Table Title" />);
    const titleElement = getByText("Table Title");
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.parentElement).toHaveClass("titleSection");
  });

  it("should render subtitle when subtitle prop is provided", () => {
    const { getByText } = renderExt(<Table columns={cols} data={data} subtitle="Table Subtitle" />);
    const subtitleElement = getByText("Table Subtitle");
    expect(subtitleElement).toBeInTheDocument();
    expect(subtitleElement.parentElement).toHaveClass("titleSection");
  });

  it("should fire onSelect callback when a row is selected", async () => {
    const onSelect = jest.fn();
    const { getSelectAllCheckbox } = renderExt(<Table columns={cols} data={data} selectable onSelect={onSelect} />);
    await userEvent.click(getSelectAllCheckbox());
    expect(onSelect).toHaveBeenCalledTimes(1);
    await userEvent.click(getSelectAllCheckbox());
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it("should allow applying a custom sort function given in the sorting prop", async () => {
    const data = [{ name: "Mehmet" }, { name: "Salih" }, { name: "Necmi" }, { name: "Zehranur" }];
    const { getFirstRow, getSortButton } = renderExt(
      <Table
        data={data}
        columns={[
          {
            title: "Name",
            dataKey: "name",
            sorting: {
              customSort: (a, b) => (typeof a === "string" && typeof b === "string" ? a.at(-1)!.localeCompare(b.at(-1)!) : 0),
            },
          },
        ]}
      />,
    );
    expect(within(getFirstRow()).getByText(data[0].name)).toBeInTheDocument();
    await userEvent.click(getSortButton());
    expect(within(getFirstRow()).getByText(data[1].name)).toBeInTheDocument();
  });

  it("should render custom cell content given in the render prop", () => {
    const data = [{ name: "Name 1" }, { name: "Name 2" }];
    const { getFirstRow } = renderExt(
      <Table
        columns={[
          {
            title: "Name",
            dataKey: "name",
            render: text => <button>{(text as string) + " test"}</button>,
          },
        ]}
        data={data}
      />,
    );
    const firstRowCells = within(getFirstRow()).getAllByRole("cell");
    expect(within(firstRowCells[0]).getByRole("button")).toHaveTextContent(`Name 1 test`);
  });

  it("should apply correct variants for all headerColsBackground values", () => {
    const backgroundVariants = ["opposite", "transparent", "solid"] as const;
    const { getByTestId, rerender } = renderExt(<Table columns={cols} data={data} />);

    backgroundVariants.forEach(variant => {
      rerender(<Table columns={cols} data={data} headerColsBackground={variant} />);
      expect(getByTestId("TableHead")).toHaveClass(variant);
    });
  });

  it("should apply correct variants for all footerColsBackground values", () => {
    const backgroundVariants = ["opposite", "transparent", "solid"] as const;
    const { getByTestId, rerender } = renderExt(<Table columns={cols} data={data} />);

    backgroundVariants.forEach(variant => {
      rerender(<Table columns={cols} data={data} footerColsBackground={variant} />);
      expect(getByTestId("TableFooter")).toHaveClass(variant);
    });
  });

  it("should render footer values correctly for sum, avg and custom render types", () => {
    const data = [
      { name: "Name 1", surname: "Surname 1", age: 30, city: "Istanbul", price: 100 },
      { name: "Name 2", surname: "Surname 2", age: 30, city: "Ankara", price: 200 },
    ];

    const { getByText } = renderExt(
      <Table
        data={data}
        columns={[
          {
            title: "Name",
            dataKey: "name",
            footer: { render: () => "Custom Footer" },
          },
          { title: "Surname", dataKey: "surname" },
          {
            title: "Age",
            dataKey: "age",
            footer: {
              type: "avg",
              title: "Average Age",
              render: avg => <button>🔢 {avg as string}</button>,
            },
          },
          { title: "City", dataKey: "city" },
          {
            title: "Price",
            dataKey: "price",
            footer: {
              type: "sum",
              title: "Total Price",
            },
          },
        ]}
      />,
    );
    expect(getByText("Custom Footer")).toBeInTheDocument();
    const avg = ((30 + 30) / 2).toFixed(2);
    expect(getByText(`🔢 ${avg}`)).toBeInTheDocument();
    const sum = 100 + 200;
    expect(getByText(sum.toString())).toBeInTheDocument();
    expect(getByText("Average Age")).toBeInTheDocument();
    expect(getByText("Total Price")).toBeInTheDocument();
  });

  it("should only filter string-searchable data (primitive values or text from render output)", async () => {
    const data = [
      { searchable: "Visible String", nonSearchable: { nested: "Hidden Value" } },
      { searchable: "Another String", nonSearchable: { nested: "Another Hidden" } },
    ];

    const columns = [
      { title: "Searchable", dataKey: "searchable" },
      {
        title: "Non-Searchable",
        dataKey: "nonSearchable",
        render: (val: { nested: string }) => <span>{val.nested}</span>,
      },
    ];

    const { getFilterableTableInput, queryByText } = renderExt(<Table columns={columns} data={data} filterableTable />);
    const filterInput = getFilterableTableInput();

    await userEvent.type(filterInput, "Another");
    expect(queryByText("Another String")).toBeInTheDocument();
    expect(queryByText("Another Hidden")).toBeInTheDocument();

    await userEvent.clear(filterInput);
    await userEvent.type(filterInput, "Hidden Value");
    expect(queryByText("Hidden Value")).toBeInTheDocument();

    await userEvent.clear(filterInput);
    await userEvent.type(filterInput, "keywordWhichDoesNotExist");
    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("should filter data based on primitive string values in the corresponding data[dataKey]", async () => {
    const data = [
      { searchable: "Visible String", nonSearchable: { nested: "Hidden Value" } },
      { searchable: "Another String", nonSearchable: { nested: "Another Hidden" } },
    ];

    const columns = [
      { title: "Searchable", dataKey: "searchable" },
      {
        title: "Non-Searchable",
        dataKey: "nonSearchable",
        render: (val: { nested: string }) => <span>{val.nested}</span>,
      },
    ];
    const { getFilterableTableInput, queryByText } = renderExt(<Table columns={columns} data={data} filterableTable />);
    await userEvent.type(getFilterableTableInput(), "Another");
    expect(queryByText("Another String")).toBeInTheDocument();
    expect(queryByText("Visible String")).not.toBeInTheDocument();
  });

  it("should filter data based on rendered output when custom render function is provided", async () => {
    const data = [
      { searchable: "Visible String", nonSearchable: { nested: "Hidden Value" } },
      { searchable: "Another String", nonSearchable: { nested: "Another Hidden" } },
    ];

    const columns = [
      { title: "Searchable", dataKey: "searchable" },
      {
        title: "Non-Searchable",
        dataKey: "nonSearchable",
        render: (val: { nested: string }) => <span>{val.nested}</span>,
      },
    ];
    const { getFilterableTableInput, queryByText } = renderExt(<Table columns={columns} data={data} filterableTable />);
    await userEvent.type(getFilterableTableInput(), "Hidden Value");
    expect(queryByText("Hidden Value")).toBeInTheDocument();
    expect(queryByText("Another Hidden")).not.toBeInTheDocument();
  });

  it("should render pagination bar in the position given in 'pagination.position' prop", () => {
    const positions = ["left", "center", "right"] as const;
    const { getByTestId, rerender } = renderExt(<Table columns={cols} data={data} pagination={{ rowsPerPage: 2 }} />);
    positions.forEach(position => {
      rerender(<Table columns={cols} data={data} pagination={{ rowsPerPage: 2, position }} />);
      expect(getByTestId("FooterForNumbers")).toHaveClass(`hasPagination-${position}`);
    });
  });

  it("should divide table correctly for rowsPerPage prop", async () => {
    const data = [{ testData: "Row 1" }, { testData: "Row 2" }, { testData: "Row 3" }, { testData: "Row 4" }, { testData: "Row 5" }];
    const { getPaginationBar, getTableBody, getByText } = renderExt(<Table columns={cols} data={data} pagination={{ rowsPerPage: 2 }} />);
    const tableBody = getTableBody();
    const paginationBar = getPaginationBar();

    expect(tableBody.querySelectorAll("tr").length).toBe(2);
    expect(getByText("Row 1")).toBeInTheDocument();
    expect(getByText("Row 2")).toBeInTheDocument();

    await userEvent.click(within(paginationBar).getByText("2"));
    expect(tableBody.querySelectorAll("tr").length).toBe(2);
    expect(getByText("Row 3")).toBeInTheDocument();
    expect(getByText("Row 4")).toBeInTheDocument();

    await userEvent.click(within(paginationBar).getByText("3"));
    expect(tableBody.querySelectorAll("tr").length).toBe(1);
    expect(getByText("Row 5")).toBeInTheDocument();
  });

  it("should display cell value if column dataKey matches data key", () => {
    const matchingData = [{ name: "Test" }];
    const column = [{ title: "Name", dataKey: "name" }];
    const { getTableBody, queryByText } = renderExt(<Table columns={column} data={matchingData} />);

    expect(getTableBody()).toBeInTheDocument();
    expect(queryByText("Test")).toBeInTheDocument();
  });

  it("should display cell empty if column dataKey does not matches data key", () => {
    const nonMatchingData = [{ wrongKey: "Should Not Appear" }];
    const column = [{ title: "Name", dataKey: "name" }];

    const { getTableBody, queryByText } = renderExt(<Table columns={column} data={nonMatchingData} />);

    expect(getTableBody()).toBeInTheDocument();
    expect(queryByText("Should Not Appear")).not.toBeInTheDocument();
  });

  it("should show total records count when data is provided", () => {
    const { getCountText } = renderExt(<Table columns={cols} data={data} />);
    expect(getCountText()).toHaveTextContent(t("table.totalRecords", { total: 3 }));
  });

  it("should not change total records count when data is filtered", async () => {
    const { getFilterableTableInput, getCountText } = renderExt(<Table columns={cols} data={data} filterableTable />);
    expect(getCountText()).toHaveTextContent(t("table.totalRecords", { total: 3 }));
    await userEvent.type(getFilterableTableInput(), "M Test");
    expect(getCountText()).toHaveTextContent(t("table.totalRecords", { total: 3 }));
  });

  it("should sort the rows in ascending order when the related header cell is clicked once", async () => {
    const { getSortButton, getTableBody } = renderExt(<Table columns={cols} data={data} />);
    const ascendingSortedData = [...data].sort((a, b) => a.testData.localeCompare(b.testData));
    await userEvent.click(getSortButton());
    const tableRows = getTableBody().children;
    ascendingSortedData.forEach((rowData, index) => {
      expect(within(tableRows[index] as HTMLTableRowElement).getByText(rowData.testData)).toBeInTheDocument();
    });
  });

  it("should sort the rows in descending order when the related header cell is clicked twice", async () => {
    const { getSortButton, getTableBody } = renderExt(<Table columns={cols} data={data} />);
    const descendingSortedData = [...data].sort((a, b) => b.testData.localeCompare(a.testData));
    await userEvent.click(getSortButton());
    await userEvent.click(getSortButton());
    const tableRows = getTableBody().children;
    descendingSortedData.forEach((rowData, index) => {
      expect(within(tableRows[index] as HTMLTableRowElement).getByText(rowData.testData)).toBeInTheDocument();
    });
  });

  it("should reset to original order when the related header cell is clicked three times", async () => {
    const { getSortButton, getTableBody } = renderExt(<Table columns={cols} data={data} />);
    await userEvent.click(getSortButton());
    await userEvent.click(getSortButton());
    await userEvent.click(getSortButton());
    const tableRows = getTableBody().children;
    data.forEach((rowData, index) => {
      expect(within(tableRows[index] as HTMLTableRowElement).getByText(rowData.testData)).toBeInTheDocument();
    });
  });

  it("should fill all the space horizontally when fluid prop is true", () => {
    const { getTableContainer, rerender } = renderExt(<Table columns={cols} data={data} fluid />);
    expect(getTableContainer()).toHaveClass("fluid");
    rerender(<Table columns={cols} data={data} />);
    expect(getTableContainer()).not.toHaveClass("fluid");
  });
});
