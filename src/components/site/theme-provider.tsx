"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/** Escuro é o padrão; o claro fica a um clique, salvo pelo next-themes. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}
