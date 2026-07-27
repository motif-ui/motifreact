import styles from "../Table.module.scss";
import TableHead from "@/components/Table/components/Head/TableHead";
import TableBody from "@/components/Table/components/Body/TableBody";
import ColumnFootArea from "@/components/Table/components/Foot/ColumnFootArea";
import { TableProps } from "@/components/Table/types";
import FooterForNumbers from "@/components/Table/components/Foot/FooterForNumbers";
import { PropsWithRef } from "../../../types";
import { sanitizeModuleRootClasses } from "../../../../utils/cssUtils";
import TableTitleSection from "./TableTitleSection";

type Props = Omit<
  TableProps,
  | "columns"
  | "data"
  | "showFixedRowNumbers"
  | "pagination"
  | "selectable"
  | "selectionKey"
  | "onSelect"
  | "filterableTable"
  | "rowColorCallback"
  | "reflectDataChanges"
>;

const TableContainer = (props: PropsWithRef<Props, HTMLDivElement>) => {
  const {
    title,
    subtitle,
    header,
    headerColsBackground = "solid",
    footer,
    border = "cellBorders",
    hoverable,
    striped,
    loading,
    emptyMessage,
    footerColsBackground = "solid",
    hideTotalRecords,
    ref,
    distributeColsEvenly,
    fluid,
    className,
    style,
  } = props;

  const classNames = sanitizeModuleRootClasses(styles, className, [
    ["bordered", border],
    hoverable && "hoverable",
    distributeColsEvenly && "distributeColsEvenly",
    fluid && "fluid",
  ]);

  return (
    <div ref={ref} className={classNames} style={style}>
      <TableTitleSection title={title} subtitle={subtitle} />
      <table>
        <TableHead background={headerColsBackground} header={header} />
        <TableBody loading={loading} emptyMessage={emptyMessage} striped={striped} />
        <ColumnFootArea background={footerColsBackground} customFooter={footer} />
      </table>
      {!loading && <FooterForNumbers hideTotalRecordsMessage={hideTotalRecords} loading={loading} />}
    </div>
  );
};

export default TableContainer;
