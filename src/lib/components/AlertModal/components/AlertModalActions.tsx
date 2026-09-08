import { memo, MouseEvent } from "react";
import Button from "../../Button";
import { Variant } from "src/lib/types";

type Props = {
  actionButton?: { text: string; onClick: (event: MouseEvent<HTMLButtonElement>) => void };
  alternateButton?: { text: string; onClick: (event: MouseEvent<HTMLButtonElement>) => void };
  className?: string;
  variant?: Variant;
};

const AlertModalActions = memo((props: Props) => {
  const { alternateButton, actionButton, className, variant } = props;
  const isVisible = actionButton || alternateButton;

  return (
    isVisible && (
      <div data-testid="alertModalActions" className={className}>
        {alternateButton && (
          <Button pill onClick={alternateButton.onClick} shape="outline" variant="secondary" label={alternateButton.text} />
        )}
        {actionButton && <Button pill onClick={actionButton.onClick} variant={variant} label={actionButton.text} />}
      </div>
    )
  );
});

export default AlertModalActions;
