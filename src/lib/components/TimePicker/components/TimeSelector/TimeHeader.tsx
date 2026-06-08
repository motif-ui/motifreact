import styles from "../../TimePicker.module.scss";
import { useContext, useMemo } from "react";
import { TimePickerContext } from "@/components/TimePicker/context/TimePickerProvider";
import { useMotifContext } from "src/lib/motif/context/MotifProvider.tsx";
import { getDateLocale } from "src/i18n/locales/dateLocals.ts";

const TimeHeader = () => {
  const { locale: contextLocale, secondsEnabled } = useContext(TimePickerContext);

  const { t } = useMotifContext();
  const locale = useMemo(() => contextLocale ?? getDateLocale(t), [contextLocale, t]);

  return (
    <div className={styles.abbrContainer}>
      <span>{locale.hoursAbbr}</span>
      <span>{locale.minutesAbbr}</span>
      {secondsEnabled && <span>{locale.secondsAbbr}</span>}
    </div>
  );
};

export default TimeHeader;
