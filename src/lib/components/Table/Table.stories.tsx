import type { Meta, StoryObj } from "@storybook/nextjs";

import Table from "./Table";
import { generateMockTableData } from "../../../docs/data/table";
import Button from "@/components/Button";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  argTypes: {
    headerColsBackground: { table: { defaultValue: { summary: "medium" } } },
    footerColsBackground: { table: { defaultValue: { summary: "medium" } } },
  },
  args: {
    columns: [
      { title: "Name", dataKey: "name" },
      { title: "Surname", dataKey: "surname" },
      { title: "Age", dataKey: "age" },
      { title: "City", dataKey: "address.city" },
    ],
    data: generateMockTableData(6),
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

type RowData = { name: string; surname: string };

export const Primary: Story = {};

export const BasicUse: Story = {
  render: args => (
    <Table
      {...args}
      columns={[
        { title: "Name", dataKey: "name" },
        { title: "Surname", dataKey: "surname" },
      ]}
      data={[
        { name: "Name 1", surname: "Surname 1" },
        { name: "Name 2", surname: "Surname 2" },
      ]}
    />
  ),
};

export const CustomRender: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
  <Table
  data={data}
  columns={[
    { title: "Name", dataKey: "name", render: text => <button>{text}</button> },
    { title: "Surname",
      render: row => (
        <a href={"https://www.google.com/?q=" + row.surname} target="_blank">
          {row.surname}
        </a>
      )
    }
  ]}
/>
        `,
      },
    },
  },
  render: () => (
    <Table
      columns={[
        { title: "Name", dataKey: "name", render: text => <button>{text as string}</button> },
        {
          title: "Surname",
          render: row => (
            <a href={"https://www.google.com/?q=" + (row as RowData).surname} target="_blank" rel="noreferrer">
              {(row as RowData).surname}
            </a>
          ),
        },
      ]}
      data={[
        { name: "Name 1", surname: "Surname 1" },
        { name: "Name 2", surname: "Surname 2" },
      ]}
    />
  ),
};

export const Sorting: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
  <Table
  data={data}
  columns={[
    { title: "Name", dataKey: "name", sorting: {} },
    { title: "Surname", dataKey: "surname" }
  ]} />
        `,
      },
    },
  },
  render: () => (
    <Table
      data={[
        { name: "Name 2", surname: "Surname 2" },
        { name: "Name 3", surname: "Surname 3" },
        { name: "Name 1", surname: "Surname 1" },
      ]}
      columns={[
        { title: "Name", dataKey: "name", sorting: {} },
        { title: "Surname", dataKey: "surname" },
      ]}
    />
  ),
};

export const SortingCustom: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
  <Table
  data={data}
  columns={[
    { title: "Name", dataKey: "name", sorting: {
        customSort: (a, b) => (typeof a === "string" && typeof b === "string" ? a.at(-1)!.localeCompare(b.at(-1)!) : 0)
      }
    },
    { title: "Surname", dataKey: "surname" }
  ]}
  />
        `,
      },
    },
  },
  render: () => (
    <Table
      data={[
        { name: "Mehmet", surname: "Aktas" },
        { name: "Salih", surname: "Akdas" },
        { name: "Necmi", surname: "Sengul" },
        { name: "Zehranur", surname: "Caliskan" },
      ]}
      columns={[
        {
          title: "Name",
          dataKey: "name",
          sorting: { customSort: (a, b) => (typeof a === "string" && typeof b === "string" ? a.at(-1)!.localeCompare(b.at(-1)!) : 0) },
        },
        { title: "Surname", dataKey: "surname" },
      ]}
    />
  ),
};

export const Header: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
  <Table
  data={data}
  columns={columns}
  header="My Simple Table Header" />
  
  <Table
    data={data}
    columns={columns}
    header={
      <div style={{ background: "#2d2d2d", padding: 20, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontWeight: "bold", color: "#FFF", flex: 1 }}>My Custom Table Header</span>
        <Button label="Export" size="xs" icon="upload" />
        <Button label="Send Email" size="xs" icon="mail" variant="secondary" />
      </div>
    }
  />
        `,
      },
    },
  },
  render: () => (
    <>
      <Table
        data={[
          { name: "Name 2", surname: "Surname 2" },
          { name: "Name 3", surname: "Surname 3" },
          { name: "Name 1", surname: "Surname 1" },
        ]}
        columns={[
          { title: "Name", dataKey: "name" },
          { title: "Surname", dataKey: "surname" },
        ]}
        header="My Simple Table Header"
      />
      <br />
      <br />
      <Table
        data={[
          { name: "Name 2", surname: "Surname 2" },
          { name: "Name 3", surname: "Surname 3" },
          { name: "Name 1", surname: "Surname 1" },
        ]}
        columns={[
          { title: "Name", dataKey: "name" },
          { title: "Surname", dataKey: "surname" },
        ]}
        header={
          <div style={{ background: "#2d2d2d", padding: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: "bold", color: "#FFF", flex: 1 }}>My Custom Table Header</span>
            <Button label="Export" size="xs" icon="upload" />
            <Button label="Send Email" size="xs" icon="mail" variant="secondary" />
          </div>
        }
      />
    </>
  ),
};
export const TitleAndSubtitle: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
  <Table
  title="Table Title"
  subtitle="Table Subtitle"
  data={data}
  columns={columns}
 />
  

        `,
      },
    },
  },
  render: () => (
    <>
      <Table
        title="Table Title"
        subtitle="Table Subtitle"
        data={[
          { name: "Name 2", surname: "Surname 2" },
          { name: "Name 3", surname: "Surname 3" },
          { name: "Name 1", surname: "Surname 1" },
        ]}
        columns={[
          { title: "Name", dataKey: "name" },
          { title: "Surname", dataKey: "surname" },
        ]}
      />
    </>
  ),
};

export const Footer: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
  <Table
  data={data}
  columns={columns}
  footer={() => (
    <div
      style={{
        borderTop: "double 3px #AAA",
        background: "#f9f9f9",
        marginTop: 10,
        padding: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
        gap: 10
      }}
    >
      <span>There are total {data.length} records.</span>
      <Button size="sm" label="Report Wrong Data" icon="folder" variant="warning" />
    </div>
  )}
/>
        `,
      },
    },
  },
  render: () => {
    const data = [
      { name: "Name 1", surname: "Surname 1" },
      { name: "Name 2", surname: "Surname 2" },
    ];
    const columns = [
      { title: "Name", dataKey: "name" },
      { title: "Surname", dataKey: "surname" },
    ];
    return (
      <Table
        data={data}
        columns={columns}
        footer={() => (
          <div
            style={{
              borderTop: "double 3px #AAA",
              background: "#f9f9f9",
              marginTop: 10,
              padding: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              gap: 10,
            }}
          >
            <span>There are total {data.length} records.</span>
            <Button size="sm" label="Report Wrong Data" icon="folder" variant="warning" />
          </div>
        )}
      />
    );
  },
};

export const FooterForColumns: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `<Table
    data={data}
    columns={[
      { title: "Name", dataKey: "name", footer: { render: () => "Custom Footer" } },
      { title: "Surname", dataKey: "surname" },
      { title: "Age", dataKey: "age", footer: {
        type: "avg",
        title: "Average Age",
        render: avg => <button onClick={() => alert(avg)}>🔢 {avg as string}</button>
      }},
      { title: "City", dataKey: "city" },
      { title: "Price", dataKey: "price", footer: {
        type: "sum",
        title: "Total Price"
      }}
    ]}
  />`,
      },
    },
  },
  render: () => {
    const data = [
      { name: "Name 1", surname: "Surname 1", age: 25, city: "Istanbul", price: 100 },
      { name: "Name 2", surname: "Surname 2", age: 30, city: "Ankara", price: 200 },
    ];

    return (
      <Table
        data={data}
        columns={[
          { title: "Name", dataKey: "name", footer: { render: () => "Custom Footer" } },
          { title: "Surname", dataKey: "surname" },
          {
            title: "Age",
            dataKey: "age",
            footer: {
              type: "avg",
              title: "Average Age",
              render: avg => <button onClick={() => alert(avg)}>🔢 {avg as string}</button>,
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
      />
    );
  },
};

export const Filtering: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
  <Table
  data={data}
  columns={columns}
  filterableTable
/>
        `,
      },
    },
  },
  render: () => {
    const data = [
      { name: "Dummy", age: "32" },
      { name: "Foo", age: "43" },
      { name: "Foo Bar", age: "54" },
      { name: "Dummy Foo Bar", age: "35" },
    ];
    const columns = [
      { title: "Full Name", dataKey: "name", filter: true },
      { title: "Age", dataKey: "age", filter: true },
    ];
    return <Table data={data} columns={columns} filterableTable />;
  },
};

export const Selection: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
  <Table
  data={data}
  columns={columns}
  selectable
  selectionKey="selected"
  onSelect={selection => alert(JSON.stringify(selection))}
/>
        `,
      },
    },
  },
  render: () => {
    const data = [
      { name: "Foo", age: "43" },
      { name: "Dummy", age: "32", selected: true },
    ];
    const columns = [
      { title: "Name", dataKey: "name", sorting: {} },
      { title: "Age", dataKey: "age", sorting: {} },
    ];
    return (
      <Table data={data} columns={columns} selectable selectionKey="selected" onSelect={selection => alert(JSON.stringify(selection))} />
    );
  },
};

export const Pagination: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
  <Table
  data={data}
  columns={columns}
  pagination={{ rowsPerPage: 2, position: "right" }}
/>
        `,
      },
    },
  },
  render: () => {
    const data = [
      { name: "Foo", age: "43" },
      { name: "Dummy", age: "32" },
      { name: "Foo 2", age: "23" },
      { name: "Dummy 2", age: "44" },
      { name: "Foo 3", age: "25" },
    ];
    const columns = [
      { title: "Name", dataKey: "name", sorting: {} },
      { title: "Age", dataKey: "age", sorting: {} },
    ];
    return (
      <div style={{ width: 600 }}>
        <Table data={data} columns={columns} pagination={{ rowsPerPage: 2, position: "right" }} />
      </div>
    );
  },
};

export const RowNumbers: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
  <Table
  header="Fixed Row Numbers"
  data={data}
  columns={columns}
  showFixedRowNumbers
/>
<br />
<Table
  header="Dynamic Row Numbers"
  data={data}
  columns={[
    { title: "Seq", dataKey: "#" },
    { title: "Name", dataKey: "name", sorting: {} },
    { title: "Age", dataKey: "age", sorting: {} }
  ]}
/>
        `,
      },
    },
  },
  render: () => {
    const data = [
      { name: "Foo", age: "43" },
      { name: "Dummy", age: "32" },
    ];
    const columns = [
      { title: "Seq", dataKey: "#" },
      { title: "Name", dataKey: "name", sorting: {} },
      { title: "Age", dataKey: "age", sorting: {} },
    ];
    return <Table data={data} columns={columns} />;
  },
};

export const RowColoring: Story = {
  parameters: {
    docs: {
      source: {
        type: "code",
        code: `
  <Table
  data={data}
  columns={columns}
  rowColorCallback={rowData => (rowData.age > 80 ? "danger" : rowData.age < 30 ? "success" : undefined)}
/>
        `,
      },
    },
  },
  render: () => {
    const data = [
      { name: "Middle aged guy", age: 45 },
      { name: "Old man", age: 81 },
      { name: "Young woman", age: 28 },
      { name: "Retired guy", age: 62 },
    ];
    const columns = [
      { title: "Name", dataKey: "name" },
      { title: "Age", dataKey: "age" },
    ];
    return (
      <Table
        data={data}
        columns={columns}
        rowColorCallback={rowData => (rowData.age > 80 ? "danger" : rowData.age < 30 ? "success" : undefined)}
      />
    );
  },
};

export const Colspan: Story = {
  render: () => {
    type RowData = { fullName: string; age: number; city: string; merged: boolean };
    const data: RowData[] = [
      { fullName: "John Doe", age: 28, city: "New York", merged: true },
      { fullName: "Jane Smith", age: 34, city: "Los Angeles", merged: true },
      { fullName: "Alice Johnson", age: 29, city: "Chicago", merged: false },
      { fullName: "Bob Williams", age: 42, city: "Houston", merged: false },
    ];
    const columns = [
      {
        title: "Personal Info",
        dataKey: "fullName",
        colSpan: (row: unknown) => ((row as RowData).merged ? 2 : 1),
      },
      {
        title: "Age",
        dataKey: "age",
      },
      {
        title: "City",
        dataKey: "city",
      },
    ];
    return <Table data={data} columns={columns} border="cellBorders" />;
  },
};

export const Rowspan: Story = {
  render: () => {
    type RowData = { name: string; surname: string; age: number };
    const data = [
      { name: "Name 1", surname: "Surname 1", age: 25 },
      { name: "Name 1", surname: "Surname 2", age: 30 },
      { name: "Name 2", surname: "Surname 3", age: 22 },
      { name: "Name 2", surname: "Surname 4", age: 28 },
    ];
    const columns = [
      {
        title: "Name",
        dataKey: "name",
        rowSpan: (row: object) => {
          const rowData = row as RowData;
          return rowData.surname === "Surname 1" || rowData.surname === "Surname 3" ? 2 : 1;
        },
      },
      { title: "Surname", dataKey: "surname" },
      { title: "Age", dataKey: "age" },
    ];
    return <Table data={data} columns={columns} border="cellBorders" />;
  },
};

export const RowspanStriped: Story = {
  render: () => {
    type MaintenanceRow = {
      span: number;
      equipment: string;
      location: string;
      servicedAt: string;
      finding: string;
      action: string;
      owner: string;
      dueDate: string;
      status: string;
    };

    const group = (
      span: number,
      equipment: string,
      location: string,
      servicedAt: string,
      findings: [string, string, string, string, string][],
    ): MaintenanceRow[] =>
      findings.map(([finding, action, owner, dueDate, status], index) => ({
        span: index === 0 ? span : 1,
        equipment,
        location,
        servicedAt,
        finding,
        action,
        owner,
        dueDate,
        status,
      }));

    const data: MaintenanceRow[] = [
      ...group(3, "EQ-1042", "Hat 1 / Presleme", "12.03.2026", [
        ["Hidrolik hatta basınç düşüşü gözlendi", "Sızdırmazlık contası değiştirildi", "A. Yılmaz", "20.03.2026", "Tamamlandı"],
        ["Yağ sıcaklığı eşik değerin üzerinde", "Soğutma fanı temizliği yapıldı", "A. Yılmaz", "22.03.2026", "Tamamlandı"],
        ["Titreşim sensörü kalibrasyon dışı", "Sensör yeniden kalibre edilecek", "M. Demir", "05.04.2026", "Devam ediyor"],
      ]),
      ...group(2, "EQ-1043", "Hat 1 / Kesim", "14.03.2026", [
        ["Bıçak aşınması tolerans sınırında", "Bıçak seti yenilendi", "S. Kaya", "18.03.2026", "Tamamlandı"],
        ["Koruma kapağı kilidi geç tepki veriyor", "Emniyet rölesi değişimi planlandı", "S. Kaya", "10.04.2026", "Beklemede"],
      ]),
      ...group(3, "EQ-1051", "Hat 2 / Kaynak", "19.03.2026", [
        ["Kaynak akımında dalgalanma", "Güç ünitesi kartı değiştirildi", "E. Aydın", "25.03.2026", "Tamamlandı"],
        ["Gaz debisi düşük okunuyor", "Regülatör revizyona gönderildi", "E. Aydın", "02.04.2026", "Devam ediyor"],
        ["Torç kablosunda yalıtım aşınması", "Kablo demeti komple yenilenecek", "B. Şahin", "15.04.2026", "Beklemede"],
      ]),
      ...group(2, "EQ-1077", "Hat 2 / Montaj", "21.03.2026", [
        ["Konveyör hız sapması %4", "Sürücü parametreleri güncellendi", "B. Şahin", "24.03.2026", "Tamamlandı"],
        ["Rulman sesi normalin üzerinde", "Rulman değişimi için parça bekleniyor", "M. Demir", "12.04.2026", "Beklemede"],
      ]),
      ...group(3, "EQ-1080", "Hat 3 / Boyama", "26.03.2026", [
        ["Filtre doluluk oranı %92", "Filtre kaseti değiştirildi", "Z. Öztürk", "28.03.2026", "Tamamlandı"],
        ["Nem oranı proses aralığının dışında", "Nem alma ünitesi devreye alındı", "Z. Öztürk", "01.04.2026", "Tamamlandı"],
        ["Püskürtme başlığında tıkanma", "Başlık sökülüp ultrasonik temizlik yapılacak", "A. Yılmaz", "18.04.2026", "Devam ediyor"],
      ]),
      ...group(2, "EQ-1095", "Hat 3 / Paketleme", "30.03.2026", [
        ["Etiket okuyucu hatalı okuma veriyor", "Optik kafa temizlendi ve test edildi", "S. Kaya", "03.04.2026", "Tamamlandı"],
        ["Bantlama ünitesinde kaçık hizalama", "Mekanik ayar ve merkezleme yapılacak", "E. Aydın", "20.04.2026", "Beklemede"],
      ]),
    ];

    const groupedColumn = (title: string, dataKey: string) => ({
      title,
      dataKey,
      rowSpan: (row: object) => (row as MaintenanceRow).span,
    });

    const columns = [
      groupedColumn("Ekipman", "equipment"),
      groupedColumn("Lokasyon", "location"),
      groupedColumn("Bakım Tarihi", "servicedAt"),
      { title: "Bulgu", dataKey: "finding" },
      { title: "Aksiyon", dataKey: "action" },
      { title: "Sorumlu", dataKey: "owner" },
      { title: "Termin", dataKey: "dueDate" },
      { title: "Durum", dataKey: "status" },
    ];

    return <Table data={data} columns={columns} border="cellBorders" striped showFixedRowNumbers hoverable />;
  },
};

export const RowspanOverlapping: Story = {
  render: () => {
    type ShiftRow = { regionSpan: number; crewSpan: number; region: string; crew: string; task: string; hours: number };

    const data: ShiftRow[] = [
      { regionSpan: 3, crewSpan: 1, region: "Kuzey", crew: "Ekip A", task: "Pano kontrolü", hours: 4 },
      { regionSpan: 1, crewSpan: 3, region: "Kuzey", crew: "Ekip B", task: "Kablo çekimi", hours: 6 },
      { regionSpan: 1, crewSpan: 1, region: "Kuzey", crew: "Ekip B", task: "Topraklama ölçümü", hours: 3 },
      { regionSpan: 2, crewSpan: 1, region: "Güney", crew: "Ekip B", task: "Trafo bakımı", hours: 8 },
      { regionSpan: 1, crewSpan: 2, region: "Güney", crew: "Ekip C", task: "Sigorta değişimi", hours: 2 },
      { regionSpan: 1, crewSpan: 1, region: "Güney", crew: "Ekip C", task: "Raporlama", hours: 1 },
    ];

    const columns = [
      { title: "Bölge", dataKey: "region", rowSpan: (row: object) => (row as ShiftRow).regionSpan },
      { title: "Ekip", dataKey: "crew", rowSpan: (row: object) => (row as ShiftRow).crewSpan },
      { title: "İş", dataKey: "task" },
      { title: "Saat", dataKey: "hours" },
    ];

    return <Table data={data} columns={columns} border="cellBorders" striped showFixedRowNumbers hoverable />;
  },
};
