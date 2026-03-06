"use client";

import type { RefObject } from "react";
import { useState } from "react";
import useOutsideClick from "../../../hooks/useOutsideClick";

const usePopover = (anchorRef: RefObject<HTMLElement | null>) => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useOutsideClick<HTMLDivElement>(() => open && setOpen(false), [anchorRef]);
  const toggle = () => setOpen(!open);

  return { toggle, ref, open };
};

export default usePopover;
