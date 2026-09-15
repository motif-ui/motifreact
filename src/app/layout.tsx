import "./globals.css";
import "../lib/styles/themes/default-theme.css";
import type { ReactNode } from "react";
import { MotifProvider } from "../lib";
import Script from "next/script";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script crossOrigin="anonymous" src="//unpkg.com/react-scan@0.5.7/dist/auto.global.js" strategy="beforeInteractive" />
        <title>Motif UI</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/motif-ui/assets/css/motif-icons.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <MotifProvider>{children}</MotifProvider>
      </body>
    </html>
  );
}
