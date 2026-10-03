"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "pt" | "en";

export type ProjectStatus = "live" | "dev" | "published" | "delivered";
export type ProjectGroup = "vela" | "career";

export interface Project {
  id: string;
  title: string;
  /** Linha curta, sempre visível no card. */
  short: string;
  problem: string;
  solution: string;
  how: string;
  /** Só fato real; vazio quando não há resultado a mostrar. */
  result: string;
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
type ProjectCopy = Pick<Project, "title" | "short" | "problem" | "solution" | "how" | "result">;

const PROJECT_DATA: Array<Omit<Project, keyof ProjectCopy>> = [
  { id: "torneios", capa: "/images/projetos/suaarena-torneios.png", link: "https://suaarena.com.br", repo: "", stack: ["Next.js", "Node.js", "MySQL", "SSE", "AWS", "Nginx"], tags: ["esportes", "saas", "realtime"], status: "live", group: "vela" },
  { id: "arenas", capa: "/images/projetos/suaarena-arenas.png", link: "https://interno.suaarena.com.br", repo: "", stack: ["Next.js", "Node.js", "MariaDB", "Tailwind"], tags: ["esportes", "saas", "gestao"], status: "live", group: "vela" },
  { id: "ferinos", capa: "/images/projetos/ferinos.png", link: "https://ferinos.suaarena.com.br/torneios", repo: "", stack: ["Node.js", "Express", "MySQL", "Pix"], tags: ["esportes", "app", "freemium"], status: "live", group: "vela" },
  { id: "ameconsulta", capa: "/images/projetos/ameconsulta-2026.png", link: "https://exames.ameconsulta.com.br", repo: "", stack: ["Next.js", "Express", "TypeScript", "PostgreSQL", "Orthanc", "AWS"], tags: ["saude", "dicom", "saas"], status: "live", group: "vela" },
  { id: "gonix", capa: "/images/projetos/gonix.png", link: "https://gonix.com.br", repo: "", stack: ["NestJS", "Prisma", "MariaDB", "Next.js", "Turborepo", "Zod"], tags: ["saude", "esportes", "saas"], status: "live", group: "vela" },
  { id: "vela-connect", capa: "/images/projetos/vela-connect.png", link: "https://velaconnect.com.br", repo: "", stack: ["Node.js", "TypeScript", "BullMQ", "Redis", "PostgreSQL", "Prisma"], tags: ["whatsapp", "api", "multi-tenant"], status: "live", group: "vela" },
  { id: "design-system", capa: "", link: "", repo: "", stack: ["React", "TypeScript", "Tailwind", "Radix", "Storybook", "tsup"], tags: ["design-system", "ui"], status: "published", group: "vela" },
  { id: "suprema", capa: "/images/projetos/suprema.png", link: "https://suprema.bet.br", repo: "", stack: ["React", "TypeScript", "Cypress", "Azure", "AWS"], tags: ["gaming", "react"], status: "delivered", group: "career" },
  { id: "cobasi", capa: "/images/projetos/cobasi.png", link: "https://www.cobasi.com.br", repo: "", stack: ["React", "SASS", "VTEX"], tags: ["ecommerce", "pet"], status: "delivered", group: "career" },
  { id: "gm", capa: "/images/projetos/chevrolet.png", link: "https://chevroletdigital.com.br", repo: "", stack: ["React", "Java", "DocuSign"], tags: ["automotivo", "enterprise"], status: "delivered", group: "career" },
];

const SERVICE_DATA: Array<Pick<Service, "id" | "tags">> = [
  { id: "architecture", tags: ["React", "Next.js", "TypeScript", "React Query"] },
  { id: "performance", tags: ["Core Web Vitals", "SSR", "SEO"] },
  { id: "design-system", tags: ["shadcn/ui", "Radix UI", "Storybook"] },
  { id: "integration", tags: ["REST", "Auth", "Node.js", "NestJS"] },
  { id: "leadership", tags: ["Specs", "Code review", "Mentoria"] },
  { id: "quality", tags: ["Jest", "Cypress", "Testing Library", "CI/CD"] },
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
      const items = t("projects.items") as unknown as ProjectCopy[];
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
      servicos: "Como trabalho",
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
      description: "Construo interfaces e produtos que gente de verdade usa todo dia: de plataforma de apostas com alto tráfego a sistema de laudo médico. Hoje lidero o front-end de uma plataforma de financiamento de veículos e toco os produtos da minha software house, a Vela Studio.",
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
      subtitle: "Produtos que construí na Vela Studio, minha software house, e projetos de carreira em times de empresas grandes. Cada um começa pelo problema de quem usa.",
      filterLabel: "Filtrar projetos",
      filters: { all: "Todos", vela: "Vela Studio", career: "Carreira" },
      status: { live: "No ar", dev: "Em desenvolvimento", published: "Publicado", delivered: "Entregue" },
      blocks: { problem: "Problema", solution: "Solução", how: "Como fiz", result: "Resultado" },
      showDetails: "Ver como fiz",
      hideDetails: "Fechar detalhes",
      groups: { vela: "Vela Studio", career: "Carreira" },
      viewProject: "Ver projeto",
      noPreview: "Pacote npm privado, sem página pública",
      items: [
        {
          title: "SuaArena Torneios",
          short: "Torneios de areia com chave, placar e ranking ao vivo, do cadastro à final.",
          problem: "Organizar torneio de beach tennis, futevôlei ou vôlei de praia costuma ser um malabarismo: inscrição por mensagem, chave montada à mão e atleta perguntando a toda hora quando é o próximo jogo.",
          solution: "Uma plataforma em que o organizador abre inscrições com pagamento, gera as chaves (grupos e dupla eliminação), lança o placar e todo mundo acompanha o resultado em tempo real pelo celular. Check-in por QR Code no dia do evento e ranking no final.",
          how: "Desenhei e construí o sistema inteiro, do banco ao deploy. Para o placar ao vivo escolhi SSE em vez de WebSocket: o fluxo é só do servidor para o público, então fica mais simples de escalar atrás do Nginx. O front é Next.js, a API é Node.js com MySQL, e tudo roda na AWS (EC2, S3, PM2).",
          result: "Mais de 500 competições realizadas na plataforma, entre elas o Claro Beach Volley e o Sand Games Itajaí.",
        },
        {
          title: "SuaArena Arenas",
          short: "Gestão de arena esportiva por módulos: alunos, turmas, agenda e recepção.",
          problem: "Arena de esporte de areia vive de aluno mensalista, turma fixa e quadra alugada. Sem sistema, presença, inadimplência e horário ficam espalhados entre caderno, planilha e conversa de WhatsApp.",
          solution: "Um sistema vendido por módulos, em que a arena liga só o que usa: matrícula, turmas por esporte, presença, check-in, recepção e ponto de venda. Um dos módulos conecta a arena ao SuaArena Torneios para ela rodar os próprios campeonatos.",
          how: "Construí do zero, front e back. A decisão central foi dar a cada pessoa uma identidade única, ancorada no CPF e com QR Code próprio: o mesmo QR serve para check-in, presença e busca no caixa (lido pela webcam). Next.js, Node.js e MariaDB, com CI/CD desde o primeiro deploy.",
          result: "Em produção desde agosto de 2026, com 2 arenas piloto.",
        },
        {
          title: "SuaArena Ferinos",
          short: "A pelada dos amigos organizada: presença, sorteio de times, gols e ranking.",
          problem: "Na pelada de toda semana, alguém sempre fica com a lista de presença, o sorteio dos times, a contagem dos gols e a cobrança da mensalidade, tudo no grupo de WhatsApp.",
          solution: "Uma plataforma para o organizador montar o elenco, sortear times equilibrados, registrar gols e assistências durante o jogo e acompanhar ranking e financeiro com Pix. Serve para pelada e para torneio amador de vários esportes.",
          how: "Construí a API em Node.js (Express) com MySQL e a versão web sobre o Design System do SuaArena, que também vai servir de base para os apps nativos. O modelo é freemium: o plano gratuito tem anúncio e o Premium libera recursos extras.",
          result: "Versão web no ar; apps nativos para iOS e Android a caminho.",
        },
        {
          title: "AmeConsulta",
          short: "Laudo de ultrassom do aparelho ao celular do paciente, sem redigitar nada.",
          problem: "Em clínica de imagem, o exame sai do aparelho de ultrassom, o laudo é escrito em outro lugar e a entrega para o paciente ainda depende de papel ou de ir buscar pessoalmente.",
          solution: "Um sistema de laudos integrado direto aos aparelhos: o exame entra na lista de trabalho do médico, o laudo é escrito e assinado na plataforma e o paciente acessa os próprios exames por um portal.",
          how: "Fiz o produto de ponta a ponta. A peça mais delicada foi a integração DICOM com o Orthanc, servidor que recebe as imagens dos aparelhos e alimenta a lista de trabalho. Front em Next.js, API em Node.js com Express e TypeScript, PostgreSQL, Docker e AWS (RDS, S3, SES). Agora o mesmo código está virando multi-tenant, para atender outros hospitais com a marca de cada um.",
          result: "Em produção, usado no dia a dia da clínica.",
        },
        {
          title: "Gonix",
          short: "Avaliação física esportiva do goniômetro ao laudo, sem passar pela planilha.",
          problem: "Fisioterapeuta esportivo mede amplitude, força e salto do atleta e depois monta o laudo na mão, em planilha ou em papel, juntando números de várias ferramentas.",
          solution: "Uma plataforma em que o fisio registra a avaliação, o sistema calcula e compara com os critérios do esporte, e o laudo em PDF sai pronto. Tem agenda online, portal do paciente e funciona no celular como app (PWA).",
          how: "Projetei para que nenhum critério clínico fique fixo no código: tudo é parametrizável, porque cada esporte e cada clínica avaliam de um jeito. O cálculo vive num pacote isolado e testado, separado da API (NestJS, Prisma, MariaDB) e do front (Next.js), num monorepo com contratos validados por Zod. CPF fica cifrado no banco, por LGPD.",
          result: "Primeira clínica usando em produção desde setembro de 2026.",
        },
        {
          title: "Vela Connect",
          short: "Avisos por WhatsApp para qualquer sistema, pela API oficial da Meta.",
          problem: "Confirmação de agendamento, lembrete e aviso de pagamento chegam melhor pelo WhatsApp, mas cada sistema teria que integrar a Meta sozinho, e soluções não oficiais derrubam o número.",
          solution: "Um serviço que qualquer sistema chama para disparar mensagens transacionais pelo WhatsApp, com envio imediato ou agendado e nova tentativa automática quando falha. Cada empresa cliente usa o próprio número, com painel, planos e cobrança recorrente.",
          how: "Usei só a API oficial da Meta (Cloud API) e isolei cada cliente: número e credenciais próprios, token cifrado, mensagens que nunca se misturam. As filas com BullMQ e Redis cuidam de agendamento e retentativa; Node.js com TypeScript, PostgreSQL e Prisma no back, painel em Next.js.",
          result: "No ar desde setembro de 2026 e aprovado no App Review da Meta. Atende os produtos da Vela e tem os primeiros clientes em implantação.",
        },
        {
          title: "SuaArena Design System",
          short: "Um pacote de componentes para os produtos SuaArena terem a mesma cara.",
          problem: "Com três produtos da mesma família, cada um refazendo botão, formulário e tabela, a interface começa a divergir e cada ajuste precisa ser feito três vezes.",
          solution: "Um Design System único, publicado como pacote, que os produtos instalam como dependência. Mudou o componente, todos recebem na próxima versão.",
          how: "Montei sobre Radix e Tailwind, com tokens de design para cor, espaço e tipografia, e documentei cada componente no Storybook. O pacote é gerado com tsup e publicado como pacote npm privado.",
          result: "",
        },
        {
          title: "Suprema Gaming & Co.",
          short: "Front-end de plataforma de apostas esportivas com alto volume de acesso simultâneo.",
          problem: "Em apostas esportivas, a tela muda o tempo todo durante o jogo e milhares de pessoas acessam ao mesmo tempo. Interface lenta ou instável é aposta perdida e cliente que vai embora.",
          solution: "A plataforma de apostas integrada à BetConstruct e um CMS interno para gestão de afiliados, análise de performance e distribuição de conteúdo.",
          how: "Fui um dos dois front-ends de um time enxuto: dois front-ends, dois back-ends, um designer cuidando do Design System e um QA, em ciclos ágeis. Desenvolvi e evoluí as interfaces em React e TypeScript com foco em performance de renderização, escrevi testes end to end em Cypress para segurar regressão a cada release e mantive a publicação em Azure e AWS com CI/CD.",
          result: "",
        },
        {
          title: "Cobasi & SPet (Accurate Software)",
          short: "E-commerce de grande porte mais rápido e um portal de agendamento de banho, tosa e consulta.",
          problem: "Num e-commerce do tamanho da Cobasi, página lenta derruba conversão e ranking no Google. Do lado da clínica da marca, o agendamento de banho, tosa e consulta precisava de um canal próprio.",
          solution: "No e-commerce, componentes reutilizáveis e otimizações de carregamento sobre a VTEX. Para a clínica, o SPet, portal de agendamento de serviços veterinários.",
          how: "Pela Accurate Software, atuei como desenvolvedor front-end no e-commerce, em React e SASS sobre a VTEX, atacando o que pesava nas métricas de Core Web Vitals. No SPet, desenvolvi cerca de 80% do front-end em React, integrado à API do time de back-end.",
          result: "40% de melhoria nos Core Web Vitals do e-commerce.",
        },
        {
          title: "GM Propostas (Accurate Software)",
          short: "Proposta de financiamento de veículo com consultas e assinatura digital no mesmo fluxo.",
          problem: "Fechar a proposta de compra e financiamento de um veículo dependia de várias consultas (CPF/CNPJ, endereço, seguradora) e de contrato assinado, o que travava a venda.",
          solution: "Um sistema de propostas comerciais que reúne as consultas e as cotações de seguradoras e leva o contrato para assinatura digital.",
          how: "Pela Accurate Software, fiz a integração do front em React com o back-end em Java e com os serviços externos: APIs de seguradoras, consultas de CPF/CNPJ e endereço, e a assinatura de contratos com as certificadoras digitais.",
          result: "Assinatura 100% digital, com integração a seguradoras e a certificadoras digitais (DocuSign, Certisign e Unico, com validação por selfie).",
        },
      ],
    },
    vela: {
      label: "Vela Studio",
      title: "Vela Studio,",
      titleMuted: "minha software house.",
      lead: "Tiro empresas do papel, da planilha e do sistema improvisado e entrego software sob medida, que resolve a dor real do negócio.",
      body: "Cada projeto começa pela operação, não pela tecnologia: entendo como o trabalho acontece hoje, desenho o sistema em cima disso e acompanho do primeiro rascunho ao deploy. Além dos projetos de clientes, a Vela mantém produtos próprios no ar.",
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
      competitions: "competições realizadas no SuaArena Torneios",
    },
    services: {
      label: "Como trabalho",
      title: "No que sou forte",
      stackTitle: "Stack",
      items: [
        { title: "Arquitetura front-end", desc: "Estado no lugar certo, componentes que se reaproveitam e uma estrutura que o próximo dev entende sem precisar de mim." },
        { title: "Performance", desc: "Meço antes de otimizar. No e-commerce da Cobasi, isso virou 40% de melhoria nos Core Web Vitals." },
        { title: "Design System", desc: "Componentes documentados e tokens compartilhados, para o time parar de refazer a mesma tela de jeitos diferentes." },
        { title: "APIs e regras de negócio", desc: "Integração com APIs REST, autenticação e regras complexas, como financiamento, laudo médico e pagamento, traduzidas em fluxo que o usuário entende." },
        { title: "Liderança técnica", desc: "Escrevo especificações técnicas que tiram a ambiguidade antes do código, faço code review e oriento quem está começando." },
        { title: "Testes e qualidade", desc: "Testes end to end com Cypress desde a época das apostas, e hoje unitários, de integração e e2e rodando no CI dos meus produtos. Bug pego antes do deploy custa menos." },
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
          summary: "Software house própria. Transformo operações que rodam em papel, planilha ou sistema improvisado em produto digital sob medida.",
          points: [
            "Projeto, desenvolvo e mantenho os produtos de ponta a ponta: produto, banco, API, front-end, infraestrutura e deploy",
            "Seis produtos no ar (esportes, saúde e comunicação por WhatsApp) e um Design System compartilhado; os detalhes estão nos projetos acima",
            "Infraestrutura na AWS com CI/CD, testes automatizados no pipeline e atenção à LGPD desde o desenho",
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
            "Desenvolvi cerca de 80% do front-end do SPet, portal de agendamento de serviços veterinários (banho, tosa e consultas) da clínica própria da marca, em React",
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
        email: "E-mail",
        message: "Mensagem",
        send: "Enviar mensagem",
        sending: "Enviando...",
        nameError: "Nome deve ter pelo menos 2 caracteres.",
        emailError: "E-mail inválido.",
        messageError: "Mensagem deve ter pelo menos 10 caracteres.",
        successTitle: "Mensagem enviada!",
        successDesc: "Obrigado pelo contato. Retornarei em breve.",
        error: "Erro ao enviar a mensagem. Tente de novo ou me chame por e-mail.",
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
      servicos: "How I work",
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
      description: "I build interfaces and products that real people use every day, from high-traffic betting platforms to medical reporting systems. Today I lead the front-end of a vehicle financing platform and run the products of my own software house, Vela Studio.",
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
      title: "Selected work",
      subtitle: "Products I built at Vela Studio, my software house, and career projects on teams at large companies. Each one starts with the problem of the people using it.",
      filterLabel: "Filter projects",
      filters: { all: "All", vela: "Vela Studio", career: "Career" },
      status: { live: "Live", dev: "In development", published: "Published", delivered: "Delivered" },
      blocks: { problem: "Problem", solution: "Solution", how: "How I built it", result: "Outcome" },
      showDetails: "See how I built it",
      hideDetails: "Hide details",
      groups: { vela: "Vela Studio", career: "Career" },
      viewProject: "View project",
      noPreview: "Private npm package, no public page",
      items: [
        {
          title: "SuaArena Torneios",
          short: "Beach sports tournaments with live brackets, scores and rankings, from sign-up to the final.",
          problem: "Running a beach tennis, footvolley or beach volleyball tournament is usually a juggling act: sign-ups over text messages, brackets drawn by hand and players constantly asking when their next match starts.",
          solution: "A platform where organizers open paid registration, generate brackets (groups and double elimination), enter scores, and everyone follows results live on their phone. QR Code check-in on event day and a ranking at the end.",
          how: "I designed and built the whole system, from the database to deployment. For live scores I chose Server-Sent Events over WebSockets: data only flows from server to audience, so it is simpler to scale behind Nginx. Next.js on the front, a Node.js API with MySQL, all running on AWS (EC2, S3, PM2).",
          result: "More than 500 competitions run on the platform, including Claro Beach Volley and Sand Games Itajaí.",
        },
        {
          title: "SuaArena Arenas",
          short: "Modular management for sports venues: students, classes, schedule and front desk.",
          problem: "Beach sports venues run on monthly students, fixed classes and court rentals. Without a system, attendance, late payments and schedules end up scattered across notebooks, spreadsheets and WhatsApp chats.",
          solution: "A modular system where each venue turns on only what it uses: enrollment, classes per sport, attendance, check-in, front desk and point of sale. One module connects the venue to SuaArena Torneios so it can run its own tournaments.",
          how: "I built it from scratch, front and back. The core decision was giving each person a single identity, tied to their national ID and with their own QR Code: the same code works for check-in, attendance and lookup at the register (read through the webcam). Next.js, Node.js and MariaDB, with CI/CD from the first deploy.",
          result: "In production since August 2026, with 2 pilot venues.",
        },
        {
          title: "SuaArena Ferinos",
          short: "The weekly pickup game, organized: attendance, team draw, goals and rankings.",
          problem: "In every weekly pickup game, someone ends up handling the attendance list, the team draw, the goal count and the monthly fee, all inside a WhatsApp group.",
          solution: "A platform where the organizer builds the roster, draws balanced teams, logs goals and assists during the match, and tracks rankings and payments via Pix. It works for pickup games and for amateur tournaments across several sports.",
          how: "I built the Node.js (Express) API with MySQL and the web version on top of the SuaArena Design System, which will also be the base for the native apps. It is freemium: the free plan shows ads and Premium unlocks extra features.",
          result: "Web version live; native iOS and Android apps on the way.",
        },
        {
          title: "AmeConsulta",
          short: "Ultrasound reports from the machine to the patient's phone, with no retyping.",
          problem: "At imaging clinics, the exam comes out of the ultrasound machine, the report is written somewhere else, and getting it to the patient still depends on paper or a trip back to the clinic.",
          solution: "A reporting system integrated directly with the machines: the exam lands on the doctor's worklist, the report is written and signed on the platform, and patients access their own exams through a portal.",
          how: "I built the product end to end. The most delicate part was the DICOM integration with Orthanc, the server that receives images from the machines and feeds the worklist. Next.js on the front, a Node.js API with Express and TypeScript, PostgreSQL, Docker and AWS (RDS, S3, SES). The same codebase is now becoming multi-tenant, so other hospitals can use it under their own brand.",
          result: "In production, used daily by the clinic.",
        },
        {
          title: "Gonix",
          short: "Sports physical assessment from goniometer to report, no spreadsheet in between.",
          problem: "Sports physiotherapists measure an athlete's range of motion, strength and jumps, then build the report by hand in a spreadsheet or on paper, pulling numbers from several tools.",
          solution: "A platform where the physio records the assessment, the system scores it against each sport's criteria, and the PDF report comes out ready. It includes online booking, a patient portal, and runs on the phone as an app (PWA).",
          how: "I designed it so no clinical criterion is hardcoded: everything is configurable, because every sport and every clinic assesses differently. The scoring engine lives in an isolated, tested package, separate from the API (NestJS, Prisma, MariaDB) and the front-end (Next.js), in a monorepo with Zod-validated contracts. National IDs are encrypted at rest for LGPD compliance.",
          result: "First clinic using it in production since September 2026.",
        },
        {
          title: "Vela Connect",
          short: "WhatsApp notifications for any system, through Meta's official API.",
          problem: "Booking confirmations, reminders and payment notices land better on WhatsApp, but every system would have to integrate with Meta on its own, and unofficial workarounds get the number banned.",
          solution: "A service any system can call to send transactional WhatsApp messages, immediately or scheduled, with automatic retries when a send fails. Each client company uses its own number, with a dashboard, plans and recurring billing.",
          how: "I used only Meta's official Cloud API and isolated every client: their own number and credentials, encrypted tokens, messages that never mix. BullMQ and Redis queues handle scheduling and retries; Node.js with TypeScript, PostgreSQL and Prisma on the back end, with a Next.js dashboard.",
          result: "Live since September 2026 and approved in Meta's App Review. It serves Vela's own products and has its first clients onboarding.",
        },
        {
          title: "SuaArena Design System",
          short: "One component package so every SuaArena product looks and behaves the same.",
          problem: "With three products in the same family, each rebuilding buttons, forms and tables, the interfaces start to drift and every fix has to be made three times.",
          solution: "A single Design System, published as a package that the products install as a dependency. Change a component once and every product gets it in the next release.",
          how: "I built it on Radix and Tailwind, with design tokens for color, spacing and typography, and documented every component in Storybook. It is bundled with tsup and published as a private npm package.",
          result: "",
        },
        {
          title: "Suprema Gaming & Co.",
          short: "Front-end for a sports betting platform with heavy concurrent traffic.",
          problem: "In sports betting, the screen changes constantly during a match and thousands of people are on it at once. A slow or unstable interface means lost bets and users who leave.",
          solution: "The betting platform integrated with BetConstruct, plus an internal CMS for affiliate management, performance analytics and content distribution.",
          how: "I was one of two front-end developers on a lean team: two front-end, two back-end, one designer owning the Design System and one QA, working in agile cycles. I built and evolved the interfaces in React and TypeScript with a focus on rendering performance, wrote end-to-end tests in Cypress to catch regressions on every release, and maintained deployments on Azure and AWS with CI/CD.",
          result: "",
        },
        {
          title: "Cobasi & SPet (Accurate Software)",
          short: "A faster large-scale e-commerce and a booking portal for grooming and vet visits.",
          problem: "On an e-commerce the size of Cobasi, slow pages hurt conversion and search ranking. On the brand's own vet clinic side, booking grooming and appointments needed a dedicated channel.",
          solution: "On the store, reusable components and loading optimizations on top of VTEX. For the clinic, SPet, a booking portal for veterinary services.",
          how: "Through Accurate Software, I worked as a front-end developer on the store, in React and SASS on VTEX, going after what was dragging the Core Web Vitals scores. On SPet, I built about 80% of the React front-end, integrated with the back-end team's API.",
          result: "40% improvement in the store's Core Web Vitals.",
        },
        {
          title: "GM Propostas (Accurate Software)",
          short: "Vehicle financing proposals with lookups and digital signing in a single flow.",
          problem: "Closing a vehicle purchase and financing proposal required several lookups (tax ID, address, insurers) and a signed contract, which slowed the sale down.",
          solution: "A sales proposal system that brings the lookups and insurer quotes together and sends the contract for digital signature.",
          how: "Through Accurate Software, I integrated the React front-end with the Java back end and with external services: insurer APIs, tax ID and address lookups, and contract signing through digital certification providers.",
          result: "100% digital signing, integrated with insurers and digital certification providers (DocuSign, Certisign and Unico, with selfie verification).",
        },
      ],
    },
    vela: {
      label: "Vela Studio",
      title: "Vela Studio,",
      titleMuted: "my software house.",
      lead: "I take businesses off paper, spreadsheets and makeshift systems and deliver custom software that solves the real problem.",
      body: "Every project starts with the operation, not the technology: I learn how the work happens today, design the system around it and stay on it from the first sketch to deployment. Besides client work, Vela runs its own products in production.",
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
      cwv: "Core Web Vitals gain on Cobasi's e-commerce",
      betting: "years and 7 months on high-traffic sports betting",
      competitions: "competitions run on SuaArena Torneios",
    },
    services: {
      label: "How I work",
      title: "Where I'm strongest",
      stackTitle: "Stack",
      items: [
        { title: "Front-end architecture", desc: "State in the right layer, reusable components and a structure the next developer can follow without needing me." },
        { title: "Performance", desc: "I measure before I optimize. On Cobasi's e-commerce, that became a 40% improvement in Core Web Vitals." },
        { title: "Design Systems", desc: "Documented components and shared tokens, so the team stops rebuilding the same screen in different ways." },
        { title: "APIs and business rules", desc: "REST APIs, authentication and complex rules, like financing, medical reports and payments, turned into flows users understand." },
        { title: "Technical leadership", desc: "I write technical specs that remove ambiguity before any code is written, run code reviews and mentor developers who are starting out." },
        { title: "Testing and quality", desc: "End-to-end tests with Cypress since my betting platform days, and today unit, integration and e2e suites running in CI on my own products. A bug caught before deploy costs less." },
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
          summary: "My own software house. I turn operations that run on paper, spreadsheets or makeshift systems into custom digital products.",
          points: [
            "I design, build and maintain the products end to end: product, database, API, front-end, infrastructure and deployment",
            "Six products in production (sports, healthcare and WhatsApp messaging) plus a shared Design System; details are in the projects above",
            "AWS infrastructure with CI/CD, automated tests in the pipeline and LGPD (Brazil's data protection law) built in from the design stage",
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
            "Built about 80% of the front-end of SPet, the scheduling portal for veterinary services (bath, grooming and appointments) of the brand's own clinic, in React",
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
        error: "Couldn't send the message. Try again or reach me by email.",
      },
    },
    footer: {
      rights: "Built with Next.js, Tailwind and Framer Motion.",
      backToTop: "Back to top",
    },
  },
};
