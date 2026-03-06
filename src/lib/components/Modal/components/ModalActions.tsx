import type { MouseEvent } from "react";
import { ReactElement } from "react";
import Button from "../../Button/Button";
import styles from "../Modal.module.scss";
import { LinkProps } from "../../Link/types";
import { ButtonProps } from "../../Button/types";
import { IconButtonProps } from "../../IconButton/types";

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
          <Button pill onClick={alternateButton.onClick} shape="outline" variant="secondary" label={alternateButton.text} />
        )}
        {buttons}
      </div>
    )
  );
};

export default ModalActions;
