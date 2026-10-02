"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, FileDown } from "lucide-react";
import { Fragment, useEffect, useState } from "react";

import { useLanguage } from "@/contexts/LanguageContext";
import { PROFILE } from "@/lib/profile";

import { GithubIcon, LinkedinIcon } from "./icons";
import { Cross } from "./section-header";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Título que entra palavra por palavra, cada uma subindo de dentro de uma máscara. */
function RevealWords({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="inline-block overflow-hidden pb-[0.1em] align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: delay + i * 0.07 }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

/** Hora local de Itajaí, viva, em formato HH:MM:SS. */
function useLocalTime() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const format = new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: PROFILE.timeZone,
    });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}

export function Hero() {
  const { t, getCvUrl } = useLanguage();
  const time = useLocalTime();
  const line1 = t("hero.titleLine1") as string;
  const line2 = t("hero.titleLine2") as string;
  const firstLineWords = line1.split(" ").length;

  const fadeIn = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: EASE, delay },
  });

  return (
    <section id="inicio" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <div aria-hidden="true" className="glow-amber pointer-events-none absolute -left-40 -top-40 size-[60rem] opacity-80" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pb-10 pt-28 md:px-8 md:pt-36">
        <motion.p {...fadeIn(0.1)} className="mono-label mb-8 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
          <span className="text-foreground/80">{t("hero.eyebrow")}</span>
          <span className="text-faint">/</span>
          <span>{t("hero.role")}</span>
        </motion.p>

        <h1
          aria-label={`${line1} ${line2}`}
          className="text-balance text-[clamp(2.75rem,11vw,9rem)] font-medium leading-[0.95] tracking-[-0.04em]"
        >
          <span aria-hidden="true" className="block">
            <RevealWords text={line1} delay={0.2} />
          </span>
          <span aria-hidden="true" className="block text-subtle">
            <RevealWords text={line2} delay={0.2 + firstLineWords * 0.07} />
          </span>
        </h1>

        <motion.p {...fadeIn(0.7)} className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {t("hero.description")}
        </motion.p>

        <motion.div {...fadeIn(0.85)} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a
            href="#projetos"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            {t("hero.ctaProjects")}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
          <a
            href="#contato"
            className="border-b border-primary/50 pb-0.5 text-sm font-medium text-primary transition-colors hover:border-primary"
          >
            {t("hero.contact")}
          </a>
          <a
            href={getCvUrl()}
            download
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            <FileDown className="size-3.5" aria-hidden="true" />
            {t("hero.downloadCV")}
          </a>
          <span className="flex items-center gap-1">
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-soft hover:text-foreground"
            >
              <GithubIcon className="size-4" />
            </a>
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-soft hover:text-foreground"
            >
              <LinkedinIcon className="size-4" />
            </a>
          </span>
        </motion.div>
      </div>

      {/* HUD do Haoqi: local, fuso, hora viva e disponibilidade. */}
      <motion.div {...fadeIn(1.1)} className="relative mx-auto w-full max-w-7xl px-4 pb-8 md:px-8">
        <div className="relative grid grid-cols-2 border-t border-line font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground md:grid-cols-4">
          <Cross className="-left-1.5 -top-1.5" />
          <Cross className="-right-1.5 -top-1.5" />
          <p className="py-4 pr-4">{t("hero.location")}</p>
          <p className="py-4 pr-4 md:border-l md:border-line md:pl-4">
            GMT-3 · <span className="sr-only">{t("hero.localTime")} </span>
            <time className="tabular-nums text-foreground/80" suppressHydrationWarning>{time}</time>
          </p>
          <p className="flex items-center gap-2 border-t border-line py-4 pr-4 md:border-l md:border-t-0 md:pl-4">
            <span className="relative flex size-2" aria-hidden="true">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            {t("hero.available")}
          </p>
          <p className="flex items-center justify-between gap-2 border-t border-line py-4 md:border-l md:border-t-0 md:pl-4">
            <span className="hidden lg:inline">{t("hero.facts")}</span>
            <a href="#projetos" className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground lg:ml-auto">
              {t("hero.scroll")}
              <ArrowDown className="size-3" aria-hidden="true" />
            </a>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
