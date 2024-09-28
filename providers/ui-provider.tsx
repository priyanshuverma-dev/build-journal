// app/providers.tsx
"use client";
import { NextUIProvider } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
type Theme = "light" | "dark" | "system" | undefined;

export function UIProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  const { theme } = useTheme();
  const ftheme = (): Theme => {
    if (theme == "light") return "light";
    if (theme == "dark") return "dark";
    else return "system";
  };
  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>
        {children}
        <Toaster position="top-right" theme={ftheme()} expand richColors />
      </NextUIProvider>
    </QueryClientProvider>
  );
}
