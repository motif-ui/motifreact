import Button from "../../Button";
import styles from "../Stepper.module.scss";
import { StepperNavigationProps } from "../types";
import { useContext } from "react";
import { StepperContext } from "@/components/Stepper/StepperContext.tsx";
import { useMotifContext } from "../../../motif/context/MotifProvider";

const StepperNavigation = ({ onFinishClick, finishButtonLabel, onNextClick, onPrevClick }: StepperNavigationProps) => {
  const { goToPrevStep, goToNextStep, activeStep, disabledSteps } = useContext(StepperContext)!;
  const { t } = useMotifContext();

  const isFirstStep = disabledSteps.slice(0, activeStep).every(Boolean);
  const isLastStep = disabledSteps.slice(activeStep + 1).every(Boolean);

  const handleNext = isLastStep ? onFinishClick : (onNextClick ?? goToNextStep);
  const handlePrev = onPrevClick ?? goToPrevStep;

  return (
    <div className={styles.stepNavigation}>
      <Button label={t("g.previous")} shape="outline" onClick={handlePrev} disabled={isFirstStep} />
      <Button label={isLastStep ? (finishButtonLabel ?? t("g.finish")) : t("g.next")} onClick={handleNext} />
    </div>
  );
};

export default StepperNavigation;
