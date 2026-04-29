import InputText from "@/components/Motif/InputText/InputText";
import { TableContext } from "@/components/Table/TableContext";
import { useContext } from "react";
import styles from "../../Table.module.scss";

type Props = {
  index: number;
};

const FilterCell = ({ index }: Props) => {
  const { updateFilterState } = useContext(TableContext);

  return (
    <th>
      <div className={styles.thFilterContent}>
        <InputText size="sm" onChange={val => updateFilterState((val as string).toLowerCase(), index)} />
      </div>
    </th>
  );
};

export default FilterCell;
