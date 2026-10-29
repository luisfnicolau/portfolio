import { ArrowDown, ArrowLeftRight, ArrowRight } from "lucide-react";
import { getDictionary } from "@/content/ui";
import type { Locale } from "@/lib/i18n";

interface Stage {
  label: string;
  nodes: { title: string; note?: string }[];
  core?: boolean;
}

/** OlhoNaLei's data flow, from the two government APIs to the site, search and social posts. */
export function Pipeline({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).pipeline;
  const stages: Stage[] = [
    { label: t.sources, nodes: [{ title: t.camara }, { title: t.senado }] },
    { label: t.ingest, nodes: [{ title: t.python, note: t.pythonNote }] },
    { label: t.staging, nodes: [{ title: t.firestore, note: t.firestoreNote }] },
    { label: t.store, nodes: [{ title: t.postgres, note: t.postgresNote }], core: true },
    { label: t.analysis, nodes: [{ title: t.claude, note: t.claudeNote }] },
    { label: t.delivery, nodes: [{ title: t.site }, { title: t.search }, { title: t.social, note: t.socialNote }] },
  ];

  return (
    <figure className="reveal overflow-hidden rounded-2xl border border-line bg-surface p-5 sm:p-8">
      <ol className="grid gap-2 lg:grid-cols-6 lg:gap-0">
        {stages.map((stage, index) => {
          const last = index === stages.length - 1;
          // Analysis reads from the store and writes its results back.
          const Connector = index === 3 ? ArrowLeftRight : ArrowRight;
          return (
            <li key={stage.label} className="relative flex flex-col lg:pr-6">
              <p className="kicker mb-2 text-[0.6rem] text-subtle lg:mb-3">{stage.label}</p>
              <div className="flex flex-1 flex-col justify-center gap-2">
                {stage.nodes.map((node) => (
                  <div
                    key={node.title}
                    className={`rounded-xl border px-3 py-2.5 ${
                      stage.core ? "border-accent/50 bg-accent/10" : "border-line bg-bg"
                    }`}
                  >
                    <p className="text-[0.8rem]/snug font-semibold">{node.title}</p>
                    {node.note ? <p className="mt-1 font-mono text-[0.6rem]/snug text-subtle">{node.note}</p> : null}
                  </div>
                ))}
              </div>
              {last ? null : (
                <>
                  <Connector
                    aria-hidden
                    size={16}
                    className="absolute top-1/2 right-1 hidden translate-y-2 text-accent-ink lg:block"
                  />
                  <ArrowDown aria-hidden size={16} className="mx-auto mt-2 text-accent-ink lg:hidden" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
