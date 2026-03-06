import { PropsWithRef } from "../../../types";
import Icon from "@/components/Icon";
import styles from "./MotifIcon.module.scss";
import { ComponentType } from "react";
import { IconProps } from "@/components/Icon/types";

type Props = Omit<IconProps, "iconClass" | "name" | "svgColorType"> & { name: string };

const withMotifDefaultIconClass = (WrappedComponent: ComponentType<PropsWithRef<IconProps, HTMLSpanElement>>) => {
  const motifIconComponent = (props: Props) => <WrappedComponent iconClass={styles.motifIconsDefault} {...props} />;
  motifIconComponent.displayName = "Icon";
  return motifIconComponent;
};

const MotifIcon = withMotifDefaultIconClass(Icon);
export default MotifIcon;
