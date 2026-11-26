import type { MouseEvent } from "react";
import { ReactElement } from "react";
import Button from "../../../../../../components/Button/Button";
import styles from "../ModalBaseline.module.scss";
import { LinkProps } from "../../../../../../components/Link/types";
import { ButtonProps } from "../../../../../../components/Button/types";
import { IconButtonProps } from "../../../../../../components/IconButton/types";

type Props = {
  actionButton?: { text: string; onClick: (event: MouseEvent<HTMLButtonElement>) => void };
  alternateButton?: { text: string; onClick: (event: MouseEvent<HTMLButtonElement>) => void };
  buttons?: ReactElement<ButtonProps | LinkProps | IconButtonProps>[];
};

const ModalActions = (props: Props) => {
  const { alternateButton, buttons, actionButton } = props;
  const isVisible = actionButton || alternateButton || buttons?.length;

  return (
    isVisible && (
      <div className={styles.actions}>
        {actionButton && <Button pill onClick={actionButton.onClick} variant="primary" label={actionButton.text} />}
        {alternateButton && (
          <Button pill onClick={alternateButton.onClick} shape="outline" variant="neutral" label={alternateButton.text} />
        )}
        {buttons}
      </div>
    )
  );
};

export default ModalActions;
