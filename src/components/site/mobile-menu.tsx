"use client";

import { ArrowRight, FileDown, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { PROFILE } from "@/lib/profile";
import { lockSmoothScroll, scrollToSection } from "@/lib/scroll";
import { cn } from "@/lib/utils";

const SECTIONS = ["inicio", "projetos", "vela", "numeros", "servicos", "experiencia", "contato"] as const;

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string; icon?: React.ReactNode }>;
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <p className="mono-label mb-2">{label}</p>
      <div role="group" aria-label={label} className="grid grid-cols-2 gap-1 rounded-full border border-edge p-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex h-9 items-center justify-center gap-1.5 rounded-full font-mono text-[11px] uppercase tracking-wider transition-colors",
              value === option.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Navegação abaixo de md: header fixo enxuto e menu lateral que entra da
 * esquerda (Sheet do shadcn). O Radix cuida do foco preso, do Esc e do overlay;
 * o prefers-reduced-motion zera as animações pelo CSS global.
 */
export function MobileMenu({ active }: { active: string }) {
  const { t, language, setLanguage, getCvUrl } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pendingTarget = useRef<string | null>(null);

  useEffect(() => setMounted(true), []);

  const theme = mounted && resolvedTheme === "light" ? "light" : "dark";

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    lockSmoothScroll(next);
  };

  // Fecha primeiro e só rola quando o painel terminou de sair (onCloseAutoFocus).
  const goTo = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    pendingTarget.current = id;
    handleOpenChange(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-edge bg-nav backdrop-blur-xl md:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <a href="#inicio" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary font-mono text-[11px] font-semibold text-primary-foreground">
            {PROFILE.iniciais}
          </span>
          <span className="text-sm font-medium">Eduardo Santos</span>
        </a>

        <Sheet open={open} onOpenChange={handleOpenChange}>
          <SheetTrigger
            aria-label={t("nav.menuOpen") as string}
            className="flex size-10 items-center justify-center rounded-full border border-edge text-foreground transition-colors hover:bg-soft"
          >
            <Menu className="size-5" aria-hidden="true" />
          </SheetTrigger>

          <SheetContent
            side="left"
            showCloseButton={false}
            className="w-[86%] max-w-sm gap-0 overflow-y-auto border-edge bg-background p-0"
            onCloseAutoFocus={(event) => {
              const id = pendingTarget.current;
              if (!id) return;
              event.preventDefault();
              pendingTarget.current = null;
              scrollToSection(id);
            }}
          >
            <SheetHeader className="flex-row items-center justify-between gap-3 border-b border-edge px-4 py-3">
              <div>
                <SheetTitle className="mono-label text-foreground">{t("nav.menuTitle")}</SheetTitle>
                <SheetDescription className="sr-only">{t("nav.menuDescription")}</SheetDescription>
              </div>
              <SheetClose
                aria-label={t("nav.menuClose") as string}
                className="flex size-10 items-center justify-center rounded-full border border-edge text-foreground transition-colors hover:bg-soft"
              >
                <X className="size-5" aria-hidden="true" />
              </SheetClose>
            </SheetHeader>

            <nav aria-label={t("nav.menuSections") as string} className="px-4 py-4">
              <ol className="flex flex-col border-t border-line">
                {SECTIONS.map((id, i) => (
                  <li key={id} className="border-b border-line">
                    <a
                      href={`#${id}`}
                      onClick={goTo(id)}
                      aria-current={active === id ? "true" : undefined}
                      className={cn(
                        "flex items-center gap-4 py-3.5 text-lg font-medium tracking-tight transition-colors hover:text-primary",
                        active === id ? "text-primary" : "text-foreground",
                      )}
                    >
                      <span aria-hidden="true" className="font-mono text-[11px] text-muted-foreground">
                        {String(i).padStart(2, "0")}
                      </span>
                      {t(`nav.${id}`)}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="grid gap-5 px-4 pb-4">
              <Segmented<Language>
                label={t("nav.language") as string}
                value={language}
                onChange={setLanguage}
                options={[
                  { value: "pt", label: "PT" },
                  { value: "en", label: "EN" },
                ]}
              />
              <Segmented<"dark" | "light">
                label={t("nav.theme") as string}
                value={theme}
                onChange={setTheme}
                options={[
                  { value: "dark", label: t("nav.themeDark") as string, icon: <Moon className="size-3.5" aria-hidden="true" /> },
                  { value: "light", label: t("nav.themeLight") as string, icon: <Sun className="size-3.5" aria-hidden="true" /> },
                ]}
              />
            </div>

            <div className="mt-auto grid gap-2 border-t border-edge p-4">
              <a
                href="#contato"
                onClick={goTo("contato")}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground"
              >
                {t("hero.contact")}
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              <a
                href={getCvUrl()}
                download
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-edge px-6 text-sm font-medium text-foreground transition-colors hover:bg-soft"
              >
                <FileDown className="size-4" aria-hidden="true" />
                {t("hero.downloadCV")}
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
