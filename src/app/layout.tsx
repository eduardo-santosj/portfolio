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
  title: "Eduardo dos Santos Jacinto | Full Stack Developer",
  description: "Desenvolvedor Full Stack com 7+ anos de experiência em React, Next.js e Node.js. Especialista em performance web e arquitetura escalável.",
  keywords: ["React", "Next.js", "TypeScript", "Full Stack Developer", "Frontend Engineer", "Node.js", "JavaScript", "Web Development"],
  authors: [{ name: "Eduardo dos Santos Jacinto" }],
  creator: "Eduardo dos Santos Jacinto",
  icons: {
    icon: "./favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://edusantos.vercel.app",
    title: "Eduardo dos Santos Jacinto | Full Stack Developer",
    description: "Desenvolvedor Full Stack com 7+ anos de experiência em React, Next.js e Node.js",
    siteName: "Eduardo Jacinto Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eduardo dos Santos Jacinto | Full Stack Developer",
    description: "Desenvolvedor Full Stack com 7+ anos de experiência",
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
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
