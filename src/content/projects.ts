import agendinhaShot from "@/assets/work/agendinha.webp";
import chamegoShot from "@/assets/work/chamego.webp";
import loreShot from "@/assets/work/lore.webp";
import medhaShot from "@/assets/work/medha.webp";
import olhonaleiShot from "@/assets/work/olhonalei.webp";
import outpostShot from "@/assets/work/outpost.webp";
import paneleirosShot from "@/assets/work/paneleiros.webp";
import sensecommentShot from "@/assets/work/sensecomment.webp";
import type { Project } from "./types";

/**
 * Every project on the site, in display order within its kind.
 * To add one: append an entry, add its slug to slugs.ts, add a screenshot to src/assets/work/
 * (scripts/capture-screenshots.mjs), and run `npm test`: the content tests check that both
 * languages are filled in and that the slug list matches.
 */
export const projects: Project[] = [
  {
    slug: "olhonalei",
    name: "OlhoNaLei",
    kind: "flagship",
    role: { en: "Founder & sole engineer", pt: "Fundador e único engenheiro" },
    period: { from: "2026-04", to: "present" },
    status: "live",
    tagline: {
      en: "Nonprofit civic-tech platform that makes Brazil's federal legislation understandable.",
      pt: "Plataforma civic-tech sem fins lucrativos que torna a legislação federal compreensível.",
    },
    summary: {
      en: [
        "OlhoNaLei puts in one place what happens in Brazil's Chamber of Deputies and Senate: bills in progress, how each vote ended and how each member of Congress voted, with plain-language AI summaries. Data comes from the two houses' official open-data portals.",
        "I designed, built and operate it alone, from the ingestion pipeline to the pixels. It is live and in low-maintenance mode.",
      ],
      pt: [
        "O OlhoNaLei reúne num só lugar o que acontece na Câmara dos Deputados e no Senado: proposições em tramitação, como terminou cada votação e como votou cada parlamentar, com resumos em linguagem simples feitos por IA. Os dados vêm dos portais oficiais de dados abertos das duas casas.",
        "Projetei, construí e opero tudo sozinho, do pipeline de ingestão à interface. Está no ar, em modo de baixa manutenção.",
      ],
    },
    note: {
      en: "Independent and nonprofit: it is not a government service and has no link to any party or public body.",
      pt: "Independente e sem fins lucrativos: não é um serviço do governo e não tem vínculo com partido ou órgão público.",
    },
    highlights: {
      en: [
        "Designed, built and operate the whole platform alone: data pipeline, REST API, AI analysis, frontend, infrastructure and growth.",
        "Nightly, resumable, idempotent Python ingestion from the Chamber and Senate open-data APIs (Firestore staging → PostgreSQL), unifying two different JSON shapes into one relational model.",
        "Hybrid search (PostgreSQL full-text with the Portuguese dictionary + pgvector), rebuilt with binary quantization and reranking: ~1,850 ms → ~8 ms.",
        "Claude analysis pipeline: 29,000+ plain-language summaries, fiscal-impact assessments and legislative-rider (“jabuti”) detection, under monthly LLM budget caps with the Message Batches API.",
        "Public site and internal admin console in Next.js 15 / React 19 / TypeScript / Tailwind (Server Components, ISR, dynamic OG images).",
        "Automated distribution to Instagram, Facebook, Bluesky and a newsletter, with human-in-the-loop review.",
        "Diagnosed and eliminated a ~39,000-invocation serverless cost blowout.",
        "Security: row-level security, PostgREST and compliance with the LGPD, Brazil's data-protection law.",
      ],
      pt: [
        "Projetei, construí e opero a plataforma inteira sozinho: pipeline de dados, API REST, análise por IA, frontend, infraestrutura e crescimento.",
        "Ingestão noturna em Python, resumível e idempotente, das APIs de dados abertos da Câmara e do Senado (staging no Firestore → PostgreSQL), unificando dois formatos JSON diferentes num só modelo relacional.",
        "Busca híbrida (full-text do PostgreSQL com dicionário em português + pgvector), reconstruída com quantização binária e rerank: de ~1.850 ms para ~8 ms.",
        "Pipeline de análise com Claude: mais de 29 mil resumos em linguagem simples, avaliações de impacto fiscal e detecção de “jabutis”, com teto mensal de gastos de LLM e a Message Batches API.",
        "Site público e console administrativo interno em Next.js 15 / React 19 / TypeScript / Tailwind (Server Components, ISR, imagens OG dinâmicas).",
        "Distribuição automatizada para Instagram, Facebook, Bluesky e newsletter, com revisão humana no fluxo.",
        "Diagnostiquei e eliminei um estouro de custo serverless de ~39 mil invocações.",
        "Segurança: RLS, PostgREST e conformidade com a LGPD.",
      ],
    },
    metrics: [
      { value: { en: "167k+", pt: "167 mil+" }, label: { en: "bills ingested", pt: "projetos de lei ingeridos" } },
      { value: { en: "29k+", pt: "29 mil+" }, label: { en: "AI analyses written", pt: "análises escritas por IA" } },
      { value: { en: "~220×", pt: "~220×" }, label: { en: "faster vector search", pt: "busca vetorial mais rápida" } },
      { value: { en: "8,300+", pt: "8.300+" }, label: { en: "missing historical bills recovered", pt: "projetos históricos recuperados" } },
    ],
    stack: [
      "Python",
      "FastAPI",
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "PostgreSQL",
      "pgvector",
      "Supabase",
      "Deno Edge Functions",
      "Firestore",
      "Voyage embeddings",
      "Claude Message Batches",
      "Railway",
      "Vercel",
      "GitHub Actions",
      "Sentry",
    ],
    links: [{ kind: "site", href: "https://www.olhonalei.com" }],
    image: {
      src: olhonaleiShot,
      alt: {
        en: "OlhoNaLei page for the tax-reform bill PLP 68/2024, with its status, its path through Congress and its plain-language summary.",
        pt: "Página do PLP 68/2024 (reforma tributária) no OlhoNaLei, com o status, a tramitação e o resumo em linguagem simples.",
      },
    },
    visuals: ["olhonalei-pipeline"],
    benchmarks: [
      {
        label: { en: "Database search latency", pt: "Latência da busca no banco" },
        before: { value: 1850, text: { en: "~1,850 ms", pt: "~1.850 ms" } },
        after: { value: 8, text: { en: "~8 ms (~220×)", pt: "~8 ms (~220×)" } },
      },
      {
        label: { en: "Vector index size", pt: "Tamanho do índice vetorial" },
        before: { value: 1300, text: { en: "1.3 GB", pt: "1,3 GB" } },
        after: { value: 69, text: { en: "69 MB", pt: "69 MB" } },
      },
      {
        label: { en: "End-to-end search in production", pt: "Busca de ponta a ponta em produção" },
        before: { value: 1.49, text: { en: "~1.49 s", pt: "~1,49 s" } },
        after: { value: 0.55, text: { en: "~0.55 s", pt: "~0,55 s" } },
      },
    ],
    caseStudies: [
      {
        id: "vector-search",
        title: {
          en: "Making vector search 220× faster on a small Postgres",
          pt: "Busca vetorial 220× mais rápida num Postgres pequeno",
        },
        problem: {
          en: "Hybrid search (full-text + pgvector) over 167k+ bills took ~1,850 ms per query, and the 1.3 GB HNSW index didn't fit comfortably in the memory of a budget Postgres instance.",
          pt: "A busca híbrida (full-text + pgvector) sobre mais de 167 mil projetos de lei levava ~1.850 ms por consulta, e o índice HNSW de 1,3 GB não cabia com folga na memória de uma instância Postgres econômica.",
        },
        approach: {
          en: [
            "Profiled the query path before changing anything.",
            "Rebuilt the HNSW index with binary quantization: vectors stored as bits for a fast first pass, then the top candidates reranked with full-precision vectors to keep result quality.",
            "Benchmarked before and after.",
            "Then measured the rest of the end-to-end time: the API ran in the US while the database and the site were in São Paulo, so every search crossed the equator three times (184 ms per hop, for 18 ms of actual Postgres work).",
            "Moved search to a Supabase Edge Function in the database's region, with cached query embeddings, a one-variable rollback to the old path, and an explicit lexical fallback (busca_degradada: true) so silent degradation shows up.",
          ],
          pt: [
            "Perfilei o caminho da consulta antes de mudar qualquer coisa.",
            "Reconstruí o índice HNSW com quantização binária: vetores guardados como bits para uma primeira passada rápida, e os melhores candidatos reordenados com os vetores de precisão total, para manter a qualidade dos resultados.",
            "Medi antes e depois, com benchmarks.",
            "Depois medi o resto do tempo de ponta a ponta: a API rodava nos EUA enquanto o banco e o site estavam em São Paulo, então cada busca cruzava a linha do Equador três vezes (184 ms por trecho, para 18 ms de trabalho real no Postgres).",
            "Levei a busca para uma Edge Function do Supabase na região do banco, com embeddings de consulta em cache, rollback de uma variável para o caminho antigo e um fallback lexical explícito (busca_degradada: true), para que a degradação silenciosa apareça.",
          ],
        },
        result: {
          en: "Index 1.3 GB → 69 MB. Database search ~1,850 ms → ~8 ms (~220×). End-to-end search in production ~1.49 s → ~0.55 s.",
          pt: "Índice de 1,3 GB para 69 MB. Busca no banco de ~1.850 ms para ~8 ms (~220×). Busca de ponta a ponta em produção de ~1,49 s para ~0,55 s.",
        },
        lesson: { en: "Performance measured, not guessed.", pt: "Performance medida, não achada." },
      },
      {
        id: "cost-governed-ai",
        title: { en: "Cost-governed AI at scale", pt: "IA com custo sob controle, em escala" },
        problem: {
          en: "Write useful, plain-language analysis for tens of thousands of bills without an open-ended LLM bill.",
          pt: "Escrever análises úteis, em linguagem simples, para dezenas de milhares de projetos de lei sem uma conta de LLM em aberto.",
        },
        approach: {
          en: [
            "A Claude pipeline on the Message Batches API, which is cheaper and asynchronous.",
            "Monthly budget quotas enforced in code. The backfill is budget-gated and resumable: it stops at the cap and continues next month without losing work.",
            "Each analysis covers a plain-language summary, the fiscal impact and possible “jabutis”: Brazilian slang for an unrelated provision slipped into a bill, like a legislative rider (“a tortoise doesn't climb a tree by itself”). Flagged bills get a badge on the site.",
            "Posts to Instagram, Facebook, Bluesky and the newsletter go through human review.",
          ],
          pt: [
            "Um pipeline com Claude na Message Batches API, que é mais barata e assíncrona.",
            "Cotas mensais de orçamento aplicadas no código. O backfill é limitado por orçamento e resumível: para no teto e continua no mês seguinte sem perder trabalho.",
            "Cada análise traz um resumo em linguagem simples, o impacto fiscal e possíveis “jabutis”, os dispositivos estranhos ao tema enfiados num projeto. Os projetos marcados ganham um selo no site.",
            "As publicações no Instagram, Facebook, Bluesky e na newsletter passam por revisão humana.",
          ],
        },
        result: {
          en: "29,000+ analyses with predictable spend. Separately, I found and eliminated a ~39,000-invocation serverless cost blowout.",
          pt: "Mais de 29 mil análises, com gasto previsível. À parte, encontrei e eliminei um estouro de custo serverless de ~39 mil invocações.",
        },
        lesson: { en: "Cost is a feature.", pt: "Custo também é funcionalidade." },
      },
      {
        id: "two-apis-one-model",
        title: { en: "Two government APIs, one data model", pt: "Duas APIs do governo, um só modelo de dados" },
        problem: {
          en: "The Chamber and the Senate publish legislation through two very different flat JSON APIs.",
          pt: "A Câmara e o Senado publicam a legislação em duas APIs JSON planas e bem diferentes entre si.",
        },
        approach: {
          en: [
            "A nightly Python pipeline that is resumable, checkpointed and idempotent: retries never duplicate or lose records.",
            "Raw data is staged in Firestore (write-only), then normalized into one relational PostgreSQL model: bills, authors, votes and members of Congress.",
            "The product never calls a government API at request time; everything is served from PostgreSQL.",
            "Structured logs throughout.",
          ],
          pt: [
            "Um pipeline noturno em Python, resumível, com checkpoints e idempotente: retentativas nunca duplicam nem perdem registros.",
            "Os dados brutos ficam em staging no Firestore (só escrita) e depois são normalizados num único modelo relacional em PostgreSQL: projetos, autores, votações e parlamentares.",
            "O produto nunca chama uma API do governo na hora da requisição; tudo é servido a partir do PostgreSQL.",
            "Logs estruturados do começo ao fim.",
          ],
        },
        result: {
          en: "167,000+ bills in one model, and 8,300+ missing historical bills recovered by a budget-gated backfill.",
          pt: "Mais de 167 mil projetos de lei num só modelo, e mais de 8.300 projetos históricos que faltavam recuperados por um backfill limitado por orçamento.",
        },
      },
    ],
    decisions: {
      en: [
        "No live government API calls at request time: all data is pre-ingested and served from PostgreSQL.",
        "Firestore is a write-only staging layer; the product API reads only from PostgreSQL.",
        "PostgreSQL full-text search with the Portuguese dictionary.",
        "Semantic search runs in a Supabase Edge Function in São Paulo (sa-east-1), next to the database.",
      ],
      pt: [
        "Nenhuma chamada às APIs do governo na hora da requisição: todos os dados são ingeridos antes e servidos do PostgreSQL.",
        "O Firestore é uma camada de staging só de escrita; a API do produto lê apenas do PostgreSQL.",
        "Busca full-text do PostgreSQL com o dicionário em português.",
        "A busca semântica roda numa Edge Function do Supabase em São Paulo (sa-east-1), ao lado do banco.",
      ],
    },
  },
  {
    slug: "sensecomment",
    name: "SenseComment",
    kind: "product",
    role: { en: "Founder & engineer", pt: "Fundador e engenheiro" },
    period: { from: "2025-07", to: "present" },
    status: "live",
    tagline: {
      en: "AI-powered YouTube comment analysis that filters toxicity and spam and finds leads; 500+ paying subscribers.",
      pt: "Análise de comentários do YouTube com IA, que filtra toxicidade e spam e encontra leads; mais de 500 assinantes pagantes.",
    },
    summary: {
      en: [
        "A SaaS built on top of the YouTube APIs: AI-powered comment analysis that filters toxic comments, detects spam ads, finds leads, and lets channel owners chat with AI about their audience. Payments run through Hotmart, a Brazilian platform for digital products.",
        "I built and ran it as the primary engineer, owning it end to end: product, backend, payments, deploys and support. It grew from zero to 500+ paying subscribers and $50K+ MRR at peak, and it is live in low-maintenance mode.",
      ],
      pt: [
        "Um SaaS construído sobre as APIs do YouTube: análise de comentários com IA que filtra comentários tóxicos, detecta anúncios de spam, encontra leads e permite conversar com a IA sobre o público do canal. Os pagamentos passam pela Hotmart.",
        "Construí e operei o produto como engenheiro principal, de ponta a ponta: produto, backend, pagamentos, deploys e suporte. Ele cresceu do zero para mais de 500 assinantes pagantes e mais de US$ 50 mil de MRR no pico, e está no ar, em modo de baixa manutenção.",
      ],
    },
    highlights: {
      en: [
        "Grew it from zero to 500+ paying subscribers and $50K+ MRR at peak as the primary engineer.",
        "Backend on GCP (Cloud Run, Cloud Functions, Pub/Sub) alongside AWS Lambda and Vercel, with queues and scheduled jobs designed to stay idempotent under retries and concurrent writes, so growth did not create duplicate charges or corrupted data.",
        "RAG support assistant (OpenAI, LangChain, Qdrant) that cut manual support handling by ~60%.",
        "YouTube APIs, Hotmart payments and email/analytics wired up behind audited REST APIs.",
        "Spec-first with AI coding agents: I wrote acceptance criteria, let the agent draft, reviewed its plan and corrected wrong architecture calls before merging. Features shipped in 2–3 days instead of 1–2 weeks.",
      ],
      pt: [
        "Do zero a mais de 500 assinantes pagantes e mais de US$ 50 mil de MRR no pico, como engenheiro principal.",
        "Backend na GCP (Cloud Run, Cloud Functions, Pub/Sub) junto com AWS Lambda e Vercel, com filas e jobs agendados idempotentes sob retentativas e escritas concorrentes, para que o crescimento não gerasse cobranças duplicadas nem dados corrompidos.",
        "Assistente de suporte com RAG (OpenAI, LangChain, Qdrant) que reduziu o atendimento manual em ~60%.",
        "APIs do YouTube, pagamentos Hotmart e e-mail/analytics integrados por trás de APIs REST auditadas.",
        "Orientado a especificação com agentes de IA: eu escrevia os critérios de aceite, o agente rascunhava, eu revisava o plano e corrigia decisões de arquitetura erradas antes do merge. As features saíam em 2–3 dias em vez de 1–2 semanas.",
      ],
    },
    metrics: [
      { value: { en: "500+", pt: "500+" }, label: { en: "paying subscribers", pt: "assinantes pagantes" } },
      { value: { en: "$50K+", pt: "US$ 50 mil+" }, label: { en: "MRR at peak", pt: "de MRR no pico" } },
      { value: { en: "~60%", pt: "~60%" }, label: { en: "less manual support", pt: "menos atendimento manual" } },
      { value: { en: "2–3 days", pt: "2–3 dias" }, label: { en: "per feature, down from 1–2 weeks", pt: "por feature, antes 1–2 semanas" } },
    ],
    stack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "GCP Cloud Run",
      "Cloud Functions",
      "Pub/Sub",
      "AWS Lambda",
      "Vercel",
      "OpenAI",
      "LangChain",
      "Qdrant",
      "Hotmart",
    ],
    links: [{ kind: "site", href: "https://www.sensecomment.com" }],
    image: {
      src: sensecommentShot,
      alt: {
        en: "sensecomment.com home page: “Stop toxic comments before they hurt”, AI-powered YouTube comment analysis.",
        pt: "Página inicial do sensecomment.com: “Stop toxic comments before they hurt”, análise de comentários do YouTube com IA.",
      },
    },
    caseStudies: [
      {
        id: "idempotent",
        title: { en: "Idempotent from day one", pt: "Idempotente desde o primeiro dia" },
        problem: {
          en: "A paid SaaS with queues and scheduled jobs across GCP and AWS, where retries and concurrent writes could double-charge users or corrupt data as it grew.",
          pt: "Um SaaS pago, com filas e jobs agendados entre GCP e AWS, em que retentativas e escritas concorrentes poderiam cobrar duas vezes ou corromper dados conforme crescesse.",
        },
        approach: {
          en: [
            "Designed every queue consumer and scheduled job to be idempotent and safe under retries and concurrent writes.",
            "Owned product, backend, payments (Hotmart), deploys and support.",
            "Added a RAG support assistant (OpenAI, LangChain, Qdrant).",
          ],
          pt: [
            "Projetei cada consumidor de fila e cada job agendado para ser idempotente e seguro sob retentativas e escritas concorrentes.",
            "Fui dono do produto, do backend, dos pagamentos (Hotmart), dos deploys e do suporte.",
            "Adicionei um assistente de suporte com RAG (OpenAI, LangChain, Qdrant).",
          ],
        },
        result: {
          en: "500+ paying subscribers, $50K+ MRR at peak and ~60% less manual support.",
          pt: "Mais de 500 assinantes pagantes, mais de US$ 50 mil de MRR no pico e ~60% menos atendimento manual.",
        },
      },
    ],
  },
  {
    slug: "paneleiros",
    name: "Paneleiro",
    kind: "product",
    role: { en: "Founding Engineer", pt: "Founding Engineer (primeiro engenheiro)" },
    period: { from: "2025-10", to: "2026-09" },
    status: "live",
    tagline: {
      en: "Live football fan app for iPhone and Android: real-time matches, push notifications and highlights.",
      pt: "App de futebol para torcedores, no iPhone e no Android: partidas em tempo real, notificações e melhores momentos.",
    },
    summary: {
      en: [
        "A football (soccer) fan app for iPhone and Android, published as Paneleiro App. Fans rate players, coaches and referees, build lineups and follow matches live, with push notifications and highlights.",
        "One monorepo holds the Flutter app, the Nuxt admin website and the .NET 8 backend.",
      ],
      pt: [
        "Um app de futebol para torcedores, no iPhone e no Android, publicado como Paneleiro App. O torcedor avalia jogadores, técnicos e árbitros, monta escalações e acompanha as partidas ao vivo, com notificações e melhores momentos.",
        "Um monorepo reúne o app em Flutter, o site administrativo em Nuxt e o backend em .NET 8.",
      ],
    },
    highlights: {
      en: [
        "Built the .NET 8 Web API behind the mobile app and the admin dashboard: Hangfire recurring jobs monitor live matches and push updates to clients over SignalR, with Sportmonks match data, OneSignal push and a highlights pipeline (ScoreBat + FFmpeg + S3).",
        "Fixed connection exhaustion and duplicate notifications on the highest-traffic matches (Brazil national-team games) by replacing per-user parallel HTTPS calls with batched OneSignal sends, and made the “already sent” flag independent of push failures.",
        "Added a guard that stops orphaned recurring jobs, data-freshness canaries with email alerts, and a regression test for every production bug. Fixed a canary that had been silently measuring the wrong thing.",
      ],
      pt: [
        "Construí a Web API em .NET 8 por trás do app e do painel administrativo: jobs recorrentes no Hangfire monitoram as partidas ao vivo e enviam atualizações aos clientes via SignalR, com dados da Sportmonks, push pela OneSignal e um pipeline de melhores momentos (ScoreBat + FFmpeg + S3).",
        "Acabei com o esgotamento de conexões e as notificações duplicadas nos jogos de maior audiência (os da Seleção), trocando chamadas HTTPS paralelas por usuário por envios em lote na OneSignal, e tornei a marcação de “já enviado” independente de falhas no push.",
        "Adicionei uma proteção que encerra jobs recorrentes órfãos, canários de frescor de dados com alertas por e-mail e um teste de regressão para cada bug de produção. Corrigi um canário que media a coisa errada em silêncio.",
      ],
    },
    stack: [
      "C#",
      ".NET 8",
      "EF Core",
      "Hangfire",
      "SignalR",
      "Redis",
      "MySQL",
      "Flutter",
      "MobX",
      "Nuxt",
      "Sportmonks",
      "OneSignal",
      "FFmpeg",
      "AWS S3",
      "Firebase",
    ],
    links: [
      { kind: "site", href: "https://www.paneleiros.com" },
      { kind: "app-store", href: "https://apps.apple.com/br/app/paneleiro-app/id6670502389" },
      { kind: "google-play", href: "https://play.google.com/store/apps/details?id=com.torcida.app" },
    ],
    image: {
      src: paneleirosShot,
      alt: {
        en: "Paneleiro App website: “Aqui você joga junto”, with App Store and Google Play buttons.",
        pt: "Site do Paneleiro App: “Aqui você joga junto”, com botões para a App Store e o Google Play.",
      },
    },
    caseStudies: [
      {
        id: "brazil-match",
        title: {
          en: "When a goal in a Brazil match broke push notifications",
          pt: "Quando um gol da Seleção derrubou as notificações",
        },
        problem: {
          en: "During Brazil national-team games, the highest-traffic moments, post-match notifications opened one HTTPS call per user in parallel, exhausted connections and failed. Because the “sent” flag was only set on success, every tick of the recurring job sent the push again, for about 30 minutes.",
          pt: "Nos jogos da Seleção, os momentos de maior tráfego, as notificações de fim de jogo abriam uma chamada HTTPS por usuário em paralelo, esgotavam as conexões e falhavam. Como a marcação de “enviado” só era gravada no sucesso, cada execução do job recorrente reenviava o push, por cerca de 30 minutos.",
        },
        approach: {
          en: [
            "Switched to batched sends of 100 through OneSignal.",
            "Made the “already sent” flag independent of push failures.",
            "Added a guard against orphaned recurring jobs, after finding one that had been running every 10 seconds for months: Hangfire persists jobs in MySQL.",
            "Added data-freshness canaries with email alerts, and fixed one that was silently measuring the wrong thing.",
            "Wrote a regression test for each bug.",
          ],
          pt: [
            "Passei a enviar em lotes de 100 pela OneSignal.",
            "Tornei a marcação de “já enviado” independente de falhas no push.",
            "Adicionei uma proteção contra jobs recorrentes órfãos, depois de achar um que rodava a cada 10 segundos havia meses: o Hangfire persiste os jobs no MySQL.",
            "Adicionei canários de frescor de dados com alertas por e-mail e corrigi um que media a coisa errada em silêncio.",
            "Escrevi um teste de regressão para cada bug.",
          ],
        },
        lesson: {
          en: "Design for retries and failure containment, and own production.",
          pt: "Projetar para retentativas e contenção de falhas, e ser dono da produção.",
        },
      },
    ],
  },
  {
    slug: "ecodoctor",
    name: "EcoDoctor",
    kind: "product",
    role: { en: "Founder & lead engineer", pt: "Fundador e engenheiro líder" },
    period: { from: "2023-07", to: "2025-05" },
    location: { en: "Manaus, Brazil", pt: "Manaus, Brasil" },
    tagline: {
      en: "Healthcare-payments platform that processed R$5M+ in transactions in its first year.",
      pt: "Plataforma de pagamentos em saúde que processou mais de R$ 5 milhões no primeiro ano.",
    },
    summary: {
      en: [
        "A healthcare-payments platform for clinicians, based in Manaus, Brazil. I founded it and built it end to end; it processed R$5M+ in transactions in its first year.",
      ],
      pt: [
        "Uma plataforma de pagamentos em saúde para profissionais da área, em Manaus. Fundei e construí de ponta a ponta; ela processou mais de R$ 5 milhões em transações no primeiro ano.",
      ],
    },
    highlights: {
      en: [
        "Built the platform in Node.js + TypeScript, with payment integrations and high availability for clinicians.",
        "Designed the MySQL/MariaDB data layer (modeling and query plans) and used Redis for caching, sessions and processing queues.",
        "Ran the services in Docker on AWS (Lambda, SQS, ECS) for fault isolation and easier scaling.",
        "Brought AI-assisted development (Copilot, Cursor, ChatGPT) into the workflow early, with automated tests as guardrails on generated code.",
      ],
      pt: [
        "Construí a plataforma em Node.js + TypeScript, com integrações de pagamento e alta disponibilidade para os profissionais de saúde.",
        "Projetei a camada de dados em MySQL/MariaDB (modelagem e planos de consulta) e usei Redis para cache, sessões e filas de processamento.",
        "Rodei os serviços em Docker na AWS (Lambda, SQS, ECS), para isolar falhas e escalar com mais facilidade.",
        "Trouxe cedo o desenvolvimento assistido por IA (Copilot, Cursor, ChatGPT) para o fluxo, com testes automatizados como guardrails no código gerado.",
      ],
    },
    metrics: [
      {
        value: { en: "R$5M+", pt: "R$ 5 mi+" },
        label: { en: "in transactions in year one", pt: "em transações no primeiro ano" },
      },
    ],
    stack: ["Node.js", "TypeScript", "MySQL", "MariaDB", "Redis", "Docker", "AWS Lambda", "SQS", "ECS"],
    poster: {
      figure: { en: "R$5M+", pt: "R$ 5 mi+" },
      caption: { en: "in transactions in year one", pt: "em transações no primeiro ano" },
    },
  },
  {
    slug: "lore",
    name: "Lore",
    kind: "lab",
    role: { en: "Founder & engineer", pt: "Fundador e engenheiro" },
    period: { from: "2026", to: "present" },
    status: "live",
    tagline: {
      en: "Shared long-term memory for AI coding agents and chat apps.",
      pt: "Memória de longo prazo compartilhada para agentes de IA e apps de chat.",
    },
    summary: {
      en: [
        "A hosted memory service. Coding agents (Claude Code, Codex, Cursor, Gemini CLI) and chat apps (Claude, ChatGPT, Gemini) save and search notes, decisions and procedures per repository over MCP, so knowledge survives across sessions, machines and agents.",
        "It's also the memory my own agents share: parallel runs coordinate through it, and overnight runs record there every decision they take, for me to review in the morning.",
      ],
      pt: [
        "Um serviço de memória hospedado. Agentes de código (Claude Code, Codex, Cursor, Gemini CLI) e apps de chat (Claude, ChatGPT, Gemini) salvam e buscam notas, decisões e procedimentos por repositório via MCP, para que o conhecimento sobreviva entre sessões, máquinas e agentes.",
        "É também a memória que meus próprios agentes compartilham: as execuções em paralelo se coordenam por ela, e as execuções noturnas registram ali cada decisão que tomam, para eu revisar de manhã.",
      ],
    },
    note: {
      en: "Built on the open-source ai-memory project (Rust). I keep it as a thin layer that stays mergeable with upstream, and added the self-service accounts, web UI, chat-app integration, sharing and secrets features.",
      pt: "Construído sobre o projeto open source ai-memory (Rust). Mantenho como uma camada fina, que continua mesclável com o upstream, e adicionei contas self-service, interface web, integração com apps de chat, compartilhamento e o recurso de segredos.",
    },
    highlights: {
      en: [
        "Multi-user workspaces with per-project access grants, and pages that can be shared with other people.",
        "A secrets flow: the agent requests a one-time link, the user types the secret there, and the agent never reads it.",
        "MCP over HTTP with OAuth for agents and chat apps, and a web UI for people.",
        "Memory consolidation with Claude Haiku under a monthly budget cap.",
        "A public Claude plugin: a connector plus a recall-and-save skill.",
      ],
      pt: [
        "Workspaces multiusuário com permissões por projeto, e páginas que podem ser compartilhadas com outras pessoas.",
        "Um fluxo de segredos: o agente pede um link de uso único, a pessoa digita o segredo ali e o agente nunca o lê.",
        "MCP sobre HTTP com OAuth para agentes e apps de chat, e uma interface web para pessoas.",
        "Consolidação da memória com Claude Haiku, sob um teto mensal de gastos.",
        "Um plugin público para o Claude: um conector e uma skill de lembrar e salvar.",
      ],
    },
    stack: ["Rust", "SQLite", "MCP", "OAuth", "Docker", "Cloudflare Workers", "Infisical", "Claude Haiku"],
    links: [
      { kind: "site", href: "https://lorememory.ai" },
      { kind: "repo", href: "https://github.com/luisfnicolau/lore-claude-plugin" },
    ],
    image: {
      src: loreShot,
      alt: {
        en: "lorememory.ai home page: “Every agent picks up where the last one stopped.”",
        pt: "Página inicial do lorememory.ai: “Every agent picks up where the last one stopped.”",
      },
    },
  },
  {
    slug: "medha",
    name: "Medha",
    kind: "lab",
    role: { en: "Founder & engineer", pt: "Fundador e engenheiro" },
    period: { from: "2026", to: "present" },
    status: "invite-only",
    tagline: {
      en: "Personal knowledge manager where every note is a plain Markdown file.",
      pt: "Gerenciador de conhecimento pessoal em que cada nota é um arquivo Markdown simples.",
    },
    summary: {
      en: [
        "A “second brain” that sits between Notion and Obsidian: a rich editor, structured properties and database views, on top of plain Markdown files with YAML frontmatter, so the data always belongs to the user.",
        "Requirements (SRS) and architecture docs were written and approved before building, and most of it was built through autonomous AI-agent runs. My agents use it too: my projects' specs and task trackers live there, read and written through its MCP server.",
      ],
      pt: [
        "Um “segundo cérebro” entre o Notion e o Obsidian: editor rico, propriedades estruturadas e visualizações de banco de dados, sobre arquivos Markdown simples com frontmatter YAML, para que os dados sempre pertençam ao usuário.",
        "Os requisitos (SRS) e a arquitetura foram escritos e aprovados antes de construir, e a maior parte foi construída em execuções autônomas de agentes de IA. Meus agentes também usam: as especificações e os quadros de tarefas dos meus projetos ficam lá, lidos e escritos pelo servidor MCP.",
      ],
    },
    highlights: {
      en: [
        "WYSIWYG Markdown editor, nested tags with AI tag suggestions, and Notion-style local databases (table, board, gallery and calendar views).",
        "Keyword and semantic search across everything.",
        "Quick capture from an iOS widget, the share sheet and a browser extension.",
        "Offline iOS app with conflict-safe sync, and a resumable Notion import.",
        "Per-user and global monthly AI spending caps.",
        "An MCP server, so AI assistants can read and write notes. Interface in English and Portuguese.",
      ],
      pt: [
        "Editor Markdown WYSIWYG, tags aninhadas com sugestões de IA e bancos de dados locais no estilo Notion (tabela, quadro, galeria e calendário).",
        "Busca por palavra-chave e por significado em tudo.",
        "Captura rápida por widget no iOS, pela folha de compartilhamento e por uma extensão de navegador.",
        "App iOS que funciona offline, com sincronização segura contra conflitos, e importação do Notion que pode ser retomada.",
        "Tetos mensais de gasto com IA, por usuário e no total.",
        "Um servidor MCP, para que assistentes de IA leiam e escrevam notas. Interface em inglês e português.",
      ],
    },
    stack: [
      "React",
      "Vite",
      "Hono",
      "Drizzle",
      "Neon Postgres",
      "Cloudflare R2",
      "Capacitor",
      "Electron",
      "OpenAI",
      "Anthropic",
      "Passkeys",
      "MCP",
    ],
    links: [{ kind: "site", href: "https://medha.app" }],
    image: {
      src: medhaShot,
      alt: {
        en: "medha.app home page: “Um segundo cérebro que continua seu.”",
        pt: "Página inicial do medha.app: “Um segundo cérebro que continua seu.”",
      },
    },
  },
  {
    slug: "outpost",
    name: "Outpost",
    kind: "lab",
    role: { en: "Founder & engineer", pt: "Fundador e engenheiro" },
    period: { from: "2026", to: "present" },
    status: "personal",
    tagline: {
      en: "Claude Code on an always-on server, steered from a phone or a browser.",
      pt: "Claude Code num servidor sempre ligado, comandado do celular ou do navegador.",
    },
    summary: {
      en: [
        "A private app and server that run several Claude Code sessions on an always-on machine, so I can start, watch and steer them with the laptop closed. The phone shows a chat layout; the web shows the real terminal. Every session is the unmodified Claude Code program in its own tmux session.",
        "27 of its 28 planned tasks were built in one overnight, autonomous, parallel run of AI agents coordinated through Lore.",
      ],
      pt: [
        "Um app e um servidor privados que rodam várias sessões do Claude Code numa máquina sempre ligada, para eu iniciar, acompanhar e conduzir as sessões com o notebook fechado. No celular, um layout de chat; na web, o terminal de verdade. Cada sessão é o Claude Code original, sem modificações, na sua própria sessão do tmux.",
        "27 das 28 tarefas planejadas foram construídas numa única execução noturna, autônoma e em paralelo, de agentes de IA coordenados pelo Lore.",
      ],
    },
    highlights: {
      en: [
        "Go server: passkey sign-in (password plus authenticator code as backup), sessions in tmux, a receiver for Claude Code's hooks, live updates, attachments, automatic recovery, push notifications, and HTTPS handled by the server itself.",
        "Flutter app for iPhone, Android, web and macOS.",
        "Sign-in always requires a passkey or a second factor.",
      ],
      pt: [
        "Servidor em Go: login com passkey (senha mais código do autenticador como reserva), sessões no tmux, receptor dos hooks do Claude Code, atualizações ao vivo, anexos, recuperação automática, notificações push e HTTPS feito pelo próprio servidor.",
        "App em Flutter para iPhone, Android, web e macOS.",
        "O login sempre exige passkey ou segundo fator.",
      ],
    },
    stack: ["Go", "Flutter", "tmux", "Passkeys (WebAuthn)", "Firebase Cloud Messaging", "Next.js"],
    links: [{ kind: "site", href: "https://outpost.lunico.dev" }],
    image: {
      src: outpostShot,
      alt: {
        en: "Outpost landing page: “Your development environment, in the cloud”, with the terminal and phone views.",
        pt: "Landing page do Outpost: “Your development environment, in the cloud”, com as visões de terminal e de celular.",
      },
    },
  },
  {
    slug: "chamego",
    name: "Chamego",
    kind: "lab",
    role: { en: "Founder & engineer", pt: "Fundador e engenheiro" },
    period: { from: "2026", to: "present" },
    status: "beta",
    tagline: {
      en: "A baby monitor made from two phones: private, peer-to-peer video, no extra hardware.",
      pt: "Babá eletrônica feita com dois celulares: vídeo privado, direto entre os aparelhos, sem comprar equipamento.",
    },
    summary: {
      en: [
        "Chamego turns a spare phone into the camera next to the crib and your own phone into the monitor. The two pair with a QR code and stream live audio and video peer-to-peer, across networks and across any iPhone/Android combination.",
        "Privacy is the design constraint: recordings stay on the camera phone, and crying is detected on the device itself.",
      ],
      pt: [
        "O Chamego transforma um celular sobrando na câmera ao lado do berço e o seu celular no monitor. Os dois se pareiam por QR Code e transmitem áudio e vídeo ao vivo direto de um aparelho ao outro, entre redes diferentes e em qualquer combinação de iPhone e Android.",
        "A privacidade é a restrição de projeto: as gravações ficam no aparelho-câmera, e o choro é detectado no próprio aparelho.",
      ],
    },
    highlights: {
      en: [
        "Peer-to-peer audio and video over WebRTC (DTLS/SRTP), with Firestore as the signaling channel and a self-hosted TURN relay (coturn) only as a fallback.",
        "One camera can stream to several monitors, across different accounts and networks.",
        "On-device cry classifier (YAMNet on TensorFlow Lite) that labels each alert as crying or general noise; audio never leaves the phone.",
        "Two-way talk, remote-controlled lullabies and white noise, and a rolling local buffer to save the moments that matter.",
        "Explicit parental consent (LGPD) before any capture, and accessibility (WCAG 2.1 AA) as a requirement.",
        "One-command release automation to TestFlight and Google Play testing tracks; going to production stays a deliberate human step.",
      ],
      pt: [
        "Áudio e vídeo direto entre os aparelhos via WebRTC (DTLS/SRTP), com o Firestore como canal de sinalização e um relay TURN próprio (coturn) só como reserva.",
        "Uma câmera pode transmitir para vários monitores, entre contas e redes diferentes.",
        "Classificador de choro no próprio aparelho (YAMNet com TensorFlow Lite), que marca cada alerta como choro ou ruído; o áudio nunca sai do celular.",
        "Interfone, canções e ruído branco controlados à distância, e um buffer local contínuo para guardar os momentos que importam.",
        "Consentimento explícito dos pais (LGPD) antes de qualquer captura, e acessibilidade (WCAG 2.1 AA) como requisito.",
        "Release automatizado com um comando para o TestFlight e as trilhas de teste do Google Play; ir para produção continua sendo um passo humano e deliberado.",
      ],
    },
    stack: ["Flutter", "Dart", "WebRTC", "Firebase Auth", "Firestore", "Cloud Messaging", "coturn", "TensorFlow Lite"],
    links: [{ kind: "site", href: "https://www.chamego.app" }],
    image: {
      src: chamegoShot,
      alt: {
        en: "chamego.app home page: “Dois celulares. Uma babá eletrônica.”",
        pt: "Página inicial do chamego.app: “Dois celulares. Uma babá eletrônica.”",
      },
    },
  },
  {
    slug: "agendinha",
    name: "Agendinha",
    kind: "lab",
    role: { en: "Engineer, end to end", pt: "Engenheiro, de ponta a ponta" },
    period: { from: "2026", to: "present" },
    status: "demo",
    tagline: {
      en: "Online booking for beauty salons, with an AI attendant on WhatsApp.",
      pt: "Agendamento online para salões de beleza, com atendente de IA no WhatsApp.",
    },
    summary: {
      en: [
        "Clients pick a service, a professional and a time slot, and pay by card, PIX or in person, without creating an account. Managers run the day, the calendar and the books. Each salon gets a site of its own; a salon is the base case used to build and validate it.",
        "Clients can also book over WhatsApp, with an AI attendant that books, answers and hands the conversation to a person when it should.",
      ],
      pt: [
        "A cliente escolhe o serviço, a profissional e o horário, e paga com cartão, PIX ou no local, sem criar conta. O gestor cuida do dia, da agenda e das contas. Cada salão ganha um site próprio; um salão de beleza é o caso base usado para construir e validar o sistema.",
        "Também dá para agendar pelo WhatsApp, com um atendente de IA que marca horários, responde dúvidas e passa a conversa para uma pessoa quando deve.",
      ],
    },
    highlights: {
      en: [
        "Postgres-first on Supabase, with no backend service: every write goes through a SECURITY DEFINER function, behind row-level security, and a test fails if the anonymous access surface changes.",
        "Reserve-first booking: the slot is held before the client is identified, with a TTL, immediate release and a cron sweep, while Realtime shows other people's reservations as they happen.",
        "Slots are derived at query time, never pre-generated; money is stored in integer cents; multi-employee staffing is built in.",
        "AI attendant on the official WhatsApp Cloud API, built on Claude, with voice notes transcribed by Whisper.",
        "13 scripted evals: a simulated client (another LLM) talks to the real attendant against a local database; code checks the bookings and tool calls, and an LLM judge grades the tone.",
        "Electronic service invoices (NFS-e) issued from the client's record by a service running in a Cloudflare Container.",
        "Every user flow tested end to end with Playwright on desktop, Android and iPhone viewports.",
      ],
      pt: [
        "Postgres em primeiro lugar, no Supabase, sem serviço de backend: toda escrita passa por uma função SECURITY DEFINER, atrás de RLS, e um teste falha se a superfície de acesso anônimo mudar.",
        "Reserva antes da identificação: o horário fica segurado antes de a cliente se identificar, com TTL, liberação imediata e limpeza por cron, enquanto o Realtime mostra na hora as reservas de outras pessoas.",
        "Os horários são calculados na consulta, nunca gerados de antemão; dinheiro é guardado em centavos inteiros; equipe com várias profissionais já faz parte do modelo.",
        "Atendente de IA na API oficial do WhatsApp (Cloud API da Meta), construído com Claude, com áudios transcritos pelo Whisper.",
        "13 roteiros de avaliação: uma cliente simulada (outra IA) conversa com o atendente de verdade contra um banco local; o código confere as reservas e as ferramentas chamadas, e um juiz de IA avalia o tom.",
        "Notas fiscais de serviço (NFS-e) emitidas pela ficha da cliente, por um serviço que roda num Cloudflare Container.",
        "Todos os fluxos testados de ponta a ponta com Playwright, em desktop, Android e iPhone.",
      ],
    },
    stack: [
      "Next.js",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "PostgreSQL 17",
      "WhatsApp Cloud API",
      "Claude",
      "Whisper",
      "Cloudflare Containers",
      "Vitest",
      "Playwright",
    ],
    links: [{ kind: "demo", href: "https://agendinha-cliente.vercel.app" }],
    image: {
      src: agendinhaShot,
      alt: {
        en: "“Ateliê”, one of Agendinha's four salon-site templates, for the fictional demo salon Ondina.",
        pt: "“Ateliê”, um dos quatro modelos de site de salão do Agendinha, para o salão fictício de demonstração Ondina.",
      },
    },
  },
];

export const getProject = (slug: string) => projects.find((project) => project.slug === slug);

export const featuredProjects = projects.filter((project) => project.kind !== "lab");
export const labProjects = projects.filter((project) => project.kind === "lab");
