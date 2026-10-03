"use client";

import { motion } from "framer-motion";
import { Boxes, Gauge, Layers, LayoutTemplate, ShieldCheck, Users } from "lucide-react";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { BorderBeam } from "@/components/ui/border-beam";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

import { SectionHeader } from "./section-header";

const ICONS: Record<string, React.ElementType> = {
  architecture: LayoutTemplate,
  performance: Gauge,
  "design-system": Layers,
  integration: Boxes,
  leadership: Users,
  quality: ShieldCheck,
};

// Layout do bento (Dipa): peças largas alternando com peças estreitas.
const SPANS: Record<string, string> = {
  architecture: "md:col-span-2",
  performance: "md:col-span-1",
  "design-system": "md:col-span-1",
  integration: "md:col-span-1",
  leadership: "md:col-span-1",
  quality: "md:col-span-1",
};

function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li key={tag} className="rounded-full border border-edge px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-foreground/60">
          {tag}
        </li>
      ))}
    </ul>
  );
}

export function Services() {
  const { t, getServices } = useLanguage();
  const services = getServices();
  const skills = t("services.skills") as string[];

  return (
    <section id="servicos" className="relative mx-auto max-w-7xl scroll-mt-8 px-4 py-20 md:px-8 md:py-28">
      <SectionHeader index="04" label={t("services.label") as string} title={t("services.title") as string} />

      <BentoGrid className="mt-12">
        {services.map((service, i) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className={cn("flex", SPANS[service.id])}
          >
            <BentoCard
              name={service.title}
              description={service.desc}
              Icon={ICONS[service.id]}
              className="w-full"
              background={
                service.id === "performance" ? (
                  <span className="pointer-events-none absolute right-5 top-5 font-mono text-5xl font-medium text-primary/90">+40%</span>
                ) : service.id === "architecture" ? (
                  <div className="glow-amber pointer-events-none absolute -right-24 -top-24 size-80" />
                ) : null
              }
            >
              <Tags tags={service.tags} />
              {service.id === "quality" ? <BorderBeam size={90} duration={8} colorFrom="var(--primary)" colorTo="var(--beam-to)" /> : null}
            </BentoCard>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex md:col-span-2"
        >
          <div className="w-full rounded-2xl border border-edge bg-card p-6">
            <h3 className="mono-label mb-4">{t("services.stackTitle")}</h3>
            <ul className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <li key={skill} className="rounded-md border border-edge bg-soft px-2.5 py-1 font-mono text-xs text-foreground/80">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </BentoGrid>
    </section>
  );
}
