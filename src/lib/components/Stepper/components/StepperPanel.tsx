import { PropsWithChildren, useContext } from "react";
import { StepperContext } from "../StepperContext";
import styles from "../Stepper.module.scss";

type Props = {
  index: number;
};

const StepperPanel = (props: PropsWithChildren<Props>) => {
  const { index, children } = props;
  const { activeStep } = useContext(StepperContext);

  return index === activeStep ? <div className={styles.stepContent}>{children}</div> : null;
};

StepperPanel.displayName = "StepperPanel";
export default StepperPanel;
