import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ScoreBadge } from "@/components/ScoreBadge";

export default async function ProspectsPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const supabase = createClient();

  let query = supabase
    .from("prospects")
    .select("id, name, category, rating, review_count, website, scores(total)")
    .order("created_at", { ascending: false });

  if (searchParams.search) {
    query = query.eq("search_id", searchParams.search);
  }

  const { data: prospects } = await query;

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-3xl">Prospects</h1>
      <p className="mt-2 text-muted">
        Classés par opportunité — commence par les scores les plus élevés.
      </p>

      <div className="mt-8 overflow-hidden rounded-xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper/5 text-muted">
            <tr>
              <th className="px-4 py-3 font-normal">Entreprise</th>
              <th className="px-4 py-3 font-normal">Catégorie</th>
              <th className="px-4 py-3 font-normal">Avis</th>
              <th className="px-4 py-3 font-normal">Score</th>
            </tr>
          </thead>
          <tbody>
            {prospects?.length ? (
              prospects.map((p: any) => (
                <tr key={p.id} className="border-t border-line">
                  <td className="px-4 py-3">
                    <Link
                      href={`/prospects/${p.id}`}
                      className="hover:text-signal"
                    >
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">{p.category ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">
                    {p.rating ?? "—"} ({p.review_count ?? 0})
                  </td>
                  <td className="px-4 py-3">
                    <ScoreBadge score={p.scores?.[0]?.total ?? 0} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted">
                  Aucun prospect pour l'instant — lance une recherche depuis
                  l'accueil.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
