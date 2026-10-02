"use client";

import { Marquee } from "@/components/ui/marquee";
import { useLanguage } from "@/contexts/LanguageContext";
import { STACK_ICONS } from "@/lib/stack-icons";

export function StackMarquee() {
  const { t } = useLanguage();

  return (
    <section aria-label={t("stack.label") as string} className="relative border-y border-line py-6">
      <p className="mono-label mx-auto mb-4 max-w-7xl px-4 md:px-8">{t("stack.label")}</p>
      <Marquee
        pauseOnHover
        repeat={2}
        className="[--duration:45s] [--gap:3rem] [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]"
      >
        {STACK_ICONS.map((icon) => (
          <span key={icon.slug} className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground">
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
              <path d={icon.path} />
            </svg>
            <span className="whitespace-nowrap font-mono text-xs uppercase tracking-widest">{icon.title}</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
