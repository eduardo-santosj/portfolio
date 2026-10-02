"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

/** Cruz "+" nas quinas das seções, herança do grid técnico do Haoqi. */
export function Cross({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("pointer-events-none absolute size-3 text-faint", className)}>
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
    </span>
  );
}

interface SectionHeaderProps {
  index: string;
  label: string;
  title: string;
  muted?: string;
  aside?: React.ReactNode;
  className?: string;
}

/**
 * Cabeçalho padrão das seções: linha fina no topo com cruzes, rótulo mono
 * numerado e título display com a segunda parte em cinza.
 */
export function SectionHeader({ index, label, title, muted, aside, className }: SectionHeaderProps) {
  return (
    <div className={cn("relative border-t border-line pt-10 md:pt-14", className)}>
      <Cross className="-left-1.5 -top-1.5" />
      <Cross className="-right-1.5 -top-1.5" />
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mono-label mb-5">
            <span className="text-primary">{index}</span>
            <span className="mx-2 text-faint">/</span>
            {label}
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl text-balance text-4xl font-medium tracking-tight md:text-6xl"
          >
            {title}
            {muted ? <span className="text-subtle"> {muted}</span> : null}
          </motion.h2>
        </div>
        {aside}
      </div>
    </div>
  );
}
