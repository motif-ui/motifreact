import { useContext } from "react";
import styles from "../Stepper.module.scss";
import { StepperContext } from "../StepperContext";

const StepperCounter = ({ activeStep }: { activeStep: number }) => {
  const { count } = useContext(StepperContext);

  return (
    <span className={styles.stepCount}>
      <span className={styles.stepCountActive}>{activeStep + 1}</span>
      {" / "}
      {count}
    </span>
  );
};

export default StepperCounter;
