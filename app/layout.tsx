import "./globals.scss";
import React from "react";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Live Chat",
  description: "An Online Live Chat Sever",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
