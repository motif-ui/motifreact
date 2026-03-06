import type { MouseEvent } from "react";
import { ReactElement } from "react";
import Button from "@/components/Button/Button";
import styles from "../Card.module.scss";
import Icon from "@/components/Icon/Icon";
import { ButtonProps } from "@/components/Button/types";
import { LinkProps } from "../../Link/types";
import { IconButtonProps } from "../../IconButton/types";

type Props = {
  actionButton?: { text: string; onClick: (event: MouseEvent<HTMLButtonElement>) => void };
  alternateButton?: { text: string; onClick: (event: MouseEvent<HTMLButtonElement>) => void };
  actionLink?: { text: string; href: string; icon?: string; targetBlank?: boolean };
  buttons?: ReactElement<ButtonProps | LinkProps | IconButtonProps>[];
};

const CardActions = (props: Props) => {
  const { alternateButton, buttons, actionButton, actionLink } = props;

  const isVisible = actionButton || alternateButton || buttons?.length || actionLink;

  return (
    isVisible && (
      <div className={styles.actionsContainer} data-testid="cardActions">
        {actionButton && <Button pill onClick={actionButton.onClick} variant="primary" label={actionButton.text} />}
        {alternateButton && (
          <Button pill onClick={alternateButton.onClick} shape="outline" variant="secondary" label={alternateButton.text} />
        )}
        {buttons?.map(btn => btn)}
        {actionLink && (
          <a href={actionLink.href} {...(actionLink.targetBlank && { target: "_blank" })} className={styles.actionLink}>
            <span>{actionLink.text}</span>
            {actionLink.icon && <Icon name={actionLink.icon} size="md" variant="primary" />}
          </a>
        )}
      </div>
    )
  );
};

export default CardActions;
