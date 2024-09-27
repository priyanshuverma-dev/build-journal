import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { UIProvider } from "@/providers/ui-provider";
import { SessionProvider } from "next-auth/react";

const fonts = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Build Journal",
  description: "A site to keep project logs",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fonts.className}>
        <SessionProvider>
          <UIProvider>
            <ThemeProvider attribute="class" enableSystem>
              {children}
              {modal}
            </ThemeProvider>
          </UIProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
