import { SmoothScroll } from "@/components/site/smooth-scroll";
import { ThemeProvider } from "@/components/site/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/contexts/LanguageContext";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://edusantos.vercel.app"),
  title: "Eduardo dos Santos Jacinto | Senior Front-End Engineer",
  description: "Desenvolvedor Front-End Sênior com 9 anos de experiência em React, Next.js e TypeScript. Design System, performance e arquitetura front-end, com produtos próprios em produção.",
  keywords: ["React", "Next.js", "TypeScript", "Senior Front-End Engineer", "Frontend Engineer", "Node.js", "JavaScript", "Web Development"],
  authors: [{ name: "Eduardo dos Santos Jacinto" }],
  creator: "Eduardo dos Santos Jacinto",
  icons: {
    icon: "./favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://edusantos.vercel.app",
    title: "Eduardo dos Santos Jacinto | Senior Front-End Engineer",
    description: "Desenvolvedor Front-End Sênior com 9 anos de experiência em React, Next.js e TypeScript",
    siteName: "Eduardo Jacinto Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eduardo dos Santos Jacinto | Senior Front-End Engineer",
    description: "Desenvolvedor Front-End Sênior com 9 anos de experiência",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}
      >
        <SmoothScroll />
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <Toaster position="bottom-right" />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
