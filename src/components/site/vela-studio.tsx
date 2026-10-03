"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Globe, Instagram, Mail, MessageCircle } from "lucide-react";
import Image from "next/image";

import { useLanguage } from "@/contexts/LanguageContext";
import { VELA } from "@/lib/profile";
import { cn } from "@/lib/utils";

import { SHOW_ALL_PROJECTS_EVENT } from "./projects";
import { Cross, SectionHeader } from "./section-header";

const STATUS_STYLE = {
  live: "text-live",
  dev: "text-primary",
  published: "text-published",
  delivered: "text-muted-foreground",
} as const;

/**
 * Vela Studio, a empresa do Eduardo: o que faz, fundação, produtos (os mesmos
 * cards da seção de projetos) e o contato comercial. Sem CNPJ nem endereço.
 */
export function VelaStudio() {
  const { t, getProjects } = useLanguage();
  // Lista curta: só os produtos no ar. O detalhe de cada um mora no card da seção Projetos.
  const products = getProjects().filter((p) => p.group === "vela" && p.status === "live");

  const links = [
    { href: VELA.site, label: t("vela.site"), value: "velastudio.com.br", Icon: Globe },
    { href: VELA.instagram, label: t("vela.instagram"), value: VELA.instagramHandle, Icon: Instagram },
    { href: VELA.whatsapp, label: t("vela.whatsapp"), value: VELA.whatsappLabel, Icon: MessageCircle },
    { href: `mailto:${VELA.email}`, label: t("vela.email"), value: VELA.email, Icon: Mail },
  ];

  return (
    <section id="vela" className="relative mx-auto max-w-7xl scroll-mt-8 px-4 py-20 md:px-8 md:py-28">
      <SectionHeader
        index="02"
        label={t("vela.label") as string}
        title={t("vela.title") as string}
        muted={t("vela.titleMuted") as string}
      />

      <div className="relative mt-12 overflow-hidden rounded-2xl border border-edge bg-card">
        <div aria-hidden="true" className="glow-amber pointer-events-none absolute -left-40 -top-40 size-[40rem] opacity-60" />

        <div className="relative grid gap-10 p-5 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:gap-14 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-8"
          >
            {/* Logo oficial: versão de fundo escuro no tema escuro e de fundo claro no claro. */}
            <a href={VELA.site} target="_blank" rel="noopener noreferrer" className="w-fit">
              <Image
                src="/images/vela/velastudio-horizontal-fundo-escuro.svg"
                alt={t("vela.logoAlt") as string}
                width={211}
                height={72}
                className="hidden h-14 w-auto dark:block"
              />
              <Image
                src="/images/vela/velastudio-horizontal-fundo-claro.svg"
                alt={t("vela.logoAlt") as string}
                width={211}
                height={72}
                className="h-14 w-auto dark:hidden"
              />
            </a>

            <p className="max-w-xl text-balance text-2xl font-medium leading-snug tracking-tight md:text-3xl">{t("vela.lead")}</p>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">{t("vela.body")}</p>

            <dl className="relative grid grid-cols-2 border-t border-line">
              <Cross className="-left-1.5 -top-1.5" />
              <div className="py-4 pr-4">
                <dt className="mono-label">{t("vela.founded")}</dt>
                <dd className="mt-1 text-lg font-medium">{t("vela.foundedValue")}</dd>
              </div>
              <div className="border-l border-line py-4 pl-4">
                <dt className="mono-label">{t("vela.base")}</dt>
                <dd className="mt-1 text-lg font-medium">{t("vela.baseValue")}</dd>
              </div>
            </dl>

            <a
              href={VELA.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 sm:w-fit"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              {t("vela.cta")}
            </a>
          </motion.div>

          <div className="flex flex-col gap-10">
            <div>
              <h3 className="mono-label mb-3">{t("vela.productsTitle")}</h3>
              <ul className="flex flex-col border-t border-line">
                {products.map((product) => (
                  <li key={product.id} className="border-b border-line">
                    <a
                      href={`#projeto-${product.id}`}
                      onClick={() => window.dispatchEvent(new Event(SHOW_ALL_PROJECTS_EVENT))}
                      className="group flex items-center justify-between gap-3 py-3 text-sm transition-colors hover:text-primary"
                    >
                      <span className="truncate">{product.title}</span>
                      <span className={cn("flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em]", STATUS_STYLE[product.status])}>
                        <span aria-hidden="true">●</span>
                        {t(`projects.status.${product.status}`)}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mono-label mb-3">{t("vela.linksTitle")}</h3>
              <ul className="flex flex-col border-t border-line">
                {links.map(({ href, label, value, Icon }) => (
                  <li key={href} className="border-b border-line">
                    <a
                      href={href}
                      {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex items-center justify-between gap-3 py-3 text-sm transition-colors hover:text-primary"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <Icon className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
                        <span className="sr-only">{label}: </span>
                        <span className="truncate">{value}</span>
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground" aria-hidden="true">
                        {label}
                        <ArrowUpRight className="size-3.5" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
