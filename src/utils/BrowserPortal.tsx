"use client";

import { ReactNode, Suspense, use } from "react";
import { browser, createPortal } from "react-dom";

type Props = {
  children: ReactNode;
};

const BrowserPortalContainer = ({ children }: Props) => {
  use(browser("Portals target document.body, which only exists in the browser."));
  return createPortal(children, document.body);
};

/**
 * Renders children into document.body only in the browser.
 *
 * @summary `use(browser())` suspends during server rendering, so the portal is wrapped in its own Suspense boundary
 * to keep the consumer's nearest boundary from falling back.
 */
const BrowserPortal = ({ children }: Props) => (
  <Suspense fallback={null}>
    <BrowserPortalContainer>{children}</BrowserPortalContainer>
  </Suspense>
);

export default BrowserPortal;
