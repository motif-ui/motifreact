import styles from "../Stepper.module.scss";
import { useContext } from "react";
import { StepperContext } from "@/components/Stepper/StepperContext.tsx";

const StepperCounter = () => {
  const { activeStep, count, variant } = useContext(StepperContext)!;

  return (
    <span className={`${styles.stepCount} ${styles[`count-${variant}`]}`}>
      <span className={styles.stepCountActive}>{activeStep + 1}</span>
      {" / "}
      {count}
    </span>
  );
};

export default StepperCounter;
