import type { AskLink, Intent } from "@/lib/ask";
import { contact, cv } from "./profile";
import type { Localized } from "./types";

const project = (slug: string, name: string): AskLink => ({
  label: { en: name, pt: name },
  href: { en: `/work/${slug}`, pt: `/pt/work/${slug}` },
});
const section = (id: string, label: Localized): AskLink => ({ label, href: `#${id}` });

const links = {
  contact: section("contact", { en: "Contact", pt: "Contato" }),
  work: section("work", { en: "Selected work", pt: "Trabalhos" }),
  labs: section("labs", { en: "Labs", pt: "Labs" }),
  experience: section("experience", { en: "Experience", pt: "Experiência" }),
  howIWork: section("how-i-work", { en: "How I work", pt: "Como trabalho" }),
  skills: section("skills", { en: "Skills", pt: "Competências" }),
  background: section("background", { en: "Background", pt: "Formação" }),
  email: { label: { en: "Email", pt: "E-mail" }, href: `mailto:${contact.email}` },
  whatsapp: { label: { en: "WhatsApp", pt: "WhatsApp" }, href: contact.whatsapp },
  linkedin: { label: { en: "LinkedIn", pt: "LinkedIn" }, href: contact.linkedin },
  cv: { label: { en: "CV (PDF)", pt: "Currículo (PDF)" }, href: { en: cv.en.href, pt: cv.pt.href } },
} satisfies Record<string, AskLink>;

/**
 * Ties go to the intent listed first: project names come before topics, so "how did you build
 * Medha?" answers about Medha, and topics come before the catch-all intents at the end.
 */
export const intents: Intent[] = [
  {
    id: "availability",
    keywords: [
      "available", "availability", "hire", "hiring", "contract", "contractor", "freelance", "full time", "fulltime",
      "part time", "remote", "remotely", "open to work", "looking for", "start", "when can you start", "notice",
      "disponivel", "disponibilidade", "contratar", "contratacao", "contrato", "pj", "clt", "freela", "remoto",
      "tempo integral", "quando pode comecar",
    ],
    answer: {
      en: "Yes. I'm available for full-time or contract roles, remote from Campo Grande, Brazil (UTC−4), with full overlap with US business hours. The products I run are in low-maintenance mode, so they don't compete with a full-time role.",
      pt: "Sim. Estou disponível em tempo integral ou por contrato, remoto de Campo Grande (UTC−4), com sobreposição total com o horário comercial dos EUA. Os produtos que mantenho estão em modo de baixa manutenção, então não competem com um trabalho em tempo integral.",
    },
    links: [links.contact, links.cv],
  },
  {
    id: "contact",
    keywords: [
      "contact", "email", "e mail", "mail", "whatsapp", "phone", "call", "linkedin", "reach", "message", "talk",
      "contato", "contatar", "falar", "telefone", "ligar", "ligacao", "mensagem", "conversar", "zap",
    ],
    answer: {
      en: `Email is best: ${contact.email}. You can also message me on WhatsApp or LinkedIn.`,
      pt: `O melhor é por e-mail: ${contact.email}. Também dá para falar comigo pelo WhatsApp ou pelo LinkedIn.`,
    },
    links: [links.email, links.whatsapp, links.linkedin],
  },
  {
    id: "cv",
    keywords: ["cv", "resume", "curriculum", "curriculo", "pdf", "download", "baixar"],
    answer: {
      en: "Here's my CV as a PDF, in English or in Portuguese.",
      pt: "Aqui está meu currículo em PDF, em português ou em inglês.",
    },
    links: [
      links.cv,
      { label: { en: "Portuguese CV", pt: "CV em inglês" }, href: { en: cv.pt.href, pt: cv.en.href } },
    ],
  },
  {
    id: "olhonalei",
    keywords: [
      "olhonalei", "olho na lei", "civic", "civic tech", "legislation", "congress", "bills", "bill", "laws",
      "law", "government", "chamber", "senate", "jabuti", "congresso", "legislacao", "lei", "leis",
      "projetos de lei", "camara", "senado", "governo", "deputados", "senadores",
    ],
    answer: {
      en: "OlhoNaLei is a nonprofit civic-tech platform that makes Brazil's federal legislation understandable. I built it alone: 167,000+ bills ingested, hybrid search taken from ~1.85 s to ~8 ms, and 29,000+ plain-language AI analyses under a monthly budget cap.",
      pt: "O OlhoNaLei é uma plataforma civic-tech sem fins lucrativos que torna a legislação federal compreensível. Construí sozinho: mais de 167 mil projetos de lei ingeridos, busca híbrida de ~1,85 s para ~8 ms e mais de 29 mil análises por IA em linguagem simples, com teto mensal de gastos.",
    },
    links: [project("olhonalei", "OlhoNaLei"), { label: { en: "olhonalei.com", pt: "olhonalei.com" }, href: "https://www.olhonalei.com" }],
  },
  {
    id: "sensecomment",
    keywords: [
      "sensecomment", "sense comment", "youtube", "hotmart", "saas", "subscribers", "assinantes", "toxic", "toxicity",
      "comments", "comment analysis", "spam", "leads", "comentarios", "toxicos", "toxicidade",
    ],
    answer: {
      en: "SenseComment is AI-powered YouTube comment analysis: it filters toxic comments and spam ads, finds leads, and lets channel owners chat with AI about their audience. As its primary engineer I grew it from zero to 500+ paying subscribers, kept every queue and job idempotent, and built a RAG support assistant that cut manual support by ~60%.",
      pt: "O SenseComment é análise de comentários do YouTube com IA: filtra comentários tóxicos e anúncios de spam, encontra leads e permite conversar com a IA sobre o público do canal. Como engenheiro principal, levei de zero a mais de 500 assinantes pagantes, mantive filas e jobs idempotentes e construí um assistente de suporte com RAG que reduziu o atendimento manual em ~60%.",
    },
    links: [
      project("sensecomment", "SenseComment"),
      { label: { en: "sensecomment.com", pt: "sensecomment.com" }, href: "https://www.sensecomment.com" },
    ],
  },
  {
    id: "paneleiros",
    keywords: [
      "paneleiros", "paneleiro", "football", "soccer", "futebol", "torcedor", "torcedores", "sportmonks",
      "onesignal", "push", "notifications", "notificacoes", "hangfire", "signalr",
    ],
    answer: {
      en: "Paneleiros is a live football fan app for iPhone and Android. I built its .NET 8 backend: Hangfire jobs follow live matches and push updates over SignalR, with OneSignal notifications and a highlights pipeline.",
      pt: "O Paneleiros é um app de futebol para torcedores, no iPhone e no Android. Construí o backend em .NET 8: jobs no Hangfire acompanham as partidas ao vivo e enviam atualizações via SignalR, com notificações pela OneSignal e um pipeline de melhores momentos.",
    },
    links: [project("paneleiros", "Paneleiros")],
  },
  {
    id: "ecodoctor",
    keywords: ["ecodoctor", "eco doctor", "healthcare", "health", "payments", "fintech", "manaus", "saude", "pagamentos"],
    answer: {
      en: "EcoDoctor is a healthcare-payments platform I founded and built in Node.js + TypeScript on AWS. It processed R$5M+ in transactions in its first year.",
      pt: "A EcoDoctor é uma plataforma de pagamentos em saúde que fundei e construí em Node.js + TypeScript na AWS. Processou mais de R$ 5 milhões em transações no primeiro ano.",
    },
    links: [project("ecodoctor", "EcoDoctor")],
  },
  {
    id: "lore",
    keywords: ["lore", "memory", "ai memory", "long term memory", "lorememory", "memoria", "memoria de longo prazo"],
    answer: {
      en: "Lore is a hosted long-term memory for AI agents and chat apps over MCP, built on the open-source ai-memory project. I added accounts, a web UI, sharing and a secrets flow where the agent never sees the secret. My own agents coordinate through it.",
      pt: "O Lore é uma memória de longo prazo hospedada para agentes de IA e apps de chat via MCP, construída sobre o projeto open source ai-memory. Adicionei contas, interface web, compartilhamento e um fluxo de segredos em que o agente nunca vê o segredo. Meus próprios agentes se coordenam por ele.",
    },
    links: [project("lore", "Lore")],
  },
  {
    id: "medha",
    keywords: [
      "medha", "notes", "note taking", "second brain", "notion", "obsidian", "markdown", "knowledge", "notas",
      "segundo cerebro", "conhecimento",
    ],
    answer: {
      en: "Medha is a personal knowledge manager where every note is a plain Markdown file: rich editor, Notion-style databases, semantic search, offline iOS and an MCP server. Most of it was built through autonomous AI-agent runs.",
      pt: "O Medha é um gerenciador de conhecimento pessoal em que cada nota é um arquivo Markdown simples: editor rico, bancos de dados no estilo Notion, busca por significado, iOS offline e um servidor MCP. A maior parte foi construída em execuções autônomas de agentes de IA.",
    },
    links: [project("medha", "Medha")],
  },
  {
    id: "outpost",
    keywords: ["outpost", "terminal", "tmux", "remote terminal", "always on"],
    answer: {
      en: "Outpost runs Claude Code sessions on an always-on server and lets me steer them from a phone or a browser: Go server, Flutter app, passkey sign-in. 27 of its 28 planned tasks were built in one overnight run of parallel AI agents.",
      pt: "O Outpost roda sessões do Claude Code num servidor sempre ligado e me deixa conduzi-las do celular ou do navegador: servidor em Go, app em Flutter, login com passkey. 27 das 28 tarefas planejadas foram construídas numa única noite, por agentes de IA em paralelo.",
    },
    links: [project("outpost", "Outpost")],
  },
  {
    id: "chamego",
    keywords: [
      "chamego", "baby", "baby monitor", "webrtc", "crib", "baba", "baba eletronica", "bebe", "berco",
    ],
    answer: {
      en: "Chamego turns two phones into a baby monitor: peer-to-peer WebRTC video across any iPhone/Android combination, and cry detection that runs on the device, so audio never leaves the phone. It's in beta.",
      pt: "O Chamego transforma dois celulares numa babá eletrônica: vídeo WebRTC direto entre os aparelhos, em qualquer combinação de iPhone e Android, e detecção de choro no próprio aparelho, então o áudio nunca sai do celular. Está em beta.",
    },
    links: [project("chamego", "Chamego")],
  },
  {
    id: "agendinha",
    keywords: [
      "agendinha", "salon", "salons", "booking", "bookings", "scheduling", "appointment", "appointments", "beauty",
      "attendant", "salao", "saloes", "agendamento", "agendamentos", "beleza", "atendente",
    ],
    answer: {
      en: "Agendinha is online booking for beauty salons, with an AI attendant on WhatsApp built on Claude and tested by 13 scripted evals against a simulated client. It's in development, with a public demo.",
      pt: "O Agendinha é agendamento online para salões de beleza, com um atendente de IA no WhatsApp construído com Claude e testado por 13 roteiros de avaliação contra uma cliente simulada. Está em desenvolvimento, com demo pública.",
    },
    links: [project("agendinha", "Agendinha")],
  },
  {
    id: "jovens-genios",
    keywords: ["jovens genios", "jovens", "genios", "edtech"],
    answer: {
      en: "I co-founded Jovens Gênios and was its CTO from 2017 to 2022: edtech apps on web and mobile that grew past 100,000 users, and a company that reached a ~R$100M valuation.",
      pt: "Cofundei a Jovens Gênios e fui CTO de 2017 a 2022: apps de edtech na web e no mobile que passaram de 100 mil usuários, e uma empresa que chegou a um valuation de ~R$ 100 mi.",
    },
    links: [links.experience],
  },
  {
    id: "tcn",
    keywords: ["contract network", "the contract network", "tcn", "deel", "contract analysis", "neo4j"],
    answer: {
      en: "At The Contract Network (US, contract via Deel, 2023–2025) I built serverless, event-driven services on AWS for an LLM-based contract-analysis product: Lambda, Step Functions, EventBridge, SQS, API Gateway and Kafka, with Node.js, GraphQL and Neo4j.",
      pt: "Na The Contract Network (EUA, contractor via Deel, 2023–2025) construí serviços serverless orientados a eventos na AWS para um produto de análise de contratos com LLMs: Lambda, Step Functions, EventBridge, SQS, API Gateway e Kafka, com Node.js, GraphQL e Neo4j.",
    },
    links: [links.experience],
  },
  {
    id: "matrix",
    keywords: ["matrix", "matrix energia", "energia", "energy"],
    answer: {
      en: "At Matrix Energia (2022–2024) I was Tech Lead of a full-stack team building Node.js services, REST APIs and messaging on AWS and Azure, and introduced CI, code review and testing standards that cut production incidents by ~30%.",
      pt: "Na Matrix Energia (2022–2024) fui Tech Lead de um time full stack que construía serviços em Node.js, APIs REST e mensageria na AWS e na Azure, e implantei CI, code review e padrões de teste que reduziram os incidentes em produção em ~30%.",
    },
    links: [links.experience],
  },
  {
    id: "principles",
    keywords: [
      "how do you work", "principles", "values", "methodology", "process", "approach", "way of working",
      "como voce trabalha", "como trabalha", "principios", "valores", "metodologia", "processo",
    ],
    answer: {
      en: "Own it end to end, measure instead of guessing, design for failure, treat cost as a feature, write decisions down, keep CI honest, and keep secrets out of chat and code.",
      pt: "Ser dono de ponta a ponta, medir em vez de chutar, projetar para a falha, tratar custo como funcionalidade, registrar as decisões, manter a CI honesta e deixar segredos fora do chat e do código.",
    },
    links: [links.howIWork],
  },
  {
    id: "agents",
    keywords: [
      "claude code", "cursor", "codex", "copilot", "agent", "agents", "agentic", "ai agents", "coding agents",
      "workflow", "worktree", "worktrees", "mcp", "autonomous", "parallel", "ai native", "vibe coding",
      "agente", "agentes", "agentes de ia", "fluxo de trabalho", "paralelo", "autonomo",
    ],
    answer: {
      en: "Claude Code every day, plus Cursor and Codex. I write the spec and acceptance criteria, the agent drafts, and I review its plan and its diff; tests decide when it's done, not the agent. Lately I run several agents in parallel on separate git worktrees, coordinated through Lore, the shared memory I built.",
      pt: "Claude Code todos os dias, além de Cursor e Codex. Escrevo a especificação e os critérios de aceite, o agente rascunha, e eu reviso o plano e o diff; quem decide que está pronto são os testes, não o agente. Hoje rodo vários agentes em paralelo em git worktrees separados, coordenados pelo Lore, a memória compartilhada que construí.",
    },
    links: [links.howIWork, project("lore", "Lore")],
  },
  {
    id: "performance",
    keywords: [
      "fast", "faster", "fastest", "speed", "speedup", "performance", "perf", "latency", "optimize",
      "optimization", "optimized", "optimizing", "slow", "benchmark", "benchmarks", "pgvector", "hnsw",
      "quantization", "index", "search", "vector search", "220x", "rapido", "rapida", "velocidade", "desempenho",
      "latencia", "otimizacao", "otimizar", "otimizou", "lento", "indice", "busca", "busca vetorial",
    ],
    answer: {
      en: "On OlhoNaLei I rebuilt the pgvector HNSW index with binary quantization plus a rerank: the index went from 1.3 GB to 69 MB and search from ~1,850 ms to ~8 ms (~220×). Then I measured the network and moved search to an edge function next to the database in São Paulo: end-to-end ~1.49 s → ~0.55 s.",
      pt: "No OlhoNaLei reconstruí o índice HNSW do pgvector com quantização binária e rerank: o índice foi de 1,3 GB para 69 MB e a busca de ~1.850 ms para ~8 ms (~220×). Depois medi a rede e levei a busca para uma edge function ao lado do banco, em São Paulo: de ponta a ponta, de ~1,49 s para ~0,55 s.",
    },
    links: [project("olhonalei", "OlhoNaLei")],
  },
  {
    id: "ai",
    keywords: [
      "ai", "llm", "llms", "claude", "anthropic", "openai", "gpt", "gemini", "rag", "embeddings", "embedding",
      "prompt", "prompts", "batch", "inference", "semantic", "langchain", "generative", "genai", "ai in production",
      "production ai", "machine learning", "ml", "ia", "inteligencia artificial", "ia em producao", "ia generativa",
    ],
    answer: {
      en: "Production LLM work: a Claude pipeline that wrote 29,000+ plain-language bill analyses under monthly budget caps (Message Batches API), a RAG support assistant that cut manual support by ~60%, and serverless workflows that wired an AI/ML team's model outputs into a contract-analysis product. I build with and operate LLMs; I don't train models.",
      pt: "LLM em produção: um pipeline com Claude que escreveu mais de 29 mil análises de projetos de lei com teto mensal de gastos (Message Batches API), um assistente de suporte com RAG que reduziu o atendimento manual em ~60% e fluxos serverless que levaram as saídas dos modelos de um time de IA/ML para um produto de análise de contratos. Construo com LLMs e opero LLMs; não treino modelos.",
    },
    links: [project("olhonalei", "OlhoNaLei"), project("sensecomment", "SenseComment")],
  },
  {
    id: "cost",
    keywords: [
      "cost", "costs", "budget", "budgets", "cheap", "cheaper", "spend", "spending", "billing", "money",
      "expensive", "savings", "custo", "custos", "orcamento", "gasto", "gastos", "barato", "caro", "economia",
    ],
    answer: {
      en: "Cost is a feature: every LLM call path gets a budget cap. OlhoNaLei's analysis runs on the Message Batches API with monthly caps enforced in code, and its backfill stops at the cap and resumes next month without losing work. I also tracked down and eliminated a ~39,000-invocation serverless cost blowout.",
      pt: "Custo também é funcionalidade: todo caminho que chama LLM tem teto de gastos. A análise do OlhoNaLei roda na Message Batches API com tetos mensais aplicados no código, e o backfill para no teto e continua no mês seguinte sem perder trabalho. Também encontrei e eliminei um estouro de custo serverless de ~39 mil invocações.",
    },
    links: [project("olhonalei", "OlhoNaLei")],
  },
  {
    id: "reliability",
    keywords: [
      "reliability", "reliable", "incident", "incidents", "outage", "outages", "downtime", "idempotent",
      "idempotency", "retry", "retries", "resilience", "resilient", "production", "bug", "bugs", "monitoring",
      "canary", "canaries", "failure", "failures", "sre", "confiabilidade", "confiavel", "incidente",
      "incidentes", "producao", "resiliencia", "falha", "falhas", "monitoramento",
    ],
    answer: {
      en: "I design for retries, idempotency and failure containment. Example: during Brazil national-team games, Paneleiros' post-match notifications exhausted connections and kept re-sending for ~30 minutes. I switched to batched sends, decoupled the “sent” flag from push failures, added a guard against orphaned recurring jobs and data-freshness canaries, and wrote a regression test for each bug.",
      pt: "Projeto para retentativas, idempotência e contenção de falhas. Exemplo: nos jogos da Seleção, as notificações de fim de jogo do Paneleiros esgotavam as conexões e ficavam reenviando por ~30 minutos. Passei a enviar em lote, desacoplei a marcação de “enviado” das falhas de push, adicionei proteção contra jobs recorrentes órfãos e canários de frescor de dados, e escrevi um teste de regressão para cada bug.",
    },
    links: [project("paneleiros", "Paneleiros")],
  },
  {
    id: "projects",
    keywords: [
      "projects", "project", "built", "build", "shipped", "ship", "products", "product", "portfolio", "work",
      "side projects", "made", "created", "projetos", "projeto", "construiu", "construir", "produtos", "produto",
      "entregou", "entregas", "entregar", "trabalhos", "criou",
    ],
    answer: {
      en: "Flagship: OlhoNaLei, a civic-tech platform I built alone. Also SenseComment (SaaS, 500+ paying subscribers), Paneleiros (football fan app on both stores) and EcoDoctor (healthcare payments, R$5M+ in year one), plus newer builds: Lore, Medha, Outpost, Chamego and Agendinha.",
      pt: "O principal é o OlhoNaLei, uma plataforma civic-tech que construí sozinho. Também SenseComment (SaaS, mais de 500 assinantes pagantes), Paneleiros (app de futebol nas duas lojas) e EcoDoctor (pagamentos em saúde, mais de R$ 5 mi no primeiro ano), além dos mais novos: Lore, Medha, Outpost, Chamego e Agendinha.",
    },
    links: [links.work, links.labs],
  },
  {
    id: "mobile",
    keywords: [
      "mobile", "ios", "android", "flutter", "app", "apps", "iphone", "ipad", "react native", "capacitor",
      "kotlin", "celular", "aplicativo", "aplicativos",
    ],
    answer: {
      en: "Mobile work: Paneleiros (Flutter, live on the App Store and Google Play), Chamego (a Flutter baby monitor with peer-to-peer WebRTC video), Outpost (Flutter for iPhone, Android, web and macOS) and Medha's iOS app (Capacitor). Earlier, native Android at Caronaê.",
      pt: "Mobile: Paneleiros (Flutter, na App Store e no Google Play), Chamego (babá eletrônica em Flutter com vídeo WebRTC direto entre aparelhos), Outpost (Flutter para iPhone, Android, web e macOS) e o app iOS do Medha (Capacitor). Antes, Android nativo na Caronaê.",
    },
    links: [project("paneleiros", "Paneleiros"), project("chamego", "Chamego")],
  },
  {
    id: "leadership",
    keywords: [
      "lead", "leader", "leadership", "led", "manage", "manager", "management", "team", "teams", "cto",
      "founder", "cofounder", "co founder", "mentor", "mentoring", "lideranca", "lider", "liderar", "liderou",
      "equipe", "gestao", "gestor", "fundador", "cofundador",
    ],
    answer: {
      en: "Co-founder & CTO of Jovens Gênios (edtech, 100k+ users, ~R$100M valuation); Tech Lead at Matrix Energia, where I introduced CI, code review and testing standards that cut production incidents by ~30%; and founder of several products I built end to end.",
      pt: "Cofundador e CTO da Jovens Gênios (edtech, mais de 100 mil usuários, valuation de ~R$ 100 mi); Tech Lead na Matrix Energia, onde implantei CI, code review e padrões de teste que reduziram os incidentes em produção em ~30%; e fundador de vários produtos que construí de ponta a ponta.",
    },
    links: [links.experience],
  },
  {
    id: "experience",
    keywords: [
      "experience", "years", "career", "background", "history", "worked", "companies", "company", "employers",
      "previous", "past", "senior", "seniority", "jobs", "experiencia", "anos", "carreira", "historico", "empresas",
      "empresa", "trabalhou", "trajetoria", "empregos", "senioridade",
    ],
    answer: {
      en: "12+ years, professionally since 2014. Senior Full-Stack Engineer (contract) at The Contract Network, a US company building an LLM-based contract-analysis product; Tech Lead at Matrix Energia; co-founder and CTO of Jovens Gênios, an edtech that passed 100,000 users. Alongside those, I founded and built products of my own.",
      pt: "Mais de 12 anos, profissionalmente desde 2014. Engenheiro Full Stack Sênior (contractor) na The Contract Network, empresa americana com um produto de análise de contratos baseado em LLMs; Tech Lead na Matrix Energia; cofundador e CTO da Jovens Gênios, uma edtech que passou de 100 mil usuários. Em paralelo, fundei e construí produtos próprios.",
    },
    links: [links.experience, links.cv],
  },
  {
    id: "education",
    keywords: [
      "education", "degree", "university", "college", "school", "study", "studied", "ufrj", "cs50", "harvard",
      "udacity", "certification", "certifications", "certificate", "course", "courses", "graduate", "graduated",
      "bachelor", "formacao", "faculdade", "universidade", "graduacao", "curso", "cursos", "certificacao",
      "certificado", "diploma", "estudou",
    ],
    answer: {
      en: "I studied Electronic & Computer Engineering at UFRJ (2012–2017) and left before finishing to co-found Jovens Gênios. Certifications: Harvard CS50, the Udacity Android Nanodegree and Google Project Management.",
      pt: "Estudei Engenharia Eletrônica e de Computação na UFRJ (2012–2017) e saí antes de concluir para cofundar a Jovens Gênios. Certificações: Harvard CS50, Udacity Android Nanodegree e Google Project Management.",
    },
    links: [links.background],
  },
  {
    id: "spoken-languages",
    keywords: [
      "speak", "spoken", "english", "portuguese", "spanish", "fluent", "fluency", "idiomas", "idioma", "ingles",
      "portugues", "espanhol", "fala", "fluente",
    ],
    answer: {
      en: "Portuguese (native), English (advanced) and Spanish (intermediate).",
      pt: "Português (nativo), inglês (avançado) e espanhol (intermediário).",
    },
    links: [links.background],
  },
  {
    id: "stack",
    keywords: [
      "stack", "skills", "skill", "tech", "technologies", "technology", "tools", "languages", "programming",
      "frameworks", "framework", "typescript", "javascript", "react", "next.js", "nextjs", "node",
      "node.js", "nodejs", "python", "fastapi", "sql", "postgres", "postgresql", "aws", "gcp", "frontend",
      "backend", "full stack", "fullstack", ".net", "dotnet", "c#", "golang", "rust", "tecnologias",
      "tecnologia", "linguagens", "ferramentas", "habilidades", "competencias",
    ],
    answer: {
      en: "Core stack: Node.js (~10 yrs), SQL (10+ yrs, mostly PostgreSQL), React (~8 yrs, including Next.js 15 / React 19), TypeScript (~7 yrs), Python (~5 yrs: FastAPI and data pipelines) and AWS serverless (~5 yrs). I also ship C#/.NET 8, Flutter, Go and Rust in my own products.",
      pt: "Stack principal: Node.js (~10 anos), SQL (10+ anos, sobretudo PostgreSQL), React (~8 anos, inclusive Next.js 15 / React 19), TypeScript (~7 anos), Python (~5 anos: FastAPI e pipelines de dados) e AWS serverless (~5 anos). Também uso C#/.NET 8, Flutter, Go e Rust nos meus produtos.",
    },
    links: [links.skills],
  },
  {
    id: "location",
    keywords: [
      "where", "location", "located", "based", "city", "country", "brazil", "timezone", "time zone", "utc",
      "hours", "overlap", "onde", "mora", "cidade", "pais", "brasil", "fuso", "fuso horario", "horario",
    ],
    answer: {
      en: "Campo Grande, Mato Grosso do Sul, Brazil: UTC−4 all year, which overlaps fully with US Eastern and Central business hours.",
      pt: "Campo Grande, Mato Grosso do Sul: UTC−4 o ano todo, com sobreposição total com o horário comercial do leste e do centro dos EUA.",
    },
    links: [links.contact],
  },
  {
    id: "who",
    keywords: [
      "who", "yourself", "introduce", "introduction", "bio", "about you", "tell me about yourself", "quem",
      "apresente", "apresentacao", "sobre voce",
    ],
    answer: {
      en: "I'm Luis Nicolau, a senior full-stack engineer with 12+ years building products end to end in TypeScript, React, Node.js and Python, lately focused on AI in production. I'm based in Brazil and work remotely.",
      pt: "Sou o Luis Nicolau, engenheiro full stack sênior com mais de 12 anos construindo produtos de ponta a ponta em TypeScript, React, Node.js e Python, com foco recente em IA em produção. Moro no Brasil e trabalho remoto.",
    },
    links: [section("about", { en: "About", pt: "Sobre" }), links.cv],
  },
  {
    id: "greeting",
    keywords: ["hi", "hello", "hey", "hola", "ola", "oi", "opa", "bom dia", "boa tarde", "boa noite", "good morning", "help", "ajuda"],
    answer: {
      en: "Hi! Ask about my projects, the stack, AI work, performance, availability, or how to reach me.",
      pt: "Oi! Pergunte sobre meus projetos, a stack, IA, performance, disponibilidade ou como falar comigo.",
    },
  },
];

export const fallbackAnswer: Localized = {
  en: "I don't have a ready answer for that. Try “performance”, “AI”, “availability” or a project name, or just email me.",
  pt: "Não tenho uma resposta pronta para isso. Tente “performance”, “IA”, “disponibilidade” ou o nome de um projeto, ou me mande um e-mail.",
};

export const fallbackLinks: AskLink[] = [links.email, links.work];
