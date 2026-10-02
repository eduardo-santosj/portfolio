"use client";

import { motion } from "framer-motion";

import { NumberTicker } from "@/components/ui/number-ticker";
import { useLanguage } from "@/contexts/LanguageContext";

import { Cross, SectionHeader } from "./section-header";

// Só fatos publicados no LinkedIn: 9 anos, +40% CWV, 4 anos e 7 meses em apostas, +500 competições.
const STATS = [
  { key: "years", value: 9, prefix: "", suffix: "" },
  { key: "cwv", value: 40, prefix: "+", suffix: "%" },
  { key: "betting", value: 4, prefix: "", suffix: "" },
  { key: "competitions", value: 500, prefix: "+", suffix: "" },
] as const;

export function Numbers() {
  const { t } = useLanguage();

  return (
    <section id="numeros" className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
      <SectionHeader index="03" label={t("numbers.label") as string} title={t("numbers.title") as string} />
      <dl className="relative mt-12 grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
        <Cross className="-left-1.5 -top-1.5" />
        <Cross className="-right-1.5 -top-1.5" />
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col-reverse gap-3 border-b border-line py-8 sm:px-6 sm:odd:border-r sm:odd:pl-0 lg:border-b-0 lg:border-r lg:first:pl-0 lg:last:border-r-0"
          >
            <dt className="max-w-[16rem] text-sm text-muted-foreground">{t(`numbers.${stat.key}`)}</dt>
            <dd className="text-6xl font-medium tracking-tight md:text-7xl">
              {stat.prefix && <span className="text-primary">{stat.prefix}</span>}
              <NumberTicker value={stat.value} />
              {stat.suffix && <span className="text-primary">{stat.suffix}</span>}
            </dd>
          </motion.div>
        ))}
      </dl>
    </section>
  );
}
