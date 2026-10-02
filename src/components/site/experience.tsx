"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";

import { useLanguage } from "@/contexts/LanguageContext";

import { SectionHeader } from "./section-header";

function AboutColumn() {
  const { t } = useLanguage();
  const paragraphs = t("experience.about") as string[];
  const facts = [
    { label: t("experience.education"), value: t("experience.educationText") },
    { label: t("experience.languages"), value: t("experience.languagesList") },
    { label: t("experience.availability"), value: t("experience.availabilityText") },
  ];

  return (
    <aside className="flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start">
      <div>
        <h3 className="mono-label mb-4">{t("experience.aboutTitle")}</h3>
        <div className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
          {paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? "text-base text-foreground/90" : undefined}>
              {p}
            </p>
          ))}
        </div>
      </div>
      <dl className="flex flex-col border-t border-line">
        {facts.map((fact) => (
          <div key={fact.label as string} className="grid gap-1 border-b border-line py-4">
            <dt className="mono-label">{fact.label}</dt>
            <dd className="text-sm text-foreground/80">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

export function ExperienceSection() {
  const { t, getExperience } = useLanguage();
  const timelineRef = useRef<HTMLOListElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start 75%", "end 60%"] });
  const lineScale = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section id="experiencia" className="relative mx-auto max-w-7xl scroll-mt-8 px-4 py-20 md:px-8 md:py-28">
      <SectionHeader index="05" label={t("experience.label") as string} title={t("experience.title") as string} />

      <div className="mt-12 grid gap-14 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <AboutColumn />

        <ol ref={timelineRef} className="relative flex flex-col gap-12 pl-8">
          {/* Linha base e linha âmbar que se desenha conforme o scroll. */}
          <span aria-hidden="true" className="absolute bottom-2 left-[5px] top-2 w-px bg-edge" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: reduceMotion ? 1 : lineScale }}
            className="absolute bottom-2 left-[5px] top-2 w-px origin-top bg-primary"
          />

          {getExperience().map((job, i) => (
            <motion.li
              key={`${job.company}-${job.period}`}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <span
                aria-hidden="true"
                className="absolute -left-8 top-1.5 size-[11px] rounded-full border-2 border-background bg-primary ring-1 ring-primary/40"
              />
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                <span className={i < 2 ? "text-primary" : undefined}>{job.period}</span>
                {job.local ? <span> · {job.local}</span> : null}
              </p>
              <h3 className="mt-2 text-xl font-medium tracking-tight md:text-2xl">{job.company}</h3>
              <p className="mt-1 text-sm text-foreground/70">{job.role}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{job.summary}</p>
              <ul className="mt-4 flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
                {job.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-faint" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
