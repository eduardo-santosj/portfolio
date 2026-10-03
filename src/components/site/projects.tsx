"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, Plus, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { useLanguage, type Project, type ProjectGroup } from "@/contexts/LanguageContext";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

import { SectionHeader } from "./section-header";

type Filter = "all" | ProjectGroup;

export const SHOW_ALL_PROJECTS_EVENT = "portfolio:show-all-projects";

const STATUS_STYLE: Record<Project["status"], string> = {
  live: "text-live",
  dev: "text-primary",
  published: "text-published",
  delivered: "text-muted-foreground",
};

function hostOf(url: string) {
  try {
    const { host, pathname } = new URL(url);
    return host + pathname.replace(/\/$/, "");
  } catch {
    return "";
  }
}

/**
 * Card sem screenshot (Design System, que não tem página pública, e qualquer
 * print que falhar): tokens e componentes desenhados em CSS, no tom do site.
 */
function PreviewPlaceholder({ project }: { project: Project }) {
  const { t } = useLanguage();
  const swatches = ["var(--primary)", "var(--foreground)", "var(--subtle)", "var(--accent)", "var(--status-live)", "var(--status-published)"];

  return (
    <div className="relative flex h-full w-full flex-col justify-between gap-4 overflow-hidden bg-inset bg-[linear-gradient(to_right,var(--line)_1px,transparent_1px),linear-gradient(to_bottom,var(--line)_1px,transparent_1px)] bg-[size:32px_32px] p-5 sm:p-7">
      <div className="flex flex-wrap gap-2" aria-hidden="true">
        {swatches.map((c) => (
          <span key={c} className="size-7 rounded-md border border-edge sm:size-9" style={{ background: c }} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3" aria-hidden="true">
        <span className="flex h-9 items-center justify-center rounded-full bg-primary font-mono text-[11px] font-semibold uppercase text-primary-foreground">Button</span>
        <span className="flex h-9 items-center justify-center rounded-full border border-edge font-mono text-[11px] uppercase text-foreground/80">Outline</span>
        <span className="col-span-2 flex h-9 items-center rounded-md border border-edge bg-soft px-3 font-mono text-[11px] text-muted-foreground">Input · placeholder</span>
        <span className="flex h-7 w-fit items-center gap-2 rounded-full border border-edge px-3 font-mono text-[10px] uppercase text-muted-foreground">
          <span className="size-1.5 rounded-full bg-live" /> Badge
        </span>
        <span className="flex h-7 items-center justify-end">
          <span className="relative h-5 w-9 rounded-full bg-primary">
            <span className="absolute right-0.5 top-0.5 size-4 rounded-full bg-background" />
          </span>
        </span>
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">{project.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("projects.noPreview")}</p>
      </div>
    </div>
  );
}

function BrowserMockup({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);
  const host = hostOf(project.link);
  const showImage = Boolean(project.capa) && !failed;

  return (
    <div className="overflow-hidden rounded-xl border border-edge bg-inset shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-3 border-b border-edge px-3 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-faint" />
          <span className="size-2.5 rounded-full bg-faint" />
          <span className="size-2.5 rounded-full bg-faint" />
        </span>
        <span className="min-w-0 flex-1 truncate rounded-md bg-soft px-3 py-1 text-center font-mono text-[10px] text-muted-foreground">
          {host || "npm · @eduardo-santosj/ui"}
        </span>
      </div>
      <div className="relative aspect-[16/10]">
        {showImage ? (
          <Image
            src={project.capa}
            alt={`Screenshot do projeto ${project.title}`}
            fill
            sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw"
            className="object-cover object-top"
            onError={() => setFailed(true)}
          />
        ) : (
          <PreviewPlaceholder project={project} />
        )}
      </div>
    </div>
  );
}

interface CardProps {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
  animate: boolean;
}

/** Bloco do card com rótulo mono numerado ("01 / PROBLEMA"). */
function Block({ n, label, children }: { n: number; label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span className="text-primary">{String(n).padStart(2, "0")}</span>
        <span className="mx-1.5 text-faint">/</span>
        {label}
      </dt>
      <dd className="mt-1.5 text-sm leading-relaxed text-foreground/80">{children}</dd>
    </div>
  );
}

function ProjectCard({ project, index, total, progress, animate }: CardProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const detailsId = `projeto-${project.id}-detalhes`;
  // Cada card encolhe um pouco conforme os próximos sobem por cima dele.
  const targetScale = 1 - (total - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  return (
    <div id={`projeto-${project.id}`} className="scroll-mt-8 md:sticky md:top-0 md:flex md:h-screen md:items-center">
      <motion.article
        style={animate ? { scale, top: index * 14 } : undefined}
        className="relative w-full origin-top overflow-hidden rounded-2xl border border-edge bg-card"
      >
        <div aria-hidden="true" className="glow-amber pointer-events-none absolute -right-40 -top-40 size-[30rem] opacity-40" />
        <div className="relative grid gap-8 p-5 sm:p-8 md:grid-cols-[1fr_1.15fr] md:items-center md:gap-10 md:p-10">
          <div className="flex min-w-0 flex-col gap-5">
            <div className="flex items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.16em]">
              <span className="text-muted-foreground">
                <span className="text-foreground">{String(index + 1).padStart(2, "0")}</span>
                <span className="mx-1.5 text-faint">/</span>
                {t(`projects.groups.${project.group}`)}
              </span>
              <span className={cn("flex items-center gap-1.5", STATUS_STYLE[project.status])}>
                <span aria-hidden="true">●</span>
                {t(`projects.status.${project.status}`)}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-medium tracking-tight sm:text-3xl md:text-4xl">{project.title}</h3>
              <p className="text-base leading-snug text-muted-foreground">{project.short}</p>
            </div>
            <dl>
              <Block n={1} label={t("projects.blocks.problem") as string}>
                {project.problem}
              </Block>
            </dl>
            <ul className="flex flex-wrap gap-2" aria-label="Stack">
              {project.stack.map((s) => (
                <li key={s} className="rounded-full border border-edge px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-foreground/70">
                  {s}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={detailsId}
                onClick={() => setOpen((v) => !v)}
                className="group inline-flex w-fit items-center gap-1.5 rounded-full border border-edge px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {open ? t("projects.hideDetails") : t("projects.showDetails")}
                {open ? <X className="size-3.5" aria-hidden="true" /> : <Plus className="size-3.5" aria-hidden="true" />}
              </button>
              {project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t("projects.viewProject") as string}: ${project.title}`}
                  className="group inline-flex w-fit items-center gap-1.5 border-b border-primary/40 pb-0.5 text-sm font-medium text-primary transition-colors hover:border-primary"
                >
                  {t("projects.viewProject")}
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </div>

          {/* Fechado: print. Aberto: solução, como fiz e resultado ocupam o lugar do print,
              para o card não crescer além da tela no efeito de cards empilhados. */}
          <div className="relative min-w-0">
            <div className={cn(open && "hidden md:invisible md:block")} aria-hidden={open || undefined}>
              <BrowserMockup project={project} />
            </div>
            <div
              id={detailsId}
              hidden={!open}
              data-lenis-prevent
              className="rounded-xl border border-edge bg-inset p-5 sm:p-6 md:absolute md:inset-0 md:overflow-y-auto"
            >
              <dl className="flex flex-col gap-5">
                <Block n={2} label={t("projects.blocks.solution") as string}>
                  {project.solution}
                </Block>
                <Block n={3} label={t("projects.blocks.how") as string}>
                  {project.how}
                </Block>
                {project.result ? (
                  <Block n={4} label={t("projects.blocks.result") as string}>
                    {project.result}
                  </Block>
                ) : null}
              </dl>
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export function Projects() {
  const { t, getProjects } = useLanguage();
  const [filter, setFilter] = useState<Filter>("all");
  const containerRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  const projects = getProjects();
  const visible = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.group === filter)),
    [filter, projects],
  );

  const filters: Filter[] = ["all", "vela", "career"];

  // Links de outras seções para um card (ex.: produtos da Vela) limpam o filtro,
  // senão o card pedido pode estar escondido. O Lenis intercepta a âncora sem
  // mudar o hash, por isso o aviso vem por evento.
  useEffect(() => {
    const showAll = () => setFilter("all");
    window.addEventListener(SHOW_ALL_PROJECTS_EVENT, showAll);
    return () => window.removeEventListener(SHOW_ALL_PROJECTS_EVENT, showAll);
  }, []);

  return (
    <section id="projetos" className="relative mx-auto max-w-7xl scroll-mt-8 px-4 py-20 md:px-8 md:py-28">
      <SectionHeader
        index="01"
        label={t("projects.label") as string}
        title={t("projects.title") as string}
        aside={
          <div className="flex flex-col gap-4 md:max-w-sm md:items-end md:text-right">
            <p className="text-sm text-muted-foreground">{t("projects.subtitle")}</p>
            <div role="group" aria-label={t("projects.filterLabel") as string} className="flex w-fit gap-1 rounded-full border border-edge p-1">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors",
                    filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t(`projects.filters.${f}`)}
                </button>
              ))}
            </div>
          </div>
        }
      />

      <div ref={containerRef} className="mt-12 flex flex-col gap-6 md:mt-4 md:gap-0">
        {visible.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            total={visible.length}
            progress={scrollYProgress}
            animate={isDesktop && !reduceMotion}
          />
        ))}
      </div>
    </section>
  );
}
