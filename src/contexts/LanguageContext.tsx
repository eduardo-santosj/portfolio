"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "pt" | "en";

export type ProjectStatus = "live" | "dev" | "published" | "delivered";
export type ProjectGroup = "vela" | "career";

export interface Project {
  id: string;
  title: string;
  desc: string;
  capa: string;
  link: string;
  repo: string;
  stack: string[];
  tags: string[];
  status: ProjectStatus;
  group: ProjectGroup;
}

export interface Service {
  id: string;
  title: string;
  desc: string;
  tags: string[];
}

export interface Experience {
  company: string;
  role: string;
  summary: string;
  period: string;
  local: string;
  points: string[];
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string | string[];
  getServices: () => Service[];
  getProjects: () => Project[];
  getExperience: () => Experience[];
  getCvUrl: () => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Dados que não mudam com o idioma. A ordem precisa casar com projects.items.
const PROJECT_DATA: Array<Omit<Project, "title" | "desc">> = [
  { id: "torneios", capa: "/images/projetos/suaarena-torneios.png", link: "https://suaarena.com.br", repo: "", stack: ["Next.js", "Node.js", "MySQL", "SSE", "AWS", "Nginx"], tags: ["esportes", "saas", "realtime"], status: "live", group: "vela" },
  { id: "arenas", capa: "/images/projetos/suaarena-arenas.png", link: "https://interno.suaarena.com.br", repo: "", stack: ["Next.js", "Node.js", "MariaDB", "Tailwind"], tags: ["esportes", "saas", "gestao"], status: "live", group: "vela" },
  { id: "ferinos", capa: "/images/projetos/ferinos.png", link: "https://ferinos.suaarena.com.br/torneios", repo: "", stack: ["Node.js", "Express", "MySQL", "Pix"], tags: ["esportes", "app", "freemium"], status: "live", group: "vela" },
  { id: "ameconsulta", capa: "/images/projetos/ameconsulta-2026.png", link: "https://exames.ameconsulta.com.br", repo: "", stack: ["Next.js", "NestJS", "TypeScript", "PostgreSQL", "Docker", "AWS"], tags: ["saude", "dicom", "saas"], status: "live", group: "vela" },
  { id: "gonix", capa: "/images/projetos/gonix.png", link: "https://gonix.com.br", repo: "", stack: ["NestJS", "Prisma", "MariaDB", "Next.js", "Turborepo", "Zod"], tags: ["saude", "esportes", "saas"], status: "live", group: "vela" },
  { id: "vela-connect", capa: "/images/projetos/vela-connect.png", link: "https://velaconnect.com.br", repo: "", stack: ["Node.js", "TypeScript", "BullMQ", "Redis", "PostgreSQL", "Prisma"], tags: ["whatsapp", "api", "multi-tenant"], status: "live", group: "vela" },
  { id: "design-system", capa: "", link: "", repo: "", stack: ["React", "TypeScript", "Tailwind", "Radix", "Storybook", "tsup"], tags: ["design-system", "ui"], status: "published", group: "vela" },
  { id: "suprema", capa: "/images/projetos/suprema.png", link: "https://suprema.bet.br", repo: "", stack: ["React", "Next.js", "AWS"], tags: ["gaming", "react"], status: "delivered", group: "career" },
  { id: "cobasi", capa: "/images/projetos/cobasi.png", link: "https://www.cobasi.com.br", repo: "", stack: ["React", "Node.js", "Vtex"], tags: ["ecommerce", "pet"], status: "delivered", group: "career" },
  { id: "gm", capa: "/images/projetos/chevrolet.png", link: "https://chevroletdigital.com.br", repo: "", stack: ["React", "Java"], tags: ["automotivo", "enterprise"], status: "delivered", group: "career" },
];

const SERVICE_DATA: Array<Pick<Service, "id" | "tags">> = [
  { id: "architecture", tags: ["React", "Next.js", "TypeScript", "React Query"] },
  { id: "performance", tags: ["Core Web Vitals", "SSR", "SEO"] },
  { id: "design-system", tags: ["shadcn/ui", "Radix UI", "Storybook"] },
  { id: "integration", tags: ["REST", "Auth", "Node.js", "NestJS"] },
  { id: "leadership", tags: ["Specs", "Code review", "Mentoria"] },
  { id: "vela", tags: ["SaaS", "AWS", "Deploy"] },
];

// Só os locais publicados no LinkedIn; vazio quando o perfil não informa.
const EXPERIENCE_LOCALS = ["Itajaí, SC · Remoto", "Itajaí, SC · Remoto", "", "", "", "", ""];

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt");

  useEffect(() => {
    document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
  }, [language]);

  const value = useMemo<LanguageContextType>(() => {
    const t = (key: string): string | string[] => {
      let current: unknown = translations[language];
      for (const k of key.split(".")) {
        current = (current as Record<string, unknown>)?.[k];
      }
      if (typeof current === "string" || Array.isArray(current)) return current as string | string[];
      return key;
    };

    const getServices = (): Service[] => {
      const items = t("services.items") as unknown as Array<{ title: string; desc: string }>;
      return SERVICE_DATA.map((data, i) => ({ ...data, ...items[i] }));
    };

    const getProjects = (): Project[] => {
      const items = t("projects.items") as unknown as Array<{ title: string; desc: string }>;
      return PROJECT_DATA.map((data, i) => ({ ...data, ...items[i] }));
    };

    const getExperience = (): Experience[] => {
      const items = t("experience.items") as unknown as Array<Omit<Experience, "local">>;
      return items.map((item, i) => ({ ...item, local: EXPERIENCE_LOCALS[i] }));
    };

    const getCvUrl = () => (language === "pt" ? "/cv.pdf" : "/cv_en.pdf");

    return { language, setLanguage, t, getServices, getProjects, getExperience, getCvUrl };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}

export const translations = {
  pt: {
    nav: {
      inicio: "Início",
      projetos: "Projetos",
      vela: "Vela Studio",
      servicos: "Serviços",
      experiencia: "Experiência",
      contato: "Contato",
      numeros: "Números",
      label: "Navegação principal",
      menuOpen: "Abrir menu",
      menuClose: "Fechar menu",
      menuTitle: "Menu",
      menuDescription: "Seções do site, idioma e tema.",
      menuSections: "Seções",
      language: "Idioma",
      theme: "Tema",
      themeDark: "Escuro",
      themeLight: "Claro",
    },
    hero: {
      eyebrow: "Eduardo dos Santos",
      photoAlt: "Retrato de Eduardo dos Santos, desenvolvedor front-end sênior, sorrindo de óculos",
      role: "Desenvolvedor Front-End Sênior",
      titleLine1: "Software de verdade,",
      titleLine2: "rodando em produção.",
      description: "Desenvolvedor Front-End Sênior com 9 anos de experiência em React, Next.js e TypeScript, construindo produtos que rodam em produção e aguentam usuário real. Design System, performance e arquitetura front-end.",
      ctaProjects: "Ver projetos",
      contact: "Falar comigo",
      downloadCV: "Baixar CV",
      location: "Itajaí, SC · Remoto",
      available: "Aberto a vagas e projetos",
      localTime: "Hora local",
      scroll: "Rolar",
      facts: "9 anos · React · Next.js · TypeScript",
    },
    stack: {
      label: "Stack em produção",
    },
    projects: {
      label: "Projetos",
      title: "Projetos em destaque",
      subtitle: "Produtos próprios da Vela Studio, minha software house, e entregas de carreira em empresas de grande porte.",
      filterLabel: "Filtrar projetos",
      filters: { all: "Todos", vela: "Vela Studio", career: "Carreira" },
      status: { live: "Live", dev: "Em dev", published: "Publicado", delivered: "Entregue" },
      groups: { vela: "Vela Studio", career: "Carreira" },
      viewProject: "Ver projeto",
      noPreview: "Pacote npm privado, sem página pública",
      items: [
        { title: "SuaArena Torneios", desc: "Plataforma de torneios esportivos em produção, com mais de 500 competições realizadas. Chaveamento ao vivo (dupla eliminação e grupos), ranking, check-in por QR Code e atualização em tempo real via SSE." },
        { title: "SuaArena Arenas", desc: "Gestão de arenas esportivas vendida por módulos: alunos, turmas e agenda. Um dos módulos conecta a arena ao SuaArena Torneios para ela organizar os próprios campeonatos." },
        { title: "SuaArena Ferinos", desc: "Peladas e torneios multiesporte: elenco, sorteio de times equilibrado, gols e assistências ao vivo, ranking e financeiro com Pix. Versão web e app nativo." },
        { title: "AmeConsulta", desc: "Sistema de laudos e imagem médica em produção, com integração DICOM/Orthanc a aparelhos de ultrassom e portal de acesso do paciente aos próprios exames." },
        { title: "Gonix (FisioAnalysis)", desc: "Plataforma PWA de avaliação física com critérios parametrizáveis, laudo em PDF e agenda. Monorepo pnpm + Turborepo com NestJS, Prisma, MariaDB e Zod." },
        { title: "Vela Connect", desc: "Microsserviço multi-tenant de notificações WhatsApp (Meta Cloud API) com filas BullMQ/Redis, PostgreSQL e Prisma. Leva o WhatsApp para os sistemas da Vela e dos clientes." },
        { title: "SuaArena Design System", desc: "Design System compartilhado, publicado como pacote npm privado, com componentes documentados em Storybook, Tailwind CSS, Radix e tokens de design." },
        { title: "Suprema Gaming & Co.", desc: "Plataforma de apostas esportivas desenvolvida com React e integração BetConstruct, incluindo CMS para gestão de afiliados, análise de performance e distribuição de conteúdo. Infraestrutura escalável na AWS." },
        { title: "Cobasi & SPet (Accurate Software)", desc: "Desenvolvimento do e-commerce Cobasi com React, VTEX e SASS, incluindo sistema SPet para agendamentos de serviços pet. Implementação de componentes reutilizáveis e otimização que melhorou Core Web Vitals em 40%." },
        { title: "GM Propostas Comerciais (Accurate Software)", desc: "Desenvolvimento do sistema GM Propostas para financiamento e compra de veículos com consultas de CPF/CNPJ e endereço. Integração com APIs de seguradoras e DocuSign para assinatura digital de contratos." },
      ],
    },
    vela: {
      label: "Vela Studio",
      title: "Vela Studio,",
      titleMuted: "minha software house.",
      lead: "Tiro empresas do papel, da planilha e do sistema improvisado e entrego software sob medida, que resolve a dor real do negócio.",
      body: "Cada projeto começa pela operação do cliente, não pela tecnologia: entendo como o trabalho acontece hoje, desenho o sistema em cima disso e acompanho do primeiro rascunho ao deploy. Os produtos abaixo são da Vela e rodam em produção.",
      founded: "Fundada",
      foundedValue: "2026",
      base: "Base",
      baseValue: "Itajaí, SC",
      productsTitle: "Produtos da Vela",
      linksTitle: "Fale com a Vela",
      site: "Site",
      instagram: "Instagram",
      whatsapp: "WhatsApp comercial",
      email: "E-mail",
      cta: "Conversar com a Vela no WhatsApp",
      logoAlt: "Logo da Vela Studio",
    },
    numbers: {
      label: "Números",
      title: "Fatos, sem enfeite.",
      years: "anos de experiência com front-end",
      cwv: "em Core Web Vitals no e-commerce da Cobasi",
      betting: "anos e 7 meses em apostas esportivas de alto tráfego",
      competitions: "competições realizadas no SuaArena",
    },
    services: {
      label: "Serviços",
      title: "O que eu entrego",
      stackTitle: "Stack",
      items: [
        { title: "Arquitetura front-end", desc: "Arquitetura clara, com estado no lugar certo e componentes reutilizáveis que o time consegue manter." },
        { title: "Performance e Core Web Vitals", desc: "Já entreguei 40% de melhoria em e-commerce de grande porte." },
        { title: "Design System", desc: "Design System e padronização que aceleram o time inteiro." },
        { title: "APIs e regras de negócio", desc: "Integração com APIs REST, autenticação e regras de negócio complexas." },
        { title: "Liderança técnica", desc: "Especificação técnica, code review e mentoria de desenvolvedores." },
        { title: "Produto sob medida (Vela Studio)", desc: "Operações que rodam em papel, planilha ou sistema improvisado viram produto digital sob medida, do banco ao deploy." },
      ],
      skills: ["React", "Next.js", "TypeScript", "JavaScript ES6+", "Node.js", "NestJS", "Express", "Tailwind CSS", "SASS", "shadcn/ui", "Radix UI", "React Query", "Prisma", "PostgreSQL", "MySQL", "MongoDB", "Docker", "AWS (EC2, S3, RDS)", "Azure", "Vercel", "Git", "CI/CD", "Jest", "React Testing Library", "Cypress", "Storybook", "Scrum", "Kanban"],
    },
    experience: {
      label: "Experiência",
      title: "Experiência profissional",
      present: "Atual",
      aboutTitle: "Sobre mim",
      about: [
        "Desenvolvedor Front-End Sênior com 9 anos de experiência em React, Next.js e TypeScript, construindo produtos que rodam em produção e aguentam usuário real.",
        "Hoje atuo no front-end da Accurate Software, no projeto GM Financial, plataforma de propostas e financiamento de veículos usada por concessionárias em todo o Brasil. Assumi a liderança técnica do front: especifico as issues técnicas, defino padrão de componente e conduzo code review.",
        "Antes disso, foram 4 anos e 7 meses em plataformas de apostas esportivas (Arena 22 e, após a aquisição, Suprema Gaming), com React, TypeScript e infraestrutura Azure, em produto de alto tráfego.",
        "Em paralelo, sou sócio-fundador da Vela Studio, onde projeto e desenvolvo produtos SaaS do zero, do banco ao deploy.",
      ],
      education: "Formação",
      educationText: "Bacharel em Sistemas de Informação (Centro Universitário FAM) e Técnico em Informática.",
      languages: "Idiomas",
      languagesList: "Português (nativo) · Inglês B2",
      availability: "Disponibilidade",
      availabilityText: "Aberto a vagas (CLT ou PJ) no Brasil e no exterior e a projetos sob demanda. Remoto, híbrido ou presencial na região de Itajaí, Joinville e Blumenau, SC.",
      items: [
        {
          company: "Accurate Software",
          role: "Desenvolvedor Front-End Sênior | Liderança Técnica",
          period: "Jan/2026 · Atual",
          summary: "Projeto GM Financial: plataforma de propostas e financiamento de veículos usada por concessionárias em todo o Brasil (React, Vite, Design System proprietário GM).",
          points: [
            "Assumi a liderança técnica do front-end, especificando issues técnicas detalhadas (regras de negócio, perfis de acesso, contratos de API, critérios de aceite e componentes afetados) que orientam a execução do time",
            "Desenvolvo funcionalidades em React e TypeScript sobre o Design System da GM, com internacionalização (i18n) e integração com APIs REST do backend",
            "Padronizei a estrutura de especificação técnica entre front e back, reduzindo retrabalho e ambiguidade de escopo",
            "Conduzo code review e defino padrões de componente, estado e organização de módulos",
            "Atuo com PO e equipe multidisciplinar em ambiente ágil, traduzindo história de negócio em requisito técnico executável",
          ],
        },
        {
          company: "Vela Studio",
          role: "Sócio-fundador e Desenvolvedor Full Stack",
          period: "Jun/2026 · Atual",
          summary: "Software house própria, focada em transformar operações que rodam em papel, planilha ou sistema improvisado em produto digital sob medida. Projeto, desenvolvo e mantenho os produtos do zero ao deploy.",
          points: [
            "SuaArena: gestão de arenas e torneios esportivos em produção, com mais de 500 competições realizadas, chaveamento ao vivo, ranking, check-in por QR Code e tempo real via SSE",
            "AmeConsulta: sistema de laudos e imagem médica em produção, com integração DICOM/Orthanc a aparelhos de ultrassom e portal do paciente",
            "FisioAnalysis: plataforma PWA de avaliação física com critérios parametrizáveis, em monorepo pnpm + Turborepo com NestJS, Prisma e MariaDB",
            "Design System compartilhado publicado como pacote npm privado, com componentes documentados em Storybook",
            "Microsserviço multi-tenant de notificações WhatsApp (Meta Cloud API) com filas BullMQ/Redis, PostgreSQL e Prisma",
          ],
        },
        {
          company: "Suprema Gaming & Co.",
          role: "Desenvolvedor Front-End",
          period: "Jul/2023 · Jan/2026",
          summary: "Plataformas de apostas esportivas de alto tráfego, continuidade dos projetos após a aquisição da Arena 22 pela Suprema.",
          points: [
            "Desenvolvi e evoluí interfaces em React e TypeScript para plataforma de apostas esportivas com integração à BetConstruct",
            "Trabalhei em produto com alto volume de acesso simultâneo, priorizando performance de renderização, escalabilidade e estabilidade em produção",
            "Implementei testes automatizados end to end com Cypress, reduzindo regressão a cada release",
            "Construí CMS para gestão de afiliados, análise de performance e distribuição de conteúdo",
            "Mantive e publiquei aplicações em infraestrutura de nuvem (Azure e AWS) com pipeline de CI/CD",
            "Colaborei com design, backend e QA em ciclos ágeis (Scrum/Kanban)",
          ],
        },
        {
          company: "Arena 22",
          role: "Desenvolvedor Front-End",
          period: "Mai/2021 · Jul/2023",
          summary: "Plataforma de apostas esportivas e fantasy games, adquirida pela Suprema Gaming & Co., com continuidade do projeto sob a nova organização.",
          points: [
            "Desenvolvi as interfaces da plataforma em React, com componentização reutilizável e arquitetura preparada para escala",
            "Implementei protótipos do Figma com fidelidade visual e foco em responsividade e acessibilidade",
            "Escrevi testes end to end com Cypress garantindo qualidade das entregas",
            "Atuei na infraestrutura em Azure, acompanhando estabilidade e performance da aplicação em produção",
          ],
        },
        {
          company: "Accurate Software",
          role: "Desenvolvedor Front-End",
          period: "Mai/2019 · Out/2021",
          summary: "Projetos de médio e grande porte para clientes dos setores de varejo e automotivo.",
          points: [
            "Desenvolvi o e-commerce da Cobasi em React e SASS sobre a plataforma VTEX, com otimizações que resultaram em 40% de melhoria nos Core Web Vitals",
            "Construí o SPet, portal de agendamento de serviços veterinários (banho, tosa e consultas) da clínica própria da marca, em React, Node.js e MongoDB",
            "Integrei o sistema GM Propostas (React e Java) com APIs de seguradoras, consultas de CPF/CNPJ e endereço, e assinatura digital via DocuSign",
            "Criei componentes reutilizáveis e apliquei design patterns que reduziram duplicação de código entre os projetos",
            "Fiz mentoria de desenvolvedores júnior e code review, elevando o padrão de qualidade do time",
          ],
        },
        {
          company: "Superare",
          role: "Desenvolvedor Front-End",
          period: "Nov/2017 · Mai/2019",
          summary: "Landing pages e soluções web para clientes dos setores de comunicação e telecomunicações, entre eles Claro e NET.",
          points: [
            "Desenvolvi interfaces com JavaScript, SCSS e Pug (Jade), com automação de build via Gulp",
            "Implementei e customizei soluções em WordPress",
            "Foco em performance, responsividade e boas práticas de front-end",
          ],
        },
        {
          company: "Studio Visual",
          role: "Desenvolvedor Front-End",
          period: "Mai/2017 · Nov/2017",
          summary: "Soluções web em WordPress e WooCommerce.",
          points: [
            "Desenvolvi interfaces em HTML5, CSS3 e JavaScript",
            "Implementei e customizei funcionalidades em PHP",
            "Apliquei padrões web, responsividade e princípios de UI/UX",
          ],
        },
      ],
    },
    a11y: {
      skipToContent: "Pular para o conteúdo principal",
      switchLanguage: "Switch to English",
      lightTheme: "Ativar tema claro",
      darkTheme: "Ativar tema escuro",
    },
    contact: {
      label: "Contato",
      title: "Vamos conversar?",
      subtitle: "Estou aberto a vagas, nacionais e internacionais, e a novos projetos. Me conte o que você precisa e eu respondo em breve.",
      direct: "Contato direto",
      form: {
        name: "Nome",
        email: "Email",
        message: "Mensagem",
        send: "Enviar mensagem",
        sending: "Enviando...",
        nameError: "Nome deve ter pelo menos 2 caracteres.",
        emailError: "Email inválido.",
        messageError: "Mensagem deve ter pelo menos 10 caracteres.",
        successTitle: "Mensagem enviada!",
        successDesc: "Obrigado pelo contato. Retornarei em breve.",
        error: "Erro ao enviar mensagem. Tente de novo ou me chame por email.",
      },
    },
    footer: {
      rights: "Feito com Next.js, Tailwind e Framer Motion.",
      backToTop: "Voltar ao topo",
    },
  },
  en: {
    nav: {
      inicio: "Home",
      projetos: "Projects",
      vela: "Vela Studio",
      servicos: "Services",
      experiencia: "Experience",
      contato: "Contact",
      numeros: "Numbers",
      label: "Main navigation",
      menuOpen: "Open menu",
      menuClose: "Close menu",
      menuTitle: "Menu",
      menuDescription: "Site sections, language and theme.",
      menuSections: "Sections",
      language: "Language",
      theme: "Theme",
      themeDark: "Dark",
      themeLight: "Light",
    },
    hero: {
      eyebrow: "Eduardo dos Santos",
      photoAlt: "Portrait of Eduardo dos Santos, senior front-end engineer, smiling with glasses",
      role: "Senior Front-End Engineer",
      titleLine1: "Real software,",
      titleLine2: "running in production.",
      description: "Senior Front-End Engineer with 9 years of experience in React, Next.js and TypeScript, building products that run in production and hold up under real users. Design Systems, web performance and front-end architecture.",
      ctaProjects: "See projects",
      contact: "Talk to me",
      downloadCV: "Download CV",
      location: "Itajaí, SC · Remote",
      available: "Open to roles and projects",
      localTime: "Local time",
      scroll: "Scroll",
      facts: "9 yrs · React · Next.js · TypeScript",
    },
    stack: {
      label: "Stack in production",
    },
    projects: {
      label: "Projects",
      title: "Featured projects",
      subtitle: "Products built by Vela Studio, my software house, and career deliveries for large companies.",
      filterLabel: "Filter projects",
      filters: { all: "All", vela: "Vela Studio", career: "Career" },
      status: { live: "Live", dev: "In dev", published: "Published", delivered: "Delivered" },
      groups: { vela: "Vela Studio", career: "Career" },
      viewProject: "View project",
      noPreview: "Private npm package, no public page",
      items: [
        { title: "SuaArena Torneios", desc: "Sports tournament platform in production, with more than 500 competitions run. Live brackets (double elimination and groups), rankings, QR Code check-in and real-time updates over SSE." },
        { title: "SuaArena Arenas", desc: "Sports venue management sold in modules: students, classes and scheduling. One module connects the venue to SuaArena Torneios so it can run its own championships." },
        { title: "SuaArena Ferinos", desc: "Pickup games and multi-sport tournaments: roster, balanced team draw, live goals and assists, rankings and Pix payments. Web version and native app." },
        { title: "AmeConsulta", desc: "Medical imaging and reporting system in production, with DICOM/Orthanc integration to ultrasound machines and a portal where patients access their own exams." },
        { title: "Gonix (FisioAnalysis)", desc: "PWA for physical assessment with configurable criteria, PDF reports and scheduling. pnpm + Turborepo monorepo with NestJS, Prisma, MariaDB and Zod." },
        { title: "Vela Connect", desc: "Multi-tenant WhatsApp notification microservice (Meta Cloud API) with BullMQ/Redis queues, PostgreSQL and Prisma. It brings WhatsApp to Vela's and its clients' systems." },
        { title: "SuaArena Design System", desc: "Shared Design System published as a private npm package, with components documented in Storybook, Tailwind CSS, Radix and design tokens." },
        { title: "Suprema Gaming & Co.", desc: "Sports betting platform developed with React and BetConstruct integration, including CMS for affiliate management, performance analysis and content distribution. Scalable infrastructure on AWS." },
        { title: "Cobasi & SPet (Accurate Software)", desc: "Development of Cobasi e-commerce with React, VTEX and SASS, including SPet system for pet service scheduling. Implementation of reusable components and optimization that improved Core Web Vitals by 40%." },
        { title: "GM Commercial Proposals (Accurate Software)", desc: "Development of GM Proposals system for vehicle financing and purchase with CPF/CNPJ and address queries. Integration with insurance APIs and DocuSign for digital contract signing." },
      ],
    },
    vela: {
      label: "Vela Studio",
      title: "Vela Studio,",
      titleMuted: "my software house.",
      lead: "I take companies off paper, spreadsheets and improvised systems and deliver custom software that solves the real pain of the business.",
      body: "Every project starts from the client's operation, not from the technology: I learn how the work happens today, design the system around it and stay on it from the first sketch to deploy. The products below are Vela's own and run in production.",
      founded: "Founded",
      foundedValue: "2026",
      base: "Based in",
      baseValue: "Itajaí, SC, Brazil",
      productsTitle: "Vela products",
      linksTitle: "Talk to Vela",
      site: "Website",
      instagram: "Instagram",
      whatsapp: "Sales WhatsApp",
      email: "Email",
      cta: "Talk to Vela on WhatsApp",
      logoAlt: "Vela Studio logo",
    },
    numbers: {
      label: "Numbers",
      title: "Facts, no fluff.",
      years: "years of front-end experience",
      cwv: "Core Web Vitals on the Cobasi e-commerce",
      betting: "years and 7 months on high-traffic sports betting",
      competitions: "competitions run on SuaArena",
    },
    services: {
      label: "Services",
      title: "What I deliver",
      stackTitle: "Stack",
      items: [
        { title: "Front-end architecture", desc: "Clear architecture, state in the right layer and reusable components the team can maintain." },
        { title: "Performance and Core Web Vitals", desc: "Delivered a 40% improvement on a large-scale e-commerce." },
        { title: "Design Systems", desc: "Design Systems and standards that speed up the whole team." },
        { title: "APIs and business rules", desc: "REST API integration, authentication and complex business rules." },
        { title: "Technical leadership", desc: "Technical specs, code review and mentoring." },
        { title: "Custom products (Vela Studio)", desc: "Operations running on paper, spreadsheets or improvised systems become tailored digital products, from the database to deploy." },
      ],
      skills: ["React", "Next.js", "TypeScript", "JavaScript ES6+", "Node.js", "NestJS", "Express", "Tailwind CSS", "SASS", "shadcn/ui", "Radix UI", "React Query", "Prisma", "PostgreSQL", "MySQL", "MongoDB", "Docker", "AWS (EC2, S3, RDS)", "Azure", "Vercel", "Git", "CI/CD", "Jest", "React Testing Library", "Cypress", "Storybook", "Scrum", "Kanban"],
    },
    experience: {
      label: "Experience",
      title: "Professional experience",
      present: "Present",
      aboutTitle: "About me",
      about: [
        "Senior Front-End Engineer with 9 years of experience in React, Next.js and TypeScript, building products that run in production and hold up under real users.",
        "I currently work on the front-end at Accurate Software, on the GM Financial project, a vehicle proposal and financing platform used by dealerships across Brazil. I took over technical leadership of the front-end: I write the technical issue specs, define component standards and run code reviews.",
        "Before that, I spent 4 years and 7 months on sports betting platforms (Arena 22 and, after the acquisition, Suprema Gaming), working with React, TypeScript and Azure infrastructure on high-traffic products.",
        "In parallel, I am co-founder of Vela Studio, where I design and build SaaS products end to end.",
      ],
      education: "Education",
      educationText: "BSc in Information Systems (Centro Universitário FAM) and Technical Degree in IT.",
      languages: "Languages",
      languagesList: "Portuguese (native) · English B2",
      availability: "Availability",
      availabilityText: "Open to full-time or contract roles in Brazil and abroad, and to freelance projects. Remote, hybrid or on-site in the Itajaí, Joinville and Blumenau region, SC.",
      items: [
        {
          company: "Accurate Software",
          role: "Senior Front-End Engineer | Technical Lead",
          period: "Jan/2026 · Present",
          summary: "GM Financial project: a vehicle proposal and financing platform used by dealerships across Brazil (React, Vite, GM proprietary Design System).",
          points: [
            "Took over technical leadership of the front-end, writing detailed technical issue specs (business rules, access roles, API contracts, acceptance criteria and affected components) that guide the team",
            "Build features in React and TypeScript on top of the GM Design System, with internationalization (i18n) and REST API integration",
            "Standardized the technical spec structure between front-end and back-end, reducing rework and scope ambiguity",
            "Run code reviews and define standards for components, state and module organization",
            "Work with the PO and a multidisciplinary agile team, turning business stories into executable technical requirements",
          ],
        },
        {
          company: "Vela Studio",
          role: "Co-founder & Full Stack Developer",
          period: "Jun/2026 · Present",
          summary: "My own software house, focused on turning operations that run on paper, spreadsheets or improvised systems into tailored digital products. I design, build and maintain the products from scratch to deploy.",
          points: [
            "SuaArena: sports venue and tournament management in production, with more than 500 competitions run, live brackets, rankings, QR Code check-in and real-time updates over SSE",
            "AmeConsulta: medical imaging and reporting system in production, with DICOM/Orthanc integration to ultrasound machines and a patient portal",
            "FisioAnalysis: PWA for physical assessment with configurable criteria, in a pnpm + Turborepo monorepo with NestJS, Prisma and MariaDB",
            "Shared Design System published as a private npm package, with components documented in Storybook",
            "Multi-tenant WhatsApp notification microservice (Meta Cloud API) with BullMQ/Redis queues, PostgreSQL and Prisma",
          ],
        },
        {
          company: "Suprema Gaming & Co.",
          role: "Front-End Developer",
          period: "Jul/2023 · Jan/2026",
          summary: "High-traffic sports betting platforms, continuing the projects after Suprema acquired Arena 22.",
          points: [
            "Built and evolved React and TypeScript interfaces for a sports betting platform integrated with BetConstruct",
            "Worked on a product with high concurrent traffic, prioritizing rendering performance, scalability and production stability",
            "Implemented end-to-end automated tests with Cypress, reducing regressions on every release",
            "Built a CMS for affiliate management, performance analysis and content distribution",
            "Maintained and shipped applications on cloud infrastructure (Azure and AWS) with a CI/CD pipeline",
            "Collaborated with design, backend and QA in agile cycles (Scrum/Kanban)",
          ],
        },
        {
          company: "Arena 22",
          role: "Front-End Developer",
          period: "May/2021 · Jul/2023",
          summary: "Sports betting and fantasy games platform, acquired by Suprema Gaming & Co., with the project continuing under the new organization.",
          points: [
            "Built the platform interfaces in React, with reusable components and an architecture ready to scale",
            "Implemented Figma prototypes with visual fidelity, focused on responsiveness and accessibility",
            "Wrote end-to-end tests with Cypress to ensure delivery quality",
            "Worked on the Azure infrastructure, monitoring stability and performance in production",
          ],
        },
        {
          company: "Accurate Software",
          role: "Front-End Developer",
          period: "May/2019 · Oct/2021",
          summary: "Mid and large-scale projects for retail and automotive clients.",
          points: [
            "Built the Cobasi e-commerce in React and SASS on the VTEX platform, with optimizations that delivered a 40% improvement in Core Web Vitals",
            "Built SPet, the scheduling portal for veterinary services (bath, grooming and appointments) of the brand's own clinic, in React, Node.js and MongoDB",
            "Integrated the GM Propostas system (React and Java) with insurance APIs, CPF/CNPJ and address lookups, and digital signature via DocuSign",
            "Created reusable components and applied design patterns that reduced code duplication across projects",
            "Mentored junior developers and ran code reviews, raising the team's quality bar",
          ],
        },
        {
          company: "Superare",
          role: "Front-End Developer",
          period: "Nov/2017 · May/2019",
          summary: "Landing pages and web solutions for communication and telecom clients, including Claro and NET.",
          points: [
            "Built interfaces with JavaScript, SCSS and Pug (Jade), with build automation via Gulp",
            "Implemented and customized WordPress solutions",
            "Focused on performance, responsiveness and front-end best practices",
          ],
        },
        {
          company: "Studio Visual",
          role: "Front-End Developer",
          period: "May/2017 · Nov/2017",
          summary: "Web solutions on WordPress and WooCommerce.",
          points: [
            "Built interfaces in HTML5, CSS3 and JavaScript",
            "Implemented and customized features in PHP",
            "Applied web standards, responsiveness and UI/UX principles",
          ],
        },
      ],
    },
    a11y: {
      skipToContent: "Skip to main content",
      switchLanguage: "Mudar para Português",
      lightTheme: "Switch to light theme",
      darkTheme: "Switch to dark theme",
    },
    contact: {
      label: "Contact",
      title: "Let's talk?",
      subtitle: "I'm open to roles in Brazil and abroad, and to new projects. Tell me what you need and I'll get back to you soon.",
      direct: "Direct contact",
      form: {
        name: "Name",
        email: "Email",
        message: "Message",
        send: "Send message",
        sending: "Sending...",
        nameError: "Name must be at least 2 characters.",
        emailError: "Invalid email.",
        messageError: "Message must be at least 10 characters.",
        successTitle: "Message sent!",
        successDesc: "Thank you for contacting. I'll get back to you soon.",
        error: "Could not send the message. Try again or reach me by email.",
      },
    },
    footer: {
      rights: "Built with Next.js, Tailwind and Framer Motion.",
      backToTop: "Back to top",
    },
  },
};
