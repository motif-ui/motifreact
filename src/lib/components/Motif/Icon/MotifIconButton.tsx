import { PropsWithRef, StandardProps } from "../../../types";
import IconButton from "@/components/IconButton";
import styles from "./MotifIcon.module.scss";
import { ComponentType } from "react";
import { IconButtonProps } from "../../IconButton/types";

type Props = Omit<IconButtonProps, "iconClass" | "name"> & { name: string } & StandardProps;

const withMotifDefaultIconClass = (WrappedComponent: ComponentType<PropsWithRef<IconButtonProps, HTMLButtonElement>>) => {
  const motifIconButtonComponent = (props: Props) => <WrappedComponent iconClass={styles.motifIconsDefault} {...props} />;
  motifIconButtonComponent.displayName = "IconButton";
  return motifIconButtonComponent;
};

const MotifIconButton = withMotifDefaultIconClass(IconButton);
export default MotifIconButton;
