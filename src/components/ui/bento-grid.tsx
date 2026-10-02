// Origem: Magic UI bento-grid (o mesmo publicado no 21st.dev), adaptado ao tema
// escuro do portfolio: ícones do lucide, tokens do tema, CTA opcional e slot de conteúdo.
import { type ComponentPropsWithoutRef, type ReactNode } from "react"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string
  className?: string
  background?: ReactNode
  Icon?: React.ElementType
  description: string
  href?: string
  cta?: string
  children?: ReactNode
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[minmax(14rem,auto)] grid-cols-1 gap-3 md:grid-cols-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  children,
  ...props
}: BentoCardProps) => (
  <div
    className={cn(
      "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-edge bg-card",
      "transform-gpu [box-shadow:var(--shadow-inset)]",
      className
    )}
    {...props}
  >
    {background ? <div aria-hidden="true">{background}</div> : null}
    <div className="relative z-10 flex flex-1 flex-col gap-3 p-6">
      {Icon ? (
        <Icon className="size-9 origin-left text-primary transition-transform duration-300 ease-out group-hover:scale-90" aria-hidden="true" />
      ) : null}
      <h3 className="mt-auto text-xl font-medium tracking-tight text-foreground">{name}</h3>
      <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">{description}</p>
      {children}
      {href && cta ? (
        <a href={href} className="mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary">
          {cta}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </a>
      ) : null}
    </div>
    <div className="pointer-events-none absolute inset-0 transition-colors duration-300 group-hover:bg-soft" />
  </div>
)

export { BentoCard, BentoGrid }
