import styles from "../../ButtonGroup.module.scss";
import Icon from "@/components/Icon";
import { memo } from "react";
import { ButtonGroupItemProps } from "@/components/ButtonGroup/components/ButtonGroupItem/ButtonGroupItem";

type Props = ButtonGroupItemProps & {
  type: "single" | "multiple" | "dropdown";
};

const Button = memo((props: Props) => {
  const { label, disabled, action, icon, type } = props;

  return (
    <button className={`${styles.button} ${styles[`button__${type}`]}`} type="button" disabled={disabled} onClick={action}>
      {icon && <Icon name={icon} className={styles.icon} />} {label}
    </button>
  );
});

export default Button;
