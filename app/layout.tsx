import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Log in",
  description: "Account Takeover Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased m-0">
        {children}
      </body>
    </html>
  );
}
