import styles from "../Stepper.module.scss";
import { StepperCounterProps } from "../types";
import { sanitizeModuleClasses } from "../../../../utils/cssUtils";

const StepperCounter = ({ activeStep, count, orientation }: StepperCounterProps) => {
  const className = sanitizeModuleClasses(styles, "stepCount", orientation === "vertical" ? "stepCountVertical" : "stepCountHorizontal");

  return (
    <span className={className}>
      <span className={styles.stepCountActive}>{activeStep + 1}</span>
      {" / "}
      {count}
    </span>
  );
};

export default StepperCounter;
