"use client";

import { PropsWithRef } from "../../types";
import styles from "./Breadcrumb.module.scss";
import Icon from "@/components/Icon/Icon";
import { MotifIcon } from "@/components/Motif/Icon";
import { BreadcrumbProps } from "./types";
import usePropsWithThemeDefaults from "../../motif/hooks/usePropsWithThemeDefaults";
import { sanitizeModuleRootClasses } from "../../../utils/cssUtils";

const Breadcrumb = (props: PropsWithRef<BreadcrumbProps, HTMLUListElement>) => {
  const {
    items,
    homeIcon,
    maxVisibleItems = 3,
    collapsedPosition = "left",
    ref,
    className,
    style,
  } = usePropsWithThemeDefaults("Breadcrumb", props);

  const collapsed = items.length > maxVisibleItems;
  const itemsToRender = collapsed
    ? maxVisibleItems === 1
      ? [{ label: "..." }, ...items.slice(-1)]
      : maxVisibleItems > 1
        ? collapsedPosition === "right"
          ? [...items.slice(0, maxVisibleItems - 1), { label: "..." }, ...items.slice(-1)]
          : [...items.slice(0, maxVisibleItems > 1 ? 1 : 0), { label: "..." }, ...items.slice(-maxVisibleItems + 1)]
        : []
    : items;

  const renderCrumbs = () =>
    itemsToRender.map((crumb, index) => (
      <li key={index} data-testid="breadcrumb">
        {index < itemsToRender.length - 1 ? (
          <>
            {crumb.path ? <a href={crumb.path}>{crumb.label}</a> : <span className={styles.collapsed}>{crumb.label}</span>}
            <MotifIcon name="arrow_forward_ios" className={styles["right-icon"]} />
          </>
        ) : (
          <span className={styles.label}>{crumb.label}</span>
        )}
      </li>
    ));

  const classNames = sanitizeModuleRootClasses(styles, className);

  return (
    maxVisibleItems >= 0 && (
      <ul className={classNames} ref={ref} style={style}>
        {itemsToRender.length > 0 &&
          (homeIcon ? (
            typeof homeIcon === "string" ? (
              <Icon name={homeIcon} className={styles["homepage-icon"]} />
            ) : (
              <span className={styles["homepage-icon"]}>{homeIcon}</span>
            )
          ) : (
            <MotifIcon name="home" className={styles["homepage-icon"]} />
          ))}
        {renderCrumbs()}
      </ul>
    )
  );
};

Breadcrumb.displayName = "Breadcrumb";
export default Breadcrumb;
