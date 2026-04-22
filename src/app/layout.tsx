import "./globals.css";
import "../lib/styles/themes/default-theme.css";
import type { ReactNode } from "react";
import { MotifProvider } from "../lib";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js" />
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
