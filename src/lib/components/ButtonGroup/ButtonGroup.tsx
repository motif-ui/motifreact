"use client";

import { Children, Fragment, useMemo } from "react";
import styles from "./ButtonGroup.module.scss";
import { PropsWithRefAndChildren } from "../../types";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";
import ButtonGroupItem from "./components/ButtonGroupItem/ButtonGroupItem";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { ButtonGroupProps } from "./types";
import { ButtonGroupContext } from "./ButtonGroupContext.tsx";

const ButtonGroupComponent = (props: PropsWithRefAndChildren<ButtonGroupProps, HTMLDivElement>) => {
  const { size = "md", children, ref, className, style } = usePropsWithThemeDefaults("ButtonGroup", props);

  const childrenArray = Children.toArray(children);
  const classNames = sanitizeModuleRootClasses(styles, className, [size]);
  const contextValue = useMemo(() => ({ size }), [size]);

  return (
    <ButtonGroupContext value={contextValue}>
      <div className={classNames} ref={ref} style={style}>
        {childrenArray.map((child, idx) =>
          idx === childrenArray.length - 1 ? (
            child
          ) : (
            <Fragment key={idx}>
              {child}
              <span className={styles.divider} />
            </Fragment>
          ),
        )}
      </div>
    </ButtonGroupContext>
  );
};

const ButtonGroup = Object.assign(ButtonGroupComponent, {
  displayName: "ButtonGroup",
  Item: ButtonGroupItem,
});
export default ButtonGroup;
