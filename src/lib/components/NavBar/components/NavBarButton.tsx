import Button from "@/components/Button";
import { MouseEvent } from "react";
import { useNavBarContext } from "@/components/NavBar/NavBarContext";

export type NavBarButtonProps = {
  label?: string;
  icon?: string;
  pill?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

const NavBarButton = (props: NavBarButtonProps) => {
  const { label, icon, pill, onClick } = props;
  const { variant } = useNavBarContext();
  return (
    <Button
      size="md"
      shape="solid"
      variant={variant === "neutral" ? "primary" : "secondary"}
      label={label}
      onClick={onClick}
      icon={icon}
      pill={pill}
    />
  );
};
export default NavBarButton;
