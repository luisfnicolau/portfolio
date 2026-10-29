import type { Localized } from "./types";

export const principles: { title: Localized; body: Localized }[] = [
  {
    title: { en: "Own it end to end", pt: "Ser dono de ponta a ponta" },
    body: {
      en: "From data model to deploy to support. Comfortable with a one-line goal and no spec.",
      pt: "Do modelo de dados ao deploy e ao suporte. Confortável com um objetivo de uma linha e nenhuma especificação.",
    },
  },
  {
    title: { en: "Measure, don't guess", pt: "Medir, não chutar" },
    body: {
      en: "Benchmarks before and after. Profile the real path, network included.",
      pt: "Benchmarks antes e depois. Perfilar o caminho real, rede incluída.",
    },
  },
  {
    title: { en: "Design for failure", pt: "Projetar para a falha" },
    body: {
      en: "Idempotent jobs, retries with backoff, flags that survive failures, canaries, guards against orphaned jobs, explicit degraded modes and rollback switches.",
      pt: "Jobs idempotentes, retentativas com backoff, marcações que sobrevivem a falhas, canários, proteção contra jobs órfãos, modos degradados explícitos e chaves de rollback.",
    },
  },
  {
    title: { en: "Cost is a feature", pt: "Custo também é funcionalidade" },
    body: {
      en: "Budget caps on every LLM call path, batch APIs, runaway invocations killed, indexes sized to fit.",
      pt: "Teto de gastos em todo caminho que chama LLM, APIs em lote, invocações descontroladas cortadas, índices do tamanho certo.",
    },
  },
  {
    title: { en: "Write decisions down", pt: "Registrar as decisões" },
    body: {
      en: "ADRs, requirement specs, runbooks, and a regression test for every production bug.",
      pt: "ADRs, especificações de requisitos, runbooks e um teste de regressão para cada bug de produção.",
    },
  },
  {
    title: { en: "CI that proves itself", pt: "CI que se prova" },
    body: {
      en: "A new workflow must run once and pass, or it gets disabled.",
      pt: "Um workflow novo precisa rodar uma vez e passar, ou é desativado.",
    },
  },
  {
    title: { en: "Secrets stay out of chat and code", pt: "Segredos fora do chat e do código" },
    body: {
      en: "Agents ask for them through a vault flow and never read them.",
      pt: "Os agentes pedem por um fluxo de cofre e nunca os leem.",
    },
  },
];

/** How a feature goes from idea to merge with AI agents. */
export const agentWorkflow: { step: Localized; body: Localized }[] = [
  {
    step: { en: "Spec", pt: "Especificação" },
    body: {
      en: "I write the spec and the acceptance criteria.",
      pt: "Escrevo a especificação e os critérios de aceite.",
    },
  },
  {
    step: { en: "Draft", pt: "Rascunho" },
    body: {
      en: "The agent drafts, following each repo's instructions and skills from my template.",
      pt: "O agente rascunha, seguindo as instruções e skills de cada repositório, vindas do meu template.",
    },
  },
  {
    step: { en: "Review", pt: "Revisão" },
    body: {
      en: "I review its plan and its diff, and catch confidently wrong framework or architecture calls before merge.",
      pt: "Reviso o plano e o diff, e pego decisões de framework ou arquitetura erradas, ditas com confiança, antes do merge.",
    },
  },
  {
    step: { en: "Verify", pt: "Verificação" },
    body: {
      en: "Tests and checks decide when the work is done, not the agent's own claim.",
      pt: "Testes e verificações decidem quando o trabalho está pronto, não a palavra do agente.",
    },
  },
  {
    step: { en: "Scale", pt: "Escala" },
    body: {
      en: "A manager agent runs workers in parallel, one git worktree each. Overnight runs log every decision for my morning review.",
      pt: "Um agente gerente roda workers em paralelo, cada um no seu git worktree. As execuções noturnas registram cada decisão para eu revisar de manhã.",
    },
  },
];

export const agentTools: Localized = {
  en: "Claude Code every day, plus Cursor and Codex; Copilot and ChatGPT since late 2022. MCP servers for shared memory (Lore), Notion, Railway, AWS and Figma.",
  pt: "Claude Code todos os dias, além de Cursor e Codex; Copilot e ChatGPT desde o fim de 2022. Servidores MCP para memória compartilhada (Lore), Notion, Railway, AWS e Figma.",
};
