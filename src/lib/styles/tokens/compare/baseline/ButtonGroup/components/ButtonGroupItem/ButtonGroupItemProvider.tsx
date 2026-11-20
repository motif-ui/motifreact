import { createContext, PropsWithChildren, useState } from "react";

type ContextType = {
  hasParentGroupItem: boolean;
  setHasParentGroupItem: (value: boolean) => void;
};

export const ButtonGroupItemNumberOfChildrenContext = createContext<ContextType>({
  hasParentGroupItem: false,
  setHasParentGroupItem: () => {},
});

const ButtonGroupItemProvider = ({ children }: PropsWithChildren) => {
  const [hasParentGroupItem, setHasParentGroupItem] = useState(false);

  return (
    <ButtonGroupItemNumberOfChildrenContext value={{ hasParentGroupItem, setHasParentGroupItem }}>
      {children}
    </ButtonGroupItemNumberOfChildrenContext>
  );
};

export default ButtonGroupItemProvider;
