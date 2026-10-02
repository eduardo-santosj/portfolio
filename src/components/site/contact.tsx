"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { PROFILE } from "@/lib/profile";

import { GithubIcon, LinkedinIcon } from "./icons";
import { SectionHeader } from "./section-header";

const fieldClass =
  "h-12 rounded-xl border-edge bg-soft px-4 text-base placeholder:text-subtle focus-visible:border-primary/60 focus-visible:ring-primary/20 md:text-sm";

export function Contact() {
  const { t } = useLanguage();

  const formSchema = z.object({
    name: z.string().min(2, { message: t("contact.form.nameError") as string }),
    email: z.string().email({ message: t("contact.form.emailError") as string }),
    message: z.string().min(10, { message: t("contact.form.messageError") as string }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        form.reset();
        toast.success(t("contact.form.successTitle") as string, {
          description: t("contact.form.successDesc") as string,
          duration: 5000,
        });
      } else {
        toast.error(t("contact.form.error") as string);
      }
    } catch {
      toast.error(t("contact.form.error") as string);
    }
  }

  const links = [
    { href: `mailto:${PROFILE.email}`, label: PROFILE.email, Icon: Mail, external: false },
    { href: PROFILE.linkedin, label: "LinkedIn", Icon: LinkedinIcon, external: true },
    { href: PROFILE.github, label: "GitHub", Icon: GithubIcon, external: true },
  ];

  const submitting = form.formState.isSubmitting;

  return (
    <section id="contato" className="relative mx-auto max-w-7xl scroll-mt-8 px-4 py-20 md:px-8 md:py-28">
      <div aria-hidden="true" className="glow-amber pointer-events-none absolute bottom-0 left-1/2 size-[50rem] -translate-x-1/2 opacity-50" />
      <SectionHeader index="06" label={t("contact.label") as string} title={t("contact.title") as string} />

      <div className="relative mt-12 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div className="flex flex-col gap-8">
          <p className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">{t("contact.subtitle")}</p>
          <div>
            <h3 className="mono-label mb-3">{t("contact.direct")}</h3>
            <ul className="flex flex-col border-t border-line">
              {links.map(({ href, label, Icon, external }) => (
                <li key={href} className="border-b border-line">
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center justify-between gap-3 py-4 text-sm text-foreground/85 transition-colors hover:text-primary"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate">{label}</span>
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-edge bg-card/80 p-5 backdrop-blur sm:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mono-label">{t("contact.form.name") as string}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("contact.form.name") as string} autoComplete="name" className={fieldClass} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mono-label">{t("contact.form.email") as string}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder={t("contact.form.email") as string} autoComplete="email" className={fieldClass} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mono-label">{t("contact.form.message") as string}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("contact.form.message") as string}
                        className="min-h-40 rounded-xl border-edge bg-soft px-4 py-3 text-base placeholder:text-subtle focus-visible:border-primary/60 focus-visible:ring-primary/20 md:text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-fit"
              >
                {submitting ? t("contact.form.sending") : t("contact.form.send")}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
