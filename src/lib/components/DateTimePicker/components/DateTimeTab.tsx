import { MotifIcon } from "@/components/Motif/Icon";
import styles from "../DateTimePicker.module.scss";
import { useContext } from "react";
import { DateTimePickerContext } from "../context/DateTimePickerProvider";
import { ActiveTab } from "@/components/DateTimePicker/types";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";

type Props = {
  tabType: ActiveTab;
  icon: "calendar_month" | "schedule";
};

const DateTimeTab = (props: Props) => {
  const { tabType, icon } = props;
  const { activeTab, setActiveTab, size } = useContext(DateTimePickerContext)!;

  const className = sanitizeModuleClasses(styles, "tabItem", activeTab === tabType && "active");
  return (
    <button type="button" className={className} onClick={() => setActiveTab(tabType)}>
      <MotifIcon className={styles.icon} name={icon} size={size} />
    </button>
  );
};

export default DateTimeTab;
