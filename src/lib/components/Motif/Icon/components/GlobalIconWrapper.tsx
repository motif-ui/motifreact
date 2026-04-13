import { ComponentProps, ReactElement } from "react";
import Icon from "../../../Icon/Icon";

interface GlobalIconWrapperProps {
  icon: string | ReactElement;
  className?: string;
  iconProps?: Omit<ComponentProps<typeof Icon>, "name" | "className">;
}

const GlobalIconWrapper = ({ icon, className, iconProps }: GlobalIconWrapperProps) =>
  typeof icon === "string" ? (
    <Icon name={icon} className={className} {...iconProps} />
  ) : (
    <span className={className} style={{ display: "inline-flex", alignItems: "center" }}>
      {icon}
    </span>
  );

export default GlobalIconWrapper;
