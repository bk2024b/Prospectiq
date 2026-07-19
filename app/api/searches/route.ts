import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Ce endpoint ne scrape jamais lui-même : Vercel coupe les fonctions après
// quelques secondes, incompatible avec un scraping Playwright. Il crée la
// recherche en base puis réveille le worker hébergé (Railway/Fly.io), qui
// écrit ses résultats directement dans Supabase avec la service_role key.

export async function POST(req: NextRequest) {
  const { niche, city } = await req.json();

  if (!niche || !city) {
    return NextResponse.json({ error: "niche et city requis" }, { status: 400 });
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "non authentifié" }, { status: 401 });
  }

  const { data: search, error } = await supabase
    .from("searches")
    .insert({ niche, city, user_id: user.id, status: "pending" })
    .select()
    .single();

  if (error || !search) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }

  // Réveille le worker hébergé de manière asynchrone — on ne bloque pas la
  // réponse sur la durée du scraping.
  fetch(`${process.env.WORKER_URL}/scrape`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.WORKER_SECRET}`,
  },
  body: JSON.stringify({ searchId: search.id, niche, city, userId: user.id }),
})
  .then((r) => {
    if (!r.ok) {
      r.text().then((body) =>
        console.error(`Worker a répondu ${r.status}:`, body)
      );
    }
  })
  .catch((err) => {
    console.error("Impossible de joindre le worker:", err);
  });

  return NextResponse.json({ searchId: search.id });
}
