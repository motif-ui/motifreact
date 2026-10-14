"use client";

import { useLayoutEffect } from "react";

/** Locks the page's scroll, keeping the scrollbar's space so the page does not shift sideways. Returns the unlock. */
const lockPage = () => {
  const { style } = document.documentElement;
  const { overflow, scrollbarGutter } = style;
  const hasScrollbar = window.innerWidth > document.documentElement.clientWidth;
  style.overflow = "hidden";
  if (hasScrollbar) style.scrollbarGutter = "stable";
  return () => {
    style.overflow = overflow;
    style.scrollbarGutter = scrollbarGutter;
  };
};

// The overlays that lock the scroll at the moment, e.g. a modal opened from another one, and the unlock of the page.
// They are shared by all the instances, so the page is locked by the first one and unlocked after the last one.
const owners = new Set<symbol>();
const unlock = { page: () => {} };

/**
 * Locks the page's scroll while enabled, e.g. while a modal is open, so the page behind it does not scroll.
 * The page is unlocked when the last lock is released.
 */
const useScrollLock = (enabled: boolean) => {
  useLayoutEffect(() => {
    if (!enabled) return;

    const owner = Symbol("scrollLock");
    if (owners.size === 0) unlock.page = lockPage();
    owners.add(owner);
    return () => {
      owners.delete(owner);
      if (owners.size === 0) unlock.page();
    };
  }, [enabled]);
};

export default useScrollLock;
