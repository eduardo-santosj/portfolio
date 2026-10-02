"use client";

import { ArrowUp } from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";
import { PROFILE } from "@/lib/profile";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mx-auto max-w-7xl px-4 pb-10 pt-10 md:px-8">
      <div className="flex flex-col gap-4 border-t border-line pt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground md:flex-row md:items-center md:justify-between">
        <span>
          © {new Date().getFullYear()} {PROFILE.nome}
        </span>
        <span>{PROFILE.local}</span>
        <span className="normal-case tracking-normal">{t("footer.rights")}</span>
        <a href="#inicio" className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
          {t("footer.backToTop")}
          <ArrowUp className="size-3" aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
