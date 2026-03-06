"use client";

import { MouseEventHandler, PropsWithChildren, useContext, useEffect } from "react";
import Button from "../Button/Button";
import { ButtonGroupItemNumberOfChildrenContext } from "./ButtonGroupItemProvider";
import ButtonWithDropdown from "../Button/ButtonWithDropdown";

export type ButtonGroupItemProps = {
  label?: string;
  icon?: string;
  disabled?: boolean;
  action?: MouseEventHandler<HTMLButtonElement>;
};

const ButtonGroupItem = (props: PropsWithChildren<ButtonGroupItemProps>) => {
  const { hasParentGroupItem, setHasParentGroupItem } = useContext(ButtonGroupItemNumberOfChildrenContext);

  useEffect(() => {
    setHasParentGroupItem(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !hasParentGroupItem && props.children ? <ButtonWithDropdown {...props} /> : <Button type="single" {...props} />;
};

ButtonGroupItem.displayName = "ButtonGroupItem";
export default ButtonGroupItem;
