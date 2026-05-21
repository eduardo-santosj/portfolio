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
      { ...items[3], capa: "/images/projetos/suaarena.png", link: "https://suaarena.com.br", repo: "", stack: ["React","Next.js","Node.js","Tailwind","MySQL","AWS"], tags: ["esportes","react","saas"] },
      { ...items[4], capa: "/images/projetos/ameconsulta.png", link: "https://exames.ameconsulta.com.br", repo: "", stack: ["React","Next.js","Node.js","Tailwind","PostgreSQL","AWS"], tags: ["saude","react","saas"] },
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
      description: "Desenvolvedor Full Stack com 7+ anos de experiência, focado em arquitetura de software e liderança técnica. Projeto e entrego sistemas escaláveis para diferentes setores, guiando times e definindo padrões de qualidade end-to-end.",
      downloadCV: "Baixar CV",
      contact: "Entre em Contato",
    },
    about: {
      title: "Sobre Mim",
      description: "Desenvolvedor Full Stack com mais de 7 anos de experiência, atuando no design de arquiteturas front-end e integrações de sistemas com React, Next.js, TypeScript e Node.js. Com histórico de decisões de stack, definição de padrões de código e mentoria de times, entrego produtos digitais escaláveis nos setores de saúde, e-commerce, esportes e apostas. Formado em Sistemas de Informação e Técnico em Informática.",
      skills: "Stack Técnica",
      skillsDesc: [
        "Frontend: React, Next.js, TypeScript, JavaScript ES6+, HTML5/CSS3, Tailwind CSS, SASS",
        "Backend: Node.js, Express, REST APIs",
        "Databases: MongoDB, MySQL, PostgreSQL",
        "DevOps & Tools: Git, Docker, AWS, Azure, Vercel, CI/CD",
        "Testing: Cypress, Jest, React Testing Library",
        "CMS & E-commerce: WordPress, VTEX"
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
      title: "Como Posso Ajudar",
      items: [
        { title: "Desenvolvimento Full Stack", desc: "Transformo ideias em aplicações web escaláveis e performáticas. Reduzo tempo de desenvolvimento com componentes reutilizáveis e arquitetura bem definida, garantindo código limpo e manutenível." },
        { title: "Performance & Otimização", desc: "Acelero aplicações web e melhoro experiência do usuário. Já alcancei 40% de melhoria em Core Web Vitals, aumentando conversão e satisfação dos usuários através de otimizações técnicas e SEO." },
        { title: "Liderança Técnica", desc: "Elevo a qualidade do código do time através de mentoria, code review e definição de padrões. Facilito comunicação entre áreas técnicas e negócio, garantindo entregas ágeis e alinhadas aos objetivos." },
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
        { title: "Sua Arena", desc: "Sistema completo de controle e gestão de campeonatos de FTV e Beach Tennis. Permite cadastro de atletas, chaves, resultados e rankings. Desenvolvido com Next.js, Node.js, Tailwind, Shadcn e banco MySQL hospedado na AWS." },
        { title: "AME Consulta – Gestão de Exames", desc: "Sistema de gerenciamento de exames para clínica médica com acesso diferenciado para pacientes e funcionários. Integração com máquinas de ultrassom via protocolo DICOM. Desenvolvido com Next.js, Node.js, Tailwind, Shadcn e PostgreSQL na AWS." },
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
    a11y: {
      skipToContent: "Pular para o conteúdo principal",
      lightTheme: "Ativar tema claro",
      darkTheme: "Ativar tema escuro",
      searchProjects: "Buscar projetos por nome, tecnologia ou categoria",
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
      description: "Full Stack Developer with 7+ years of experience focused on software architecture and technical leadership. I design and deliver scalable systems across industries, guiding teams and defining end-to-end quality standards.",
      downloadCV: "Download CV",
      contact: "Get in Touch",
    },
    about: {
      title: "About Me",
      description: "Full Stack Developer with 7+ years of experience in front-end architecture design and system integrations using React, Next.js, TypeScript, and Node.js. With a track record of stack decisions, code standard definition, and team mentorship, I deliver scalable digital products across healthcare, e-commerce, sports, and betting industries. Bachelor’s degree in Information Systems.",
      skills: "Tech Stack",
      skillsDesc: [
        "Frontend: React, Next.js, TypeScript, JavaScript ES6+, HTML5/CSS3, Tailwind CSS, SASS",
        "Backend: Node.js, Express, REST APIs",
        "Databases: MongoDB, MySQL, PostgreSQL",
        "DevOps & Tools: Git, Docker, AWS, Azure, Vercel, CI/CD",
        "Testing: Cypress, Jest, React Testing Library",
        "CMS & E-commerce: WordPress, VTEX"
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
      title: "How I Can Help",
      items: [
        { title: "Full Stack Development", desc: "Transform ideas into scalable and performant web applications. Reduce development time with reusable components and well-defined architecture, ensuring clean and maintainable code." },
        { title: "Performance & Optimization", desc: "Speed up web applications and improve user experience. Achieved 40% improvement in Core Web Vitals, increasing conversion and user satisfaction through technical optimizations and SEO." },
        { title: "Technical Leadership", desc: "Elevate team code quality through mentoring, code review and standards definition. Facilitate communication between technical and business areas, ensuring agile deliveries aligned with objectives." },
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
        { title: "Sua Arena", desc: "Complete tournament management system for FTV and Beach Tennis championships. Handles athlete registration, brackets, results and rankings. Built with Next.js, Node.js, Tailwind, Shadcn and MySQL on AWS." },
        { title: "AME Consulta – Exam Management", desc: "Medical exam management system with role-based access for patients and staff. Integrates with ultrasound machines via DICOM protocol. Built with Next.js, Node.js, Tailwind, Shadcn and PostgreSQL on AWS." },
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
    a11y: {
      skipToContent: "Skip to main content",
      lightTheme: "Switch to light theme",
      darkTheme: "Switch to dark theme",
      searchProjects: "Search projects by name, technology or category",
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
