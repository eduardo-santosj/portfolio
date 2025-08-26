/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useScroll, useSpring } from "framer-motion";
import { ExternalLink, FileDown, Github, Linkedin, Mail, Moon, Sun } from "lucide-react";
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
  initial:'Transformando ideias em código. Experiências web modernas e performáticas que impactam positivamente os negócios. Vamos construir algo incrível juntos?',
  sobre:
    "Sou desenvolvedor web com 7+ anos de experiência em projetos digitais, atuando principalmente com React, Next.js, Node.js e WordPress. Tenho sólida formação em Sistemas de Informação e Técnico em Informática, além de experiência em empresas de tecnologia, comunicação e apostas esportivas. Meu foco é entregar soluções performáticas, escaláveis e que tragam valor real ao negócio.",
  email: "eduardosantosj2@gmail.com",
  telefone: "+55 (11) 97047-4352",
  github: "https://github.com/eduardo-santosj",
  linkedin: "https://www.linkedin.com/in/eduardo-dos-santos-jacinto-aa330010a/",
  site: "https://eduardojacinto.dev",
  avatar: "/images/edu-perfil.jpg",
  cvUrl: "/cv.pdf",
};

const SERVICOS = [
  { icon: "🧩", titulo: "Desenvolvimento Web", desc: "Aplicações modernas com React, Next.js, Tailwind e Node.js.", tags: ["React","Next.js","Node.js","Tailwind"] },
  { icon: "⚡", titulo: "Performance & SEO", desc: "Melhoria de Core Web Vitals, acessibilidade e SEO.", tags: ["CWV","A11y","SEO","SSR"] },
  { icon: "🧠", titulo: "Consultoria & Freelance", desc: "Arquitetura, levantamento de requisitos e entregas escaláveis.", tags: ["Consultoria","Arquitetura","Freelance"] },
];

const PROJETOS = [
  {titulo: "Suprema Gaming & Co.", descricao: "Plataforma de apostas esportivas desenvolvida com React e integração BetConstruct, incluindo CMS para gestão de afiliados, análise de performance e distribuição de conteúdo. Infraestrutura escalável na AWS.", capa: "/images/projetos/suprema.png", link: "https://suprema.bet.br", repo: "", stack: ["React", "Next.js","AWS"], tags: ["gaming","react"] },
  {titulo: "Cobasi & SPet (Accurate Software)", descricao: "Desenvolvimento do e-commerce Cobasi com React, VTEX e SASS, incluindo sistema SPet para agendamentos de serviços pet. Implementação de componentes reutilizáveis e otimização que melhorou Core Web Vitals em 40%.", capa: "/images/projetos/cobasi.png", link: "https://www.cobasi.com.br", repo: "", stack: ["React","Node.js","Vtex"], tags: ["ecommerce","pet"]},
  { titulo: "GM Propostas Comerciais (Accurate Software)", descricao: "Desenvolvimento do sistema GM Propostas para financiamento e compra de veículos com consultas de CPF/CNPJ e endereço. Integração com APIs de seguradoras e DocuSign para assinatura digital de contratos.", capa: "/images/projetos/chevrolet.png", link: "https://chevroletdigital.com.br", repo: "", stack: ["React","Java"], tags: ["automotivo","enterprise"] } 
  // { titulo: "Arena22", descricao: "Plataforma de apostas esportivas em React + Azure.", capa: "/projetos/arena22.webp", link: "", repo: "", stack: ["React","Azure"], tags: ["apostas","react"] },
];

const EXPERIENCIA = [
  { 
    empresa: "Suprema Gaming & Co.", 
    cargo: "Desenvolvedor Web", 
    periodo: "Jul/2023 – Atual", 
    local: "Remoto", 
    pontos: [
      "Desenvolvimento de sites de apostas utilizando React, Tailwind CSS, shadcn/ui e integração com BetConstruct.",
      "Criação de interfaces modernas e responsivas com foco em UX e performance.",
      "Manutenção e implementação de novas features em plataformas AWS.",
      "Implementação de layouts seguindo design system e protótipos do Figma.",
      "Desenvolvimento guiado por testes com Cypress para garantir qualidade."
    ]
  },
  { 
    empresa: "Arena22",
    cargo: "Desenvolvedor Web",
    periodo: "Out/2021 – Jul/2023",
    local: "São Paulo, SP",
    pontos: [
      "Site de fantasy games com montagem de times e bolões de campeonatos.",
      "Arquitetura escalável em React + Azure.",
      "Desenvolvimento de interfaces seguindo protótipos do Figma e padrões de UX.",
      "Testes end-to-end com Cypress para validação de fluxos."
    ]
  },
  { 
    empresa: "Accurate Software", 
    cargo: "Desenvolvedor Web", 
    periodo: "Mai/2019 – Out/2021", 
    local: "São Paulo, SP", 
    pontos: [
      "Desenvolvimento do sistema GM Propostas para financiamento e compra de veículos com consultas de CPF/CNPJ e endereço.",
      "Integração com APIs de seguradoras e DocuSign para assinatura digital de contratos.",
      "Desenvolvimento do e-commerce Cobasi com React, VTEX, SASS e integração com APIs REST.",
      "Criação do sistema SPet para agendamento de serviços pet usando React, Node.js e MongoDB.",
      "Implementação de boas práticas de código e componentes reutilizáveis seguindo design system.",
      "Otimização de performance e SEO do e-commerce resultando em melhoria de 40% no Core Web Vitals."
    ]
  },
  {
    empresa: "Superare",
    cargo: "Desenvolvedor Web", 
    periodo: "Nov/2017 – Mai/2019", 
    local: "São Paulo, SP",
    pontos: [
      "Desenvolvimento de landing pages responsivas e otimizadas para conversão para grandes clientes como Claro e Net",
      "Implementação de soluções utilizando stack técnica: Jade (Pug) para templates, SCSS para estilização, Gulp para automação de build, JavaScript vanilla e WordPress como CMS"
    ]
  },
  { 
    empresa: "Studio Visual", 
    cargo: "Dev Web / WordPress", 
    periodo: "Mai/2017 – Nov/2017", 
    local: "São Paulo, SP", 
    pontos: ["Desenvolvimento de sites utilizando WordPress, WooCommerce, HTML5, CSS3, PHP e JavaScript", "Implementação de interfaces responsivas seguindo padrões web e boas práticas de UI/UX"]
  },
];

const SKILLS = ["React","Next.js","TypeScript","Tailwind CSS","Node.js","WordPress","VTEX","Java","PHP","C#","MySQL","MongoDB","Azure","Git"];

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, viewport: { once: true, amount: 0.2 } };

const formSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Email inválido." }),
  message: z.string().min(10, { message: "Mensagem deve ter pelo menos 10 caracteres." }),
});

function Section({ id, className = "", children }: Readonly<{ id: string; className?: string; children: React.ReactNode }>) {
  return <section id={id} className={`scroll-mt-24 py-10 md:py-20 ${className}`}>{children}</section>;
}

function ThemeToggle() {
  const [dark, setDark] = useState(true);
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);
  return (
    <Button variant="outline" size="icon" onClick={() => setDark(!dark)}>
      {dark ? <Sun className="h-5 w-5"/> : <Moon className="h-5 w-5"/>}
    </Button>
  );
}


export default function Page(){
  const sections = ["inicio","sobre","servicos","projetos","experiencia","contato"];
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [busca,setBusca] = useState("");
  const projetosFiltrados = useMemo(()=>{
    return PROJETOS.filter(p=>[p.titulo,p.descricao,p.stack.join(" "),p.tags.join(" ")].join(" ").toLowerCase().includes(busca.toLowerCase()));
  },[busca]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    form.reset();
    toast.success("Mensagem enviada!", {
      description: "Obrigado pelo contato. Retornarei em breve.",
      duration: 5000,
    });
  }
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-muted/30 dark:from-zinc-950 dark:to-zinc-900">
      <motion.div style={{ scaleX }} className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-primary" />

      {/* HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur border-b supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-950/60">
        <div className="container flex items-center justify-between py-3 px-4 w-full mx-auto my-0">
          <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9"><AvatarImage src={PROFILE.avatar}/><AvatarFallback>{PROFILE.nome[0]}</AvatarFallback></Avatar>
            <span className="font-semibold">{PROFILE.nome}</span>
          </div>
          <nav className="hidden md:flex gap-2">
            {sections.map(id => <a key={id} href={`#${id}`} className="px-3 py-2 rounded-full text-sm hover:bg-black/5 dark:hover:bg-white/10">{id}</a>)}
          </nav>
          <div className="flex gap-2 items-center">
            <ThemeToggle/>
            <Button><a href={PROFILE.cvUrl} download className="flex items-center gap-2"><FileDown className="h-4 w-4"/> Baixar CV</a></Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-8">


      {/* HERO */}
      <Section id="inicio">
        <div className="container grid md:grid-cols-2 gap-8 items-center">
          <motion.div {...fadeUp}>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{PROFILE.titulo}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{PROFILE.initial}</p>
            <div className="flex gap-3 flex-wrap">
              <Button className="text-base"><a href="#contato" className="flex items-center gap-2"><Mail className="h-5 w-5"/> Fale comigo</a></Button>
              <Button variant="outline"><a href={PROFILE.github} target="_blank" className="flex items-center gap-2"><Github className="h-5 w-5"/> GitHub</a></Button>
              <Button variant="outline"><a href={PROFILE.linkedin} target="_blank" className="flex items-center gap-2"><Linkedin className="h-5 w-5"/> LinkedIn</a></Button>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* SOBRE */}
      <Section id="sobre">
        <div className="container">
          <motion.h2 {...fadeUp} className="text-3xl font-bold mb-6">Sobre</motion.h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{PROFILE.sobre}</p>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map(s => <Badge key={s} variant="outline">{s}</Badge>)}
          </div>
        </div>
      </Section>

      {/* SERVIÇOS */}
      <Section id="servicos" className="bg-muted/40 dark:bg-zinc-900/40">
        <div className="container px-3">
          <motion.h2 {...fadeUp} className="text-3xl font-bold mb-6">Serviços</motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {SERVICOS.map(s => (
              <motion.div key={s.titulo} {...fadeUp}>
                <div className="border border-black/10 dark:border-white/10 rounded-3xl bg-white dark:bg-zinc-900 h-full p-5 flex flex-col gap-5 justify-between">
                  <div className="flex items-center">
                    <CardTitle className="flex items-center text-xl p-0 gap-1"><span>{s.icon}</span>{s.titulo}</CardTitle>
                  </div>
                  <CardContent className="text-gray-600 dark:text-gray-300">{s.desc}</CardContent>
                  <CardFooter className="flex flex-wrap gap-2">{s.tags.map(t=><Badge key={t}>{t}</Badge>)}</CardFooter>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* PROJETOS */}
      <Section id="projetos">
        <div className="container">
          <motion.h2 {...fadeUp} className="text-3xl font-bold mb-6">Projetos</motion.h2>
          <div className="mb-6">
            <Input placeholder="Filtrar projetos por nome, stack, tag..." value={busca} onChange={(e)=>setBusca(e.target.value)} />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {projetosFiltrados.map(p => (
              <motion.div key={p.titulo} {...fadeUp}>
                <div className="rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 h-full pb-3">
                  <Image src={p.capa} alt={p.titulo} width={400} height={192} className="h-48 w-full object-cover"/>
                  <div className="p-6">
                    <CardTitle className="text-xl">{p.titulo}</CardTitle>
                  </div>
                  <CardContent className="text-gray-600 dark:text-gray-300">{p.descricao}</CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-2">{p.stack.map(s=><Badge key={s} variant="outline">{s}</Badge>)}</div>
                    <div className="flex gap-2">
                      {p.repo && <Button variant="outline" className="text-sm"><a href={p.repo} className="flex items-center gap-2"><Github className="h-4 w-4"/> Repo</a></Button>}
                      {p.link && <Button className="text-sm"><a href={p.link} target="_blank" className="flex items-center gap-2">Live <ExternalLink className="h-4 w-4"/></a></Button>}
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
          <motion.h2 {...fadeUp} className="text-3xl font-bold mb-6">Experiência</motion.h2>
          <div className="grid gap-6">
            {EXPERIENCIA.map((e) => (
              <motion.div key={`${e.empresa}-${e.periodo}`} {...fadeUp}>
                <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 pb-3">
                  <div className="p-6">
                    <CardTitle>{e.cargo} - {e.empresa}</CardTitle>
                  </div>
                  <CardContent className="text-sm text-gray-600 dark:text-gray-300">
                    <div className="mb-2">{e.periodo} | {e.local}</div>
                    <ul className="list-disc pl-5 space-y-1">{e.pontos.map((p)=><li key={p.substring(0,20)}>{p}</li>)}</ul>
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
          <motion.h2 {...fadeUp} className="text-3xl font-bold mb-6">Contato</motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 pb-3">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="p-6">
                    <CardTitle>Envie uma mensagem</CardTitle>
                  </div>
                  <CardContent className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Nome" {...field} />
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
                          <FormControl>
                            <Input type="email" placeholder="Email" {...field} />
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
                          <FormControl>
                            <Textarea placeholder="Mensagem" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="py-2">
                    <Button type="submit">Enviar</Button>
                  </CardFooter>
                </form>
              </Form>
            </div>            
            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 pb-3">
              <div className="p-6">
                <CardTitle>Me encontre</CardTitle>
              </div>
              <CardContent className="grid gap-2 text-sm">
                <a href={PROFILE.github} className="flex gap-2 items-center"><Github className="h-4 w-4"/>GitHub</a>
                <a href={PROFILE.linkedin} className="flex gap-2 items-center"><Linkedin className="h-4 w-4"/>LinkedIn</a>
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
    </main>
  );
}
