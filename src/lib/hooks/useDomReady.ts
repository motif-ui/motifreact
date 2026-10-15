"use client";

import { useState, useEffect } from "react";

const useDomReady = () => {
  const [domReady, setDomReady] = useState(false);
  useEffect(() => setDomReady(true), []);

  return domReady;
};

export default useDomReady;
