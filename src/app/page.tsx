/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useScroll, useSpring } from "framer-motion";
import { ExternalLink, FileDown, Languages, Mail, Moon, Sun } from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import "./globals.css";

const PROFILE = {
  nome: "Eduardo dos Santos Jacinto",
  titulo: "Desenvolvedor Web | React • Node • Frontend",
  local: "Santa Catarina, Brasil",
  email: "eduardosantosj2@gmail.com",
  telefone: "+55 (11) 97047-4352",
  github: "https://github.com/eduardo-santosj",
  linkedin: "https://www.linkedin.com/in/eduardo-dos-santos-jacinto-aa330010a/",
  site: "https://eduardojacinto.dev",
  avatar: "/images/edu-perfil.jpg",
  cvUrl: "/cv.pdf",
};

const SKILLS = ["React","Next.js","TypeScript","Tailwind CSS","Node.js","WordPress","VTEX","Java","PHP","C#","MySQL","MongoDB","Azure","Git"];

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, viewport: { once: true, amount: 0.2 } };

function Section({ id, className = "", children }: Readonly<{ id: string; className?: string; children: React.ReactNode }>) {
  return <section id={id} className={`scroll-mt-24 py-10 md:py-20 ${className}`}>{children}</section>;
}

function ThemeToggle() {
  const [dark, setDark] = useState(true);
  const { t } = useLanguage();
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);
  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={() => setDark(!dark)}
      aria-label={dark ? t("a11y.lightTheme") as string : t("a11y.darkTheme") as string}
    >
      {dark ? <Sun className="h-5 w-5"/> : <Moon className="h-5 w-5"/>}
    </Button>
  );
}

function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={() => setLanguage(language === "pt" ? "en" : "pt")}
      aria-label={language === "pt" ? "Switch to English" : "Mudar para Português"}
    >
      <Languages className="h-5 w-5"/>
    </Button>
  );
}


export default function Page(){
  const { t, getServices, getProjects, getExperience, getCvUrl } = useLanguage();
  const sections = ["inicio","sobre","servicos","projetos","experiencia","contato"];
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [busca,setBusca] = useState("");
  
  const projetos = getProjects();
  const projetosFiltrados = useMemo(()=>{
    return projetos.filter(p => {
      const searchText = [p.title, p.desc, p.stack.join(" "), p.tags.join(" ")].join(" ").toLowerCase();
      return searchText.includes(busca.toLowerCase());
    });
  },[busca, projetos]);

  const formSchema = z.object({
    name: z.string().min(2, { message: t("contact.form.nameError") as string }),
    email: z.string().email({ message: t("contact.form.emailError") as string }),
    message: z.string().min(10, { message: t("contact.form.messageError") as string }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        form.reset();
        toast.success(t("contact.form.successTitle") as string, {
          description: t("contact.form.successDesc") as string,
          duration: 5000,
        });
      } else {
        toast.error("Erro ao enviar mensagem");
      }
    } catch (error) {
      toast.error("Erro ao enviar mensagem");
    }
  }
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-muted/30 dark:from-zinc-950 dark:to-zinc-900">
      {/* Skip to content para acessibilidade */}
      <a href="#inicio" className="sr-only focus:not-sr-only">
        {t("a11y.skipToContent")}
      </a>
      
      <motion.div style={{ scaleX }} className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-primary" aria-hidden="true" />

      {/* HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur border-b supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-950/60">
        <div className="container flex items-center justify-between py-3 px-4 w-full mx-auto my-0">
          <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src={PROFILE.avatar} alt="Foto de perfil de Eduardo dos Santos Jacinto"/>
              <AvatarFallback>{PROFILE.nome[0]}</AvatarFallback>
            </Avatar>
            <span className="font-semibold">{PROFILE.nome}</span>
          </div>
          <nav className="hidden md:flex gap-2" aria-label="Navegação principal">
            {sections.map(id => <a key={id} href={`#${id}`} className="px-3 py-2 rounded-full text-sm hover:bg-black/5 dark:hover:bg-white/10 capitalize">{t(`nav.${id}`)}</a>)}
          </nav>
          <div className="flex gap-2 items-center">
            <LanguageToggle/>
            <ThemeToggle/>
            <Button asChild><a href={getCvUrl()} download className="flex items-center gap-2"><FileDown className="h-4 w-4"/> {t("hero.downloadCV")}</a></Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-8">


      {/* HERO */}
      <Section id="inicio">
        <div className="container grid md:grid-cols-2 gap-8 items-center">
          <motion.div {...fadeUp}>
            <p className="text-lg mb-2">{t("hero.greeting")}</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{PROFILE.nome}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{t("hero.description")}</p>
            <div className="flex gap-3 flex-wrap">
              <Button asChild className="text-base"><a href="#contato" className="flex items-center gap-2"><Mail className="h-5 w-5"/> {t("hero.contact")}</a></Button>
              <Button asChild variant="outline"><a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2"><GithubIcon className="h-5 w-5"/> GitHub</a></Button>
              <Button asChild variant="outline"><a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2"><LinkedinIcon className="h-5 w-5"/> LinkedIn</a></Button>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* SOBRE */}
      <Section id="sobre">
        <div className="container">
          <motion.h2 {...fadeUp} className="text-3xl font-bold mb-6">{t("about.title")}</motion.h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">{t("about.description")}</p>
          
          <h3 className="text-xl font-semibold mb-3">{t("about.skills")}</h3>
          <div className="text-gray-700 dark:text-gray-300 mb-6 space-y-1">
            {(t("about.skillsDesc") as string[]).map((skill, i) => <p key={i}>{skill}</p>)}
          </div>
          
          <h3 className="text-xl font-semibold mb-3">{t("about.workStyle")}</h3>
          <div className="text-gray-700 dark:text-gray-300 mb-6 space-y-1">
            {(t("about.workStyleDesc") as string[]).map((style, i) => <p key={i}>• {style}</p>)}
          </div>
          
          <h3 className="text-xl font-semibold mb-3">{t("about.languages")}</h3>
          <p className="text-gray-700 dark:text-gray-300">{t("about.languagesList")}</p>
        </div>
      </Section>

      {/* SERVIÇOS */}
      <Section id="servicos" className="bg-muted/40 dark:bg-zinc-900/40">
        <div className="container px-3">
          <motion.h2 {...fadeUp} className="text-3xl font-bold mb-6">{t("services.title")}</motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {getServices().map((s, i) => (
              <motion.div key={i} {...fadeUp}>
                <div className="border border-black/10 dark:border-white/10 rounded-3xl bg-white dark:bg-zinc-900 h-full p-5 flex flex-col gap-5 justify-between">
                  <div className="flex items-center">
                    <CardTitle className="flex items-center text-xl p-0 gap-1"><span>{s.icon}</span>{s.title}</CardTitle>
                  </div>
                  <CardContent className="text-gray-600 dark:text-gray-300">{s.desc}</CardContent>
                  <CardFooter className="flex flex-wrap gap-2">{s.tags.map(tag=><Badge key={tag}>{tag}</Badge>)}</CardFooter>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* PROJETOS */}
      <Section id="projetos">
        <div className="container">
          <motion.h2 {...fadeUp} className="text-3xl font-bold mb-6">{t("projects.title")}</motion.h2>
          <div className="mb-6">
            <Input
              placeholder={t("projects.search") as string}
              aria-label={t("a11y.searchProjects") as string}
              value={busca}
              onChange={(e)=>setBusca(e.target.value)}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {projetosFiltrados.map((p, i) => (
              <motion.div key={i} {...fadeUp}>
                <div className="rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 h-full pb-3">
                  <Image 
                    src={p.capa} 
                    alt={`Screenshot do projeto ${p.title}`} 
                    width={400} 
                    height={192} 
                    className="h-48 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-6">
                    <CardTitle className="text-xl">{p.title}</CardTitle>
                  </div>
                  <CardContent className="text-gray-600 dark:text-gray-300">{p.desc}</CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-2">{p.stack.map(s=><Badge key={s} variant="outline">{s}</Badge>)}</div>
                    <div className="flex gap-2">
                      {p.repo && <Button asChild variant="outline" className="text-sm"><a href={p.repo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2"><GithubIcon className="h-4 w-4"/> Repo</a></Button>}
                      {p.link && <Button asChild className="text-sm"><a href={p.link} target="_blank" rel="noopener noreferrer" aria-label={`${t("projects.viewProject") as string}: ${p.title}`} className="flex items-center gap-2">Live <ExternalLink className="h-4 w-4"/></a></Button>}
                    </div>
                  </CardFooter>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* EXPERIÊNCIA */}
      <Section id="experiencia" className="bg-muted/40 dark:bg-zinc-900/40">
        <div className="container">
          <motion.h2 {...fadeUp} className="text-3xl font-bold mb-6">{t("experience.title")}</motion.h2>
          <div className="grid gap-6">
            {getExperience().map((e, i) => (
              <motion.div key={i} {...fadeUp}>
                <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 pb-3">
                  <div className="p-6">
                    <CardTitle>{e.role} - {e.company}</CardTitle>
                  </div>
                  <CardContent className="text-sm text-gray-600 dark:text-gray-300">
                    <div className="mb-2">{e.period} | {e.local}</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {e.points.map((p, idx)=><li key={idx}>{p}</li>)}
                    </ul>
                  </CardContent>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CONTATO */}
      <Section id="contato">
        <div className="container">
          <motion.h2 {...fadeUp} className="text-3xl font-bold mb-6">{t("contact.title")}</motion.h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{t("contact.subtitle")}</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 pb-3">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="p-6">
                    <CardTitle>{t("contact.form.send")}</CardTitle>
                  </div>
                  <CardContent className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("contact.form.name") as string}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("contact.form.name") as string} {...field} />
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
                          <FormLabel>{t("contact.form.email") as string}</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder={t("contact.form.email") as string} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("contact.form.message") as string}</FormLabel>
                          <FormControl>
                            <Textarea placeholder={t("contact.form.message") as string} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="py-2">
                    <Button type="submit">{t("contact.form.send")}</Button>
                  </CardFooter>
                </form>
              </Form>
            </div>            
            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 pb-3">
              <div className="p-6">
                <CardTitle>{t("contact.title")}</CardTitle>
              </div>
              <CardContent className="grid gap-2 text-sm">
                <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="flex gap-2 items-center"><GithubIcon className="h-4 w-4"/>GitHub</a>
                <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="flex gap-2 items-center"><LinkedinIcon className="h-4 w-4"/>LinkedIn</a>
                <a href={`mailto:${PROFILE.email}`} className="flex gap-2 items-center"><Mail className="h-4 w-4"/>E-mail</a>
              </CardContent>
            </div>
          </div>
        </div>
      </Section>
      
      </div>

      {/* FOOTER */}
      <footer className="py-12 px-6">
        <div className="container flex items-center justify-between">
          <span className="text-sm opacity-70">© {new Date().getFullYear()} {PROFILE.nome}</span>
          <span className="text-sm opacity-70">{PROFILE.local}</span>
        </div>
      </footer>
      
      {/* Structured Data para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Eduardo dos Santos Jacinto",
            "jobTitle": "Full Stack Developer",
            "url": "https://edusantos.vercel.app",
            "sameAs": [
              "https://github.com/eduardo-santosj",
              "https://www.linkedin.com/in/eduardo-dos-santos-jacinto-aa330010a/"
            ],
            "address": {
              "@type": "PostalAddress",
              "addressRegion": "Santa Catarina",
              "addressCountry": "BR"
            },
            "email": "eduardosantosj2@gmail.com",
            "knowsAbout": ["React", "Next.js", "TypeScript", "Node.js", "Full Stack Development"],
            "alumniOf": {
              "@type": "EducationalOrganization",
              "name": "Sistemas de Informação"
            }
          })
        }}
      />
    </main>
  );
}
