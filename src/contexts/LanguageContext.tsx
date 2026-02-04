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
  getCvUrl: () => string;
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
    const locals = ["Remoto", "São Paulo, SP", "São Paulo, SP"];
    return items.map((item, i) => ({ ...item, local: locals[i] }));
  };

  const getCvUrl = () => {
    return language === "pt" ? "/cv.pdf" : "/cv_en.pdf";
  };

  const value = useMemo(() => ({ language, setLanguage, t, getServices, getProjects, getExperience, getCvUrl }), [language]);

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
      description: "Desenvolvedor Full Stack com 7+ anos de experiência. Especialista em React, Next.js e Node.js. Foco em entrega de resultados, trabalho em equipe e resolução de problemas complexos.",
      downloadCV: "Baixar CV",
      contact: "Entre em Contato",
    },
    about: {
      title: "Sobre Mim",
      description: "Desenvolvedor Front-End com mais de 7 anos de experiência na criação de aplicações web escaláveis, atuando principalmente com React, Next.js, TypeScript e integração com APIs em Node.js. Experiência sólida em produtos digitais nos setores de tecnologia, e-commerce e apostas esportivas, trabalhando com times distribuídos e ambientes em nuvem. Formado em Sistemas de Informação e Técnico em Informática.",
      skills: "Stack Técnica",
      skillsDesc: [
        "Frontend: React, Next.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, SASS",
        "Backend: Node.js, Express, REST APIs",
        "Databases: MongoDB, MySQL, PostgreSQL",
        "Tools: Git, Docker, AWS, Azure, Vercel, Cypress, Jest",
        "CMS: WordPress, VTEX"
      ],
      languages: "Idiomas",
      languagesList: "Português (Nativo) • Inglês (B2 - Intermediário-Avançado)",
      workStyle: "Estilo de Trabalho",
      workStyleDesc: [
        "Trabalho remoto com times distribuídos",
        "Colaboração com produto, design e back-end",
        "Entrega contínua e foco em qualidade",
        "Metodologias ágeis (Scrum/Kanban)",
        "Code review e mentoria"
      ],
    },
    services: {
      title: "Competências Principais",
      items: [
        { title: "Desenvolvimento Full Stack", desc: "Desenvolvimento de aplicações web completas com React, Next.js, Node.js e TypeScript. Experiência em arquitetura de software, APIs RESTful e bancos de dados SQL/NoSQL." },
        { title: "Performance & Otimização", desc: "Especialista em otimização de performance web, SEO técnico e acessibilidade (WCAG). Melhoria de Core Web Vitals e experiência do usuário." },
        { title: "Liderança Técnica", desc: "Experiência em mentoria de desenvolvedores júnior, code review, definição de arquitetura e boas práticas. Comunicação efetiva com stakeholders e gestão de projetos ágeis." },
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
          role: "Desenvolvedor Web Full Stack",
          period: "Jul/2023 – Atual",
          points: [
            "Desenvolvimento de plataformas de apostas esportivas com React, TypeScript e integração BetConstruct",
            "Criação de interfaces responsivas e acessíveis com foco em UX/UI e performance",
            "Implementação de testes automatizados com Cypress garantindo qualidade e redução de bugs",
            "Colaboração com equipe multidisciplinar (designers, backend, QA) em metodologia ágil",
            "Manutenção e deploy de aplicações em AWS com CI/CD",
          ],
        },
        {
          company: "Arena22",
          role: "Desenvolvedor Web Frontend",
          period: "Out/2021 – Jul/2023",
          points: [
            "Desenvolvimento de plataforma de fantasy games com React e Azure",
            "Implementação de arquitetura escalável e componentização reutilizável",
            "Colaboração direta com equipe de design para implementação de protótipos Figma",
            "Testes end-to-end com Cypress garantindo qualidade nas entregas",
            "Resolução proativa de problemas técnicos e otimização de performance",
          ],
        },
        {
          company: "Accurate Software",
          role: "Desenvolvedor Web Full Stack",
          period: "Mai/2019 – Out/2021",
          points: [
            "Desenvolvimento de sistema enterprise GM Propostas com React e Java para financiamento de veículos",
            "Integração com APIs de seguradoras e DocuSign para assinatura digital de contratos",
            "Desenvolvimento de e-commerce Cobasi (VTEX) resultando em 40% de melhoria no Core Web Vitals",
            "Criação de sistema SPet para agendamento de serviços usando React, Node.js e MongoDB",
            "Mentoria de desenvolvedores júnior e code review garantindo qualidade do código",
            "Implementação de boas práticas, design patterns e arquitetura limpa",
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
      description: "Full Stack Developer with 7+ years of experience. Expert in React, Next.js and Node.js. Focus on results delivery, teamwork and complex problem solving.",
      downloadCV: "Download CV",
      contact: "Get in Touch",
    },
    about: {
      title: "About Me",
      description: "Front-End Engineer with 7+ years of experience building scalable web applications, primarily using React, Next.js, TypeScript, and Node.js API integrations. Strong background in digital products across technology, e-commerce, and sports betting industries, working with distributed teams in remote-first environments. Bachelor’s degree in Information Systems.",
      skills: "Tech Stack",
      skillsDesc: [
        "Frontend: React, Next.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, SASS",
        "Backend: Node.js, Express, REST APIs",
        "Databases: MongoDB, MySQL, PostgreSQL",
        "Tools: Git, Docker, AWS, Azure, Vercel, Cypress, Jest",
        "CMS: WordPress, VTEX"
      ],
      languages: "Languages",
      languagesList: "Portuguese (Native) • English (B2 - Upper-Intermediate)",
      workStyle: "Work Style",
      workStyleDesc: [
        "Remote work with distributed teams",
        "Collaboration with product, design and backend",
        "Continuous delivery and quality focus",
        "Agile methodologies (Scrum/Kanban)",
        "Code review and mentoring"
      ],
    },
    services: {
      title: "Core Competencies",
      items: [
        { title: "Full Stack Development", desc: "Complete web application development with React, Next.js, Node.js and TypeScript. Experience in software architecture, RESTful APIs and SQL/NoSQL databases." },
        { title: "Performance & Optimization", desc: "Expert in web performance optimization, technical SEO and accessibility (WCAG). Core Web Vitals improvement and user experience enhancement." },
        { title: "Technical Leadership", desc: "Experience mentoring junior developers, code review, architecture definition and best practices. Effective communication with stakeholders and agile project management." },
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
          role: "Full Stack Web Developer",
          period: "Jul/2023 – Present",
          points: [
            "Development of sports betting platforms with React, TypeScript and BetConstruct integration",
            "Creation of responsive and accessible interfaces focused on UX/UI and performance",
            "Implementation of automated tests with Cypress ensuring quality and bug reduction",
            "Collaboration with multidisciplinary team (designers, backend, QA) in agile methodology",
            "Maintenance and deployment of applications on AWS with CI/CD",
          ],
        },
        {
          company: "Arena22",
          role: "Frontend Web Developer",
          period: "Oct/2021 – Jul/2023",
          points: [
            "Development of fantasy games platform with React and Azure",
            "Implementation of scalable architecture and reusable componentization",
            "Direct collaboration with design team for Figma prototype implementation",
            "End-to-end testing with Cypress ensuring delivery quality",
            "Proactive technical problem solving and performance optimization",
          ],
        },
        {
          company: "Accurate Software",
          role: "Full Stack Web Developer",
          period: "May/2019 – Oct/2021",
          points: [
            "Development of GM Proposals enterprise system with React and Java for vehicle financing",
            "Integration with insurance APIs and DocuSign for digital contract signing",
            "Development of Cobasi e-commerce (VTEX) resulting in 40% Core Web Vitals improvement",
            "Creation of SPet scheduling system using React, Node.js and MongoDB",
            "Mentoring junior developers and code review ensuring code quality",
            "Implementation of best practices, design patterns and clean architecture",
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
