"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { FileDown, Languages, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { useLanguage } from "@/contexts/LanguageContext";
import { PROFILE } from "@/lib/profile";
import { cn } from "@/lib/utils";

import { MobileMenu } from "./mobile-menu";

const LINKS = ["projetos", "vela", "servicos", "experiencia", "contato"] as const;

/** Alterna dark/light. Só mostra o ícone depois de montar, para não divergir do SSR. */
export function ThemeToggle() {
  const { t } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = !mounted || resolvedTheme !== "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={(isDark ? t("a11y.lightTheme") : t("a11y.darkTheme")) as string}
      className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-soft hover:text-foreground"
    >
      {isDark ? <Sun className="size-3.5" aria-hidden="true" /> : <Moon className="size-3.5" aria-hidden="true" />}
    </button>
  );
}

/**
 * Navbar flutuante em pílula (Dipa), a partir de md: fica em cima e ganha fundo
 * quando a página rola. Abaixo de md entra o header fixo com o menu lateral.
 */
export function Navbar() {
  const { t, language, setLanguage, getCvUrl } = useLanguage();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("inicio");

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));

  useEffect(() => {
    const sections = ["inicio", ...LINKS]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
    <MobileMenu active={active} />
    <header className="pointer-events-none fixed inset-x-0 top-5 z-50 hidden justify-center px-4 md:flex">
      <motion.nav
        aria-label={t("nav.label") as string}
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "pointer-events-auto flex max-w-full items-center gap-1 rounded-full border border-edge p-1.5 shadow-[var(--shadow-float)] backdrop-blur-xl transition-colors duration-500",
          scrolled ? "bg-nav" : "bg-nav/70",
        )}
      >
        <a
          href="#inicio"
          aria-label={PROFILE.nome}
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-[11px] font-semibold text-primary-foreground"
        >
          {PROFILE.iniciais}
        </a>

        <ul className="flex items-center">
          {LINKS.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={cn(
                  "relative block rounded-full px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
                  active === id && "text-foreground",
                )}
              >
                {active === id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full bg-soft"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {t(`nav.${id}`)}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setLanguage(language === "pt" ? "en" : "pt")}
          aria-label={t("a11y.switchLanguage") as string}
          className="flex h-8 shrink-0 items-center gap-1 rounded-full px-2.5 font-mono text-[11px] uppercase text-muted-foreground transition-colors hover:bg-soft hover:text-foreground"
        >
          <Languages className="size-3.5" aria-hidden="true" />
          {language === "pt" ? "EN" : "PT"}
        </button>

        <ThemeToggle />

        <a
          href={getCvUrl()}
          download
          className="flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <FileDown className="size-3.5" aria-hidden="true" />
          {t("hero.downloadCV")}
        </a>
      </motion.nav>
    </header>
    </>
  );
}
