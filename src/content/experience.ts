import type { EarlierRole, Localized, Period, Role } from "./types";

/** Employment, newest first. Overlapping dates are real: products ran alongside jobs. */
export const employment: Role[] = [
  {
    id: "tcn",
    company: "The Contract Network",
    title: {
      en: "Senior Full-Stack Engineer (AI Applications)",
      pt: "Engenheiro Full Stack Sênior (Aplicações com IA)",
    },
    period: { from: "2023-08", to: "2025-03" },
    context: {
      en: "Contract via Deel · remote · US company (Georgia)",
      pt: "Contractor via Deel · remoto · empresa dos EUA (Geórgia)",
    },
    bullets: {
      en: [
        "Built serverless, event-driven backend services on AWS for an LLM-based contract-analysis product: Lambda, Step Functions, EventBridge, SQS, API Gateway and MSK/Kafka.",
        "Orchestrated multi-step workflows with Step Functions and EventBridge, wiring the AI/ML team's model outputs into the application and its APIs.",
        "Wrote services in Node.js + TypeScript with Apollo GraphQL and Neo4j, and optimized the Neo4j read/write paths.",
        "Built the AWS infrastructure as code, with automated container deploys on ECS.",
        "Used Copilot and Cursor daily for code, tests and docs, with unit and integration tests validating generated code before merge.",
      ],
      pt: [
        "Construí serviços de backend serverless e orientados a eventos na AWS para um produto de análise de contratos baseado em LLMs: Lambda, Step Functions, EventBridge, SQS, API Gateway e MSK/Kafka.",
        "Orquestrei fluxos de várias etapas com Step Functions e EventBridge, levando as saídas dos modelos do time de IA/ML para a aplicação e suas APIs.",
        "Escrevi serviços em Node.js + TypeScript com Apollo GraphQL e Neo4j, e otimizei os caminhos de leitura e escrita do Neo4j.",
        "Construí a infraestrutura na AWS como código, com deploys automatizados de containers no ECS.",
        "Usei Copilot e Cursor no dia a dia para código, testes e documentação, com testes unitários e de integração validando o código gerado antes do merge.",
      ],
    },
  },
  {
    id: "matrix",
    company: "Matrix Energia",
    title: { en: "Tech Lead / Full-Stack Engineer", pt: "Tech Lead / Engenheiro Full Stack" },
    period: { from: "2022-08", to: "2024-02" },
    context: { en: "São Paulo, Brazil · energy", pt: "São Paulo, Brasil · energia" },
    bullets: {
      en: [
        "Led a full-stack team building service-based systems (Node.js services, REST APIs, messaging) integrated with AWS and Azure.",
        "Introduced CI, code review and testing standards that reduced production incidents by ~30%.",
        "Started the team on AI-assisted coding (Copilot, ChatGPT) in late 2022, with human review and automated tests as guardrails.",
      ],
      pt: [
        "Liderei um time full stack construindo sistemas baseados em serviços (serviços em Node.js, APIs REST, mensageria) integrados a AWS e Azure.",
        "Implantei padrões de CI, code review e testes que reduziram os incidentes em produção em ~30%.",
        "Comecei o time no desenvolvimento assistido por IA (Copilot, ChatGPT) no fim de 2022, com revisão humana e testes automatizados como guardrails.",
      ],
    },
  },
  {
    id: "jovens-genios",
    company: "Jovens Gênios",
    title: { en: "Co-founder & CTO", pt: "Cofundador e CTO" },
    period: { from: "2017-12", to: "2022-07" },
    context: { en: "Rio de Janeiro, Brazil · edtech", pt: "Rio de Janeiro, Brasil · edtech" },
    bullets: {
      en: [
        "Co-founded the company and led engineering for edtech apps that grew past 100,000 users on web and mobile.",
        "Chose the stack and the delivery process; scaled and evolved the PHP (Laravel) backend in production, and moved the data architecture from flat structures to a relational model.",
        "Helped build machine-learning models that recommended content to students and predicted their performance with Item Response Theory (IRT); my main part was deploying them to production.",
        "The company reached a ~R$100M valuation.",
      ],
      pt: [
        "Cofundei a empresa e liderei a engenharia de apps de edtech que passaram de 100 mil usuários na web e no mobile.",
        "Escolhi a stack e o processo de entrega; escalei e evoluí o backend em PHP (Laravel) em produção, e levei a arquitetura de dados de estruturas planas para um modelo relacional.",
        "Ajudei a construir modelos de machine learning que recomendavam conteúdo aos alunos e previam o desempenho deles com a Teoria de Resposta ao Item (TRI); minha parte principal foi colocá-los em produção.",
        "A empresa chegou a um valuation de ~R$ 100 milhões.",
      ],
    },
  },
];

export const earlierRoles: EarlierRole[] = [
  {
    company: "Wikki Brasil",
    title: { en: "Software Engineer / Full Stack", pt: "Engenheiro de Software / Full Stack" },
    period: { from: "2017", to: "2018" },
    summary: {
      en: "Web systems with REST APIs, across the full development cycle.",
      pt: "Sistemas web com APIs REST, no ciclo completo de desenvolvimento.",
    },
  },
  {
    company: "Caronaê",
    title: { en: "Android & Full Stack Developer", pt: "Desenvolvedor Android e Full Stack" },
    period: { from: "2015", to: "2017" },
    summary: {
      en: "A university ride-sharing Android app (UFRJ) and its backend APIs.",
      pt: "Um app Android de caronas universitárias (UFRJ) e suas APIs de backend.",
    },
  },
  {
    company: "Fluxo Consultoria",
    title: { en: "Full Stack Web Developer", pt: "Desenvolvedor Web Full Stack" },
    period: { from: "2014", to: "2016" },
    summary: {
      en: "Web systems and REST APIs for a range of clients, at UFRJ's engineering junior enterprise.",
      pt: "Sistemas web e APIs REST para diversos clientes, na empresa júnior de engenharia da UFRJ.",
    },
  },
];

/** Rows of the experience timeline, newest first. `slug` links a founded product to its page. */
export interface TimelineRow {
  label: string;
  title: Localized;
  period: Period;
  kind: "employment" | "founded" | "earlier";
  slug?: string;
}

export const timeline: TimelineRow[] = [
  { label: "OlhoNaLei", title: { en: "Founder & sole engineer", pt: "Fundador e único engenheiro" }, period: { from: "2026-04", to: "present" }, kind: "founded", slug: "olhonalei" },
  { label: "SenseComment", title: { en: "Founder & engineer", pt: "Fundador e engenheiro" }, period: { from: "2025-07", to: "present" }, kind: "founded", slug: "sensecomment" },
  { label: "Paneleiro", title: { en: "Founding Engineer", pt: "Founding Engineer" }, period: { from: "2025-10", to: "2026-09" }, kind: "employment", slug: "paneleiros" },
  { label: "EcoDoctor", title: { en: "Founder & lead engineer", pt: "Fundador e engenheiro líder" }, period: { from: "2023-07", to: "2025-05" }, kind: "founded", slug: "ecodoctor" },
  { label: "The Contract Network", title: { en: "Senior Full-Stack Engineer", pt: "Engenheiro Full Stack Sênior" }, period: { from: "2023-08", to: "2025-03" }, kind: "employment" },
  { label: "Matrix Energia", title: { en: "Tech Lead", pt: "Tech Lead" }, period: { from: "2022-08", to: "2024-02" }, kind: "employment" },
  { label: "Jovens Gênios", title: { en: "Co-founder & CTO", pt: "Cofundador e CTO" }, period: { from: "2017-12", to: "2022-07" }, kind: "employment" },
  { label: "Wikki Brasil", title: { en: "Software Engineer", pt: "Engenheiro de Software" }, period: { from: "2017", to: "2018" }, kind: "earlier" },
  { label: "Caronaê", title: { en: "Android & Full Stack", pt: "Android e Full Stack" }, period: { from: "2015", to: "2017" }, kind: "earlier" },
  { label: "Fluxo Consultoria", title: { en: "Full Stack Web", pt: "Web Full Stack" }, period: { from: "2014", to: "2016" }, kind: "earlier" },
];

/** The timeline's axis. `asOf` is where "present" ends; move it forward when the content is updated. */
export const timelineAxis = { start: 2014, end: 2027, asOf: "2026-10" } as const;

export const education = {
  school: "Universidade Federal do Rio de Janeiro (UFRJ)",
  course: {
    en: "Electronic & Computer Engineering (incomplete), 2012 – 2017",
    pt: "Engenharia Eletrônica e de Computação (incompleta), 2012 – 2017",
  } satisfies Localized,
  note: {
    en: "Left to co-found Jovens Gênios and build software full-time.",
    pt: "Saí para cofundar a Jovens Gênios e trabalhar com software em tempo integral.",
  } satisfies Localized,
  certifications: ["Harvard CS50", "Udacity Android Nanodegree", "Google Project Management"],
  languages: {
    en: ["Portuguese · native", "English · advanced", "Spanish · intermediate"],
    pt: ["Português · nativo", "Inglês · avançado", "Espanhol · intermediário"],
  } satisfies Localized<string[]>,
  content: {
    en: "I also teach IT and AI in Portuguese on my YouTube channel, Seu Nicolau.",
    pt: "Também ensino TI e IA no meu canal do YouTube, Seu Nicolau.",
  } satisfies Localized,
};
