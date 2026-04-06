import { memo, PropsWithChildren } from "react";
import styles from "../Stepper.module.scss";

type Props = {
  index: number;
  isActive?: boolean;
};

const StepperPanel = memo(({ isActive, children }: PropsWithChildren<Props>) => {
  return isActive ? <div className={styles.stepContent}>{children}</div> : null;
});

StepperPanel.displayName = "StepperPanel";
export default StepperPanel;
