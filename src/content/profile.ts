import avatar from "@/assets/photo/avatar.jpg";
import portrait from "@/assets/photo/portrait.jpg";
import type { Localized, Metric } from "./types";

export const site = {
  url: "https://lunico.dev",
  repo: "https://github.com/luisfnicolau/portfolio",
  /** Bump both when the content changes: shown in the footer and used as the sitemap's lastmod. */
  updated: { en: "October 2026", pt: "outubro de 2026" } satisfies Localized,
  updatedIso: "2026-10-29",
};

export const profile = {
  name: "Luis Felipe Moraes Nicolau",
  shortName: "Luis Nicolau",
  initials: "LN",
  title: {
    en: "Senior Full-Stack Engineer · AI Products",
    pt: "Engenheiro Full Stack Sênior · Produtos com IA",
  } satisfies Localized,
  jobTitle: { en: "Senior Full-Stack Engineer", pt: "Engenheiro Full Stack Sênior" } satisfies Localized,
  focus: "TypeScript · Python · LLM/RAG",
  /** The hero headline, one entry per line. The last line is set in the accent serif. */
  headline: {
    en: ["I build whole products,", "from the data pipeline", "to the pixels,", "and keep them running."],
    pt: ["Construo produtos inteiros,", "do pipeline de dados", "à interface,", "e mantenho no ar."],
  } satisfies Localized<string[]>,
  /** The headline in the third person, under the name on the social card. */
  cardLine: {
    en: "builds whole products, and keeps them running.",
    pt: "constrói produtos inteiros, e mantém no ar.",
  } satisfies Localized,
  /** Meta description and social cards. */
  oneLiner: {
    en: "Senior full-stack engineer (12+ years) building production AI products in TypeScript, React, Node.js and Python. Remote from Brazil, full US overlap.",
    pt: "Engenheiro full stack sênior (12+ anos) construindo produtos de IA em produção com TypeScript, React, Node.js e Python. Remoto, do Brasil.",
  } satisfies Localized,
  /** Follows the name and title in the hero. */
  intro: {
    en: "12+ years shipping products end to end in TypeScript, React, Node.js and Python, focused lately on LLM/RAG features in production. Previously Tech Lead, and co-founder/CTO of an edtech with 100k+ users.",
    pt: "Mais de 12 anos entregando produtos de ponta a ponta em TypeScript, React, Node.js e Python, com foco recente em funcionalidades de LLM/RAG em produção. Antes, Tech Lead e cofundador/CTO de uma edtech com mais de 100 mil usuários.",
  } satisfies Localized,
  /** Quick facts beside the About text. */
  facts: [
    { label: { en: "Based in", pt: "Moro em" }, value: { en: "Campo Grande, Brazil", pt: "Campo Grande, MS" } },
    { label: { en: "Time zone", pt: "Fuso" }, value: { en: "UTC−4 · full US overlap", pt: "UTC−4 · sobreposição total com os EUA" } },
    { label: { en: "Experience", pt: "Experiência" }, value: { en: "12+ years, since 2014", pt: "12+ anos, desde 2014" } },
    { label: { en: "Languages", pt: "Idiomas" }, value: { en: "Portuguese, English, Spanish", pt: "Português, inglês, espanhol" } },
    { label: { en: "Open to", pt: "Aberto a" }, value: { en: "Full-time or contract", pt: "Tempo integral ou contrato" } },
  ] satisfies { label: Localized; value: Localized }[],
  availability: {
    en: "Available for full-time or contract roles",
    pt: "Disponível em tempo integral ou por contrato",
  } satisfies Localized,
  remote: {
    en: "Remote · Brazil (UTC−4) · full US overlap",
    pt: "Remoto · Brasil (UTC−4) · sobreposição total com os EUA",
  } satisfies Localized,
  location: {
    en: "Campo Grande, Mato Grosso do Sul, Brazil",
    pt: "Campo Grande, Mato Grosso do Sul, Brasil",
  } satisfies Localized,
  /** Made from the original with scripts/prepare-photo.mjs. public/luis-nicolau.jpg is the same headshot. */
  photo: {
    portrait,
    avatar,
    alt: {
      en: "Luis Nicolau, smiling, in a black T-shirt against a gray background",
      pt: "Luis Nicolau sorrindo, de camiseta preta, com fundo cinza",
    } satisfies Localized,
  },
  city: "Campo Grande",
  timeZone: "America/Campo_Grande",
  utcOffset: "UTC−4",
  /** Long About text (four paragraphs). */
  about: {
    en: [
      "I'm a full-stack and data engineer with 12+ years of building products end to end, most of them as a founder or tech lead who owned the architecture.",
      "Most recently I designed, built and run OlhoNaLei, a nonprofit civic-tech platform that tracks Brazil's federal legislation: 167,000+ bills ingested from the Chamber and Senate open-data APIs, hybrid semantic search on PostgreSQL + pgvector that I took from ~1.85 s to ~8 ms, and a Claude-powered analysis pipeline that has written 29,000+ plain-language summaries under a monthly budget cap. Before that I built SenseComment, a React/Node SaaS on top of the YouTube APIs that grew to 500+ paying subscribers, and EcoDoctor, a healthcare-payments platform that processed R$5M+ in its first year. Earlier I was co-founder and CTO of Jovens Gênios, an edtech that passed 100,000 users, Tech Lead at Matrix Energia, and a contractor for The Contract Network, a US company building an LLM-based contract-analysis product.",
      "I'm used to owning a product with little guidance: taking a vague, one-line goal and making the dozens of small decisions it takes to ship something reliable, while sweating the edge cases. I design for retries, idempotency and failure containment, and I like chasing performance problems with real measurements.",
      "I work with AI coding agents every day (Claude Code, Cursor, Codex). I write the spec and acceptance criteria, let the agent draft, then review its plan and its diff, and catch the places where it is confidently wrong. Lately I run several agents in parallel on separate git worktrees, coordinated through a shared long-term memory I built myself.",
    ],
    pt: [
      "Sou engenheiro full stack e de dados há mais de 12 anos, construindo produtos de ponta a ponta, quase sempre como fundador ou tech lead dono da arquitetura.",
      "Mais recentemente projetei, construí e opero sozinho o OlhoNaLei, uma plataforma civic-tech sem fins lucrativos que acompanha a legislação federal: mais de 167 mil projetos de lei ingeridos das APIs de dados abertos da Câmara e do Senado, busca semântica híbrida em PostgreSQL + pgvector que levei de ~1,85 s para ~8 ms, e um pipeline de análise com Claude que já gerou mais de 29 mil resumos em linguagem simples, com teto mensal de gastos. Antes disso construí o SenseComment, um SaaS em React/Node sobre as APIs do YouTube que chegou a mais de 500 assinantes pagantes, e a EcoDoctor, uma plataforma de pagamentos em saúde que processou mais de R$ 5 milhões no primeiro ano. Fui cofundador e CTO da Jovens Gênios (edtech, mais de 100 mil usuários), Tech Lead na Matrix Energia e contractor da The Contract Network, empresa americana de análise de contratos com LLMs.",
      "Estou acostumado a ser dono do produto com pouca orientação: pegar um objetivo vago, de uma linha, e tomar as dezenas de pequenas decisões necessárias para entregar algo confiável, cuidando dos casos extremos. Projeto para retentativas, idempotência e contenção de falhas, e gosto de performance medida, não achada.",
      "Trabalho com agentes de IA de código todos os dias (Claude Code, Cursor, Codex): escrevo a especificação e os critérios de aceite, deixo o agente rascunhar, reviso o plano e o diff e pego onde ele erra com confiança. Hoje rodo vários agentes em paralelo, em git worktrees separados, coordenados por uma memória de longo prazo que eu mesmo construí.",
    ],
  } satisfies Localized<string[]>,
};

export const contact = {
  email: "luisfnicolau@gmail.com",
  whatsapp: "https://wa.me/5521995403334",
  linkedin: "https://www.linkedin.com/in/luis-felipe-nicolau",
  github: "https://github.com/luisfnicolau",
};

/** CV downloads. Each page offers its own language first. */
export const cv = {
  en: { href: "/cv/luis-nicolau-full-stack-cv-en.pdf", label: "CV · English (PDF)" },
  pt: { href: "/cv/luis-nicolau-full-stack-cv-pt.pdf", label: "Currículo · Português (PDF)" },
} satisfies Localized<{ href: string; label: string }>;

/** The hero stat strip. */
export const stats: Metric[] = [
  {
    value: { en: "12+", pt: "12+" },
    label: { en: "years shipping software", pt: "anos entregando software" },
  },
  {
    value: { en: "4", pt: "4" },
    label: { en: "products founded and shipped", pt: "produtos fundados e lançados" },
  },
  {
    value: { en: "R$5M+", pt: "R$ 5 mi+" },
    label: { en: "processed by my payments startup in year one", pt: "processados pela minha startup de pagamentos no 1º ano" },
  },
  {
    value: { en: "29k+", pt: "29 mil+" },
    label: { en: "AI analyses from my Claude pipeline", pt: "análises de IA do meu pipeline com Claude" },
  },
  {
    value: { en: "100k+", pt: "100 mil+" },
    label: { en: "users at an edtech I co-founded", pt: "usuários numa edtech que cofundei" },
  },
];
