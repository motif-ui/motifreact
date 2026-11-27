import { PropsWithRef } from "../../../types";
import Icon from "@/components/Icon";
import styles from "./MotifIcon.module.scss";
import { ComponentType } from "react";
import { IconProps } from "@/components/Icon/types";

type Props = Omit<IconProps, "iconClass" | "name" | "svgColorType"> & { name: string };

const withMotifDefaultIconClass = (WrappedComponent: ComponentType<PropsWithRef<IconProps, HTMLSpanElement>>) => {
  const motifIconComponent = (props: Props) => <WrappedComponent iconClass={styles.motifIconsDefault} {...props} />;
  motifIconComponent.displayName = "Icon";
  // Icon unwraps a MotifIcon child by this flag, not by its displayName: Storybook's docgen rewrites displayNames
  motifIconComponent.isMotifIcon = true;
  return motifIconComponent;
};

const MotifIcon = withMotifDefaultIconClass(Icon);
export default MotifIcon;
