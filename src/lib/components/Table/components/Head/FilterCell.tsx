import InputText from "@/components/Motif/InputText/InputText";
import { getSpanProps } from "@/components/Table/helper";
import { TableContext } from "@/components/Table/TableContext";
import { useContext } from "react";
import styles from "../../Table.module.scss";

type Props = {
  index: number;
  colSpan?: number;
};

const FilterCell = ({ index, colSpan }: Props) => {
  const { updateFilterState } = useContext(TableContext);

  return (
    <th {...getSpanProps(colSpan)}>
      <div className={styles.thFilterContent}>
        <InputText size="sm" onChange={val => updateFilterState((val as string).toLowerCase(), index)} />
      </div>
    </th>
  );
};

export default FilterCell;
