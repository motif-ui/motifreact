import { ComponentDefaults } from "../types/contextProps";
import { useMotifContext } from "../context/MotifProvider";
import { StandardProps } from "../../types";

const usePropsWithThemeDefaults = <K extends keyof ComponentDefaults, U extends ComponentDefaults[K], T extends Record<string, unknown>>(
  componentName: K,
  props: T,
): T => {
  const defaultablePropsOfComponent = useMotifContext().componentDefaults[componentName] as U;
  const maybeMergedClassName =
    !!defaultablePropsOfComponent?.className &&
    !!props.className &&
    `${defaultablePropsOfComponent.className} ${(props as StandardProps).className}`;
  return { ...defaultablePropsOfComponent, ...props, ...(maybeMergedClassName && { className: maybeMergedClassName }) } as T;
};

export default usePropsWithThemeDefaults;
