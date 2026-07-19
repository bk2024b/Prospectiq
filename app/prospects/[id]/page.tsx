import { createClient } from "@/lib/supabase/server";
import { ScoreBadge } from "@/components/ScoreBadge";
import { notFound } from "next/navigation";

export default async function ProspectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: prospect } = await supabase
    .from("prospects")
    .select("*, audits(*), scores(*)")
    .eq("id", params.id)
    .single();

  if (!prospect) notFound();

  const score = prospect.scores?.[0];
  const audit = prospect.audits?.[0];

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">{prospect.name}</h1>
          <p className="mt-1 text-muted">
            {prospect.category} · {prospect.address}
          </p>
        </div>
        {score && <ScoreBadge score={score.total} />}
      </div>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
          Pourquoi ce prospect
        </h2>
        <ul className="mt-3 space-y-2">
          {score?.reasons?.map((r: any, i: number) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-lg border border-line px-4 py-3"
            >
              <span>{r.label}</span>
              <span className="font-mono text-signal">+{r.points}</span>
            </li>
          ))}
        </ul>
      </section>

      {audit && (
        <section className="mt-10">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
            Audit du site
          </h2>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-line px-4 py-3">
              <dt className="text-muted">HTTPS</dt>
              <dd>{audit.has_https ? "Oui" : "Non"}</dd>
            </div>
            <div className="rounded-lg border border-line px-4 py-3">
              <dt className="text-muted">Responsive</dt>
              <dd>{audit.is_responsive ? "Oui" : "Non"}</dd>
            </div>
            <div className="rounded-lg border border-line px-4 py-3">
              <dt className="text-muted">Temps de chargement</dt>
              <dd>{audit.load_time_ms ? `${audit.load_time_ms} ms` : "—"}</dd>
            </div>
            <div className="rounded-lg border border-line px-4 py-3">
              <dt className="text-muted">Balises SEO</dt>
              <dd>{audit.has_seo_title ? "OK" : "Manquantes"}</dd>
            </div>
          </dl>
        </section>
      )}

      <section className="mt-10 flex gap-3 text-sm">
        {prospect.website && (
          <a
            href={prospect.website}
            target="_blank"
            className="rounded-lg border border-line px-4 py-2 hover:border-signal"
          >
            Voir le site
          </a>
        )}
        {prospect.phone && (
          <a
            href={`tel:${prospect.phone}`}
            className="rounded-lg border border-line px-4 py-2 hover:border-signal"
          >
            {prospect.phone}
          </a>
        )}
      </section>
    </main>
  );
}
