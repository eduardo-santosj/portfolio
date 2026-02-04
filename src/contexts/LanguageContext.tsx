"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type Language = "pt" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string | string[];
  getServices: () => Array<{icon: string; title: string; desc: string; tags: string[]}>;
  getProjects: () => Array<{title: string; desc: string; capa: string; link: string; repo: string; stack: string[]; tags: string[]}>;
  getExperience: () => Array<{company: string; role: string; period: string; local: string; points: string[]}>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt");

  const t = (key: string): string | string[] => {
    const keys = key.split(".");
    let value: unknown = translations[language];
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return value;
    return key;
  };

  const getServices = () => {
    const items = t("services.items") as unknown as Array<{title: string; desc: string}>;
    return [
      { icon: "🧩", ...items[0], tags: ["React","Next.js","Node.js","Tailwind"] },
      { icon: "⚡", ...items[1], tags: ["CWV","A11y","SEO","SSR"] },
      { icon: "🧠", ...items[2], tags: ["Consultoria","Arquitetura","Freelance"] },
    ];
  };

  const getProjects = () => {
    const items = t("projects.items") as unknown as Array<{title: string; desc: string}>;
    return [
      { ...items[0], capa: "/images/projetos/suprema.png", link: "https://suprema.bet.br", repo: "", stack: ["React", "Next.js","AWS"], tags: ["gaming","react"] },
      { ...items[1], capa: "/images/projetos/cobasi.png", link: "https://www.cobasi.com.br", repo: "", stack: ["React","Node.js","Vtex"], tags: ["ecommerce","pet"]},
      { ...items[2], capa: "/images/projetos/chevrolet.png", link: "https://chevroletdigital.com.br", repo: "", stack: ["React","Java"], tags: ["automotivo","enterprise"] },
    ];
  };

  const getExperience = () => {
    const items = t("experience.items") as unknown as Array<{company: string; role: string; period: string; points: string[]}>;
    const locals = ["Remoto", "São Paulo, SP", "São Paulo, SP", "São Paulo, SP", "São Paulo, SP"];
    return items.map((item, i) => ({ ...item, local: locals[i] }));
  };

  const value = useMemo(() => ({ language, setLanguage, t, getServices, getProjects, getExperience }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}

const translations = {
  pt: {
    nav: {
      inicio: "Início",
      sobre: "Sobre",
      servicos: "Serviços",
      projetos: "Projetos",
      experiencia: "Experiência",
      contato: "Contato",
    },
    hero: {
      greeting: "Olá, eu sou",
      description: "Transformando ideias em código. Experiências web modernas e performáticas que impactam positivamente os negócios. Vamos construir algo incrível juntos?",
      downloadCV: "Baixar CV",
      contact: "Entre em Contato",
    },
    about: {
      title: "Sobre Mim",
      description: "Sou desenvolvedor web com 7+ anos de experiência em projetos digitais, atuando principalmente com React, Next.js, Node.js e WordPress. Tenho sólida formação em Sistemas de Informação e Técnico em Informática, além de experiência em empresas de tecnologia, comunicação e apostas esportivas. Meu foco é entregar soluções performáticas, escaláveis e que tragam valor real ao negócio.",
      skills: "Habilidades Técnicas",
    },
    services: {
      title: "Serviços",
      items: [
        { title: "Desenvolvimento Web", desc: "Aplicações modernas com React, Next.js, Tailwind e Node.js." },
        { title: "Performance & SEO", desc: "Melhoria de Core Web Vitals, acessibilidade e SEO." },
        { title: "Consultoria & Freelance", desc: "Arquitetura, levantamento de requisitos e entregas escaláveis." },
      ],
    },
    projects: {
      title: "Projetos em Destaque",
      search: "Buscar projetos...",
      viewProject: "Ver Projeto",
      viewCode: "Ver Código",
      items: [
        { title: "Suprema Gaming & Co.", desc: "Plataforma de apostas esportivas desenvolvida com React e integração BetConstruct, incluindo CMS para gestão de afiliados, análise de performance e distribuição de conteúdo. Infraestrutura escalável na AWS." },
        { title: "Cobasi & SPet (Accurate Software)", desc: "Desenvolvimento do e-commerce Cobasi com React, VTEX e SASS, incluindo sistema SPet para agendamentos de serviços pet. Implementação de componentes reutilizáveis e otimização que melhorou Core Web Vitals em 40%." },
        { title: "GM Propostas Comerciais (Accurate Software)", desc: "Desenvolvimento do sistema GM Propostas para financiamento e compra de veículos com consultas de CPF/CNPJ e endereço. Integração com APIs de seguradoras e DocuSign para assinatura digital de contratos." },
      ],
    },
    experience: {
      title: "Experiência Profissional",
      present: "Atual",
      items: [
        {
          company: "Suprema Gaming & Co.",
          role: "Desenvolvedor Web",
          period: "Jul/2023 – Atual",
          points: [
            "Desenvolvimento de sites de apostas utilizando React, Tailwind CSS, shadcn/ui e integração com BetConstruct.",
            "Criação de interfaces modernas e responsivas com foco em UX e performance.",
            "Manutenção e implementação de novas features em plataformas AWS.",
            "Implementação de layouts seguindo design system e protótipos do Figma.",
            "Desenvolvimento guiado por testes com Cypress para garantir qualidade.",
          ],
        },
        {
          company: "Arena22",
          role: "Desenvolvedor Web",
          period: "Out/2021 – Jul/2023",
          points: [
            "Site de fantasy games com montagem de times e bolões de campeonatos.",
            "Arquitetura escalável em React + Azure.",
            "Desenvolvimento de interfaces seguindo protótipos do Figma e padrões de UX.",
            "Testes end-to-end com Cypress para validação de fluxos.",
          ],
        },
        {
          company: "Accurate Software",
          role: "Desenvolvedor Web",
          period: "Mai/2019 – Out/2021",
          points: [
            "Desenvolvimento do sistema GM Propostas para financiamento e compra de veículos com consultas de CPF/CNPJ e endereço.",
            "Integração com APIs de seguradoras e DocuSign para assinatura digital de contratos.",
            "Desenvolvimento do e-commerce Cobasi com React, VTEX, SASS e integração com APIs REST.",
            "Criação do sistema SPet para agendamento de serviços pet usando React, Node.js e MongoDB.",
            "Implementação de boas práticas de código e componentes reutilizáveis seguindo design system.",
            "Otimização de performance e SEO do e-commerce resultando em melhoria de 40% no Core Web Vitals.",
          ],
        },
        {
          company: "Superare",
          role: "Desenvolvedor Web",
          period: "Nov/2017 – Mai/2019",
          points: [
            "Desenvolvimento de landing pages responsivas e otimizadas para conversão para grandes clientes como Claro e Net",
            "Implementação de soluções utilizando stack técnica: Jade (Pug) para templates, SCSS para estilização, Gulp para automação de build, JavaScript vanilla e WordPress como CMS",
          ],
        },
        {
          company: "Studio Visual",
          role: "Dev Web / WordPress",
          period: "Mai/2017 – Nov/2017",
          points: [
            "Desenvolvimento de sites utilizando WordPress, WooCommerce, HTML5, CSS3, PHP e JavaScript",
            "Implementação de interfaces responsivas seguindo padrões web e boas práticas de UI/UX",
          ],
        },
      ],
    },
    contact: {
      title: "Vamos Conversar?",
      subtitle: "Estou disponível para novos projetos e oportunidades. Entre em contato!",
      form: {
        name: "Nome",
        email: "Email",
        message: "Mensagem",
        send: "Enviar Mensagem",
        nameError: "Nome deve ter pelo menos 2 caracteres.",
        emailError: "Email inválido.",
        messageError: "Mensagem deve ter pelo menos 10 caracteres.",
        successTitle: "Mensagem enviada!",
        successDesc: "Obrigado pelo contato. Retornarei em breve.",
      },
    },
  },
  en: {
    nav: {
      inicio: "Home",
      sobre: "About",
      servicos: "Services",
      projetos: "Projects",
      experiencia: "Experience",
      contato: "Contact",
    },
    hero: {
      greeting: "Hi, I'm",
      description: "Turning ideas into code. Modern and performant web experiences that positively impact businesses. Let's build something amazing together?",
      downloadCV: "Download CV",
      contact: "Get in Touch",
    },
    about: {
      title: "About Me",
      description: "I'm a web developer with 7+ years of experience in digital projects, working mainly with React, Next.js, Node.js and WordPress. I have a solid background in Information Systems and IT Technician, as well as experience in technology, communication and sports betting companies. My focus is to deliver performant, scalable solutions that bring real value to the business.",
      skills: "Technical Skills",
    },
    services: {
      title: "Services",
      items: [
        { title: "Web Development", desc: "Modern applications with React, Next.js, Tailwind and Node.js." },
        { title: "Performance & SEO", desc: "Core Web Vitals improvement, accessibility and SEO." },
        { title: "Consulting & Freelance", desc: "Architecture, requirements gathering and scalable deliveries." },
      ],
    },
    projects: {
      title: "Featured Projects",
      search: "Search projects...",
      viewProject: "View Project",
      viewCode: "View Code",
      items: [
        { title: "Suprema Gaming & Co.", desc: "Sports betting platform developed with React and BetConstruct integration, including CMS for affiliate management, performance analysis and content distribution. Scalable infrastructure on AWS." },
        { title: "Cobasi & SPet (Accurate Software)", desc: "Development of Cobasi e-commerce with React, VTEX and SASS, including SPet system for pet service scheduling. Implementation of reusable components and optimization that improved Core Web Vitals by 40%." },
        { title: "GM Commercial Proposals (Accurate Software)", desc: "Development of GM Proposals system for vehicle financing and purchase with CPF/CNPJ and address queries. Integration with insurance APIs and DocuSign for digital contract signing." },
      ],
    },
    experience: {
      title: "Professional Experience",
      present: "Present",
      items: [
        {
          company: "Suprema Gaming & Co.",
          role: "Web Developer",
          period: "Jul/2023 – Present",
          points: [
            "Development of betting sites using React, Tailwind CSS, shadcn/ui and BetConstruct integration.",
            "Creation of modern and responsive interfaces focused on UX and performance.",
            "Maintenance and implementation of new features on AWS platforms.",
            "Layout implementation following design system and Figma prototypes.",
            "Test-driven development with Cypress to ensure quality.",
          ],
        },
        {
          company: "Arena22",
          role: "Web Developer",
          period: "Oct/2021 – Jul/2023",
          points: [
            "Fantasy games site with team building and championship pools.",
            "Scalable architecture in React + Azure.",
            "Interface development following Figma prototypes and UX patterns.",
            "End-to-end testing with Cypress for flow validation.",
          ],
        },
        {
          company: "Accurate Software",
          role: "Web Developer",
          period: "May/2019 – Oct/2021",
          points: [
            "Development of GM Proposals system for vehicle financing and purchase with CPF/CNPJ and address queries.",
            "Integration with insurance APIs and DocuSign for digital contract signing.",
            "Development of Cobasi e-commerce with React, VTEX, SASS and REST API integration.",
            "Creation of SPet system for pet service scheduling using React, Node.js and MongoDB.",
            "Implementation of code best practices and reusable components following design system.",
            "E-commerce performance and SEO optimization resulting in 40% improvement in Core Web Vitals.",
          ],
        },
        {
          company: "Superare",
          role: "Web Developer",
          period: "Nov/2017 – May/2019",
          points: [
            "Development of responsive landing pages optimized for conversion for major clients such as Claro and Net",
            "Implementation of solutions using technical stack: Jade (Pug) for templates, SCSS for styling, Gulp for build automation, vanilla JavaScript and WordPress as CMS",
          ],
        },
        {
          company: "Studio Visual",
          role: "Web Dev / WordPress",
          period: "May/2017 – Nov/2017",
          points: [
            "Website development using WordPress, WooCommerce, HTML5, CSS3, PHP and JavaScript",
            "Implementation of responsive interfaces following web standards and UI/UX best practices",
          ],
        },
      ],
    },
    contact: {
      title: "Let's Talk?",
      subtitle: "I'm available for new projects and opportunities. Get in touch!",
      form: {
        name: "Name",
        email: "Email",
        message: "Message",
        send: "Send Message",
        nameError: "Name must be at least 2 characters.",
        emailError: "Invalid email.",
        messageError: "Message must be at least 10 characters.",
        successTitle: "Message sent!",
        successDesc: "Thank you for contacting. I'll get back to you soon.",
      },
    },
  },
};
