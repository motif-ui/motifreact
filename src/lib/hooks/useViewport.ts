"use client";
import { useSyncExternalStore } from "react";

export type Viewport = {
  width: number;
  height: number;
};

const SERVER_VIEWPORT: Viewport = { width: 0, height: 0 };

const cache: { viewport: Viewport } = { viewport: SERVER_VIEWPORT };

const readViewport = () => {
  const { innerWidth: width, innerHeight: height } = window;
  if (cache.viewport.width !== width || cache.viewport.height !== height) cache.viewport = { width, height };
  return cache.viewport;
};

const subscribe = (onChange: () => void) => {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
};

const getServerSnapshot = () => SERVER_VIEWPORT;

const useViewport = () => useSyncExternalStore(subscribe, readViewport, getServerSnapshot);

export default useViewport;
