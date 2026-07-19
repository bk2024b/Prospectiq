"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [niche, setNiche] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!niche.trim() || !city.trim()) return;
    setLoading(true);

    const res = await fetch("/api/searches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ niche, city }),
    });

    setLoading(false);

    if (res.ok) {
      const { searchId } = await res.json();
      router.push(`/prospects?search=${searchId}`);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-center"
    >
      <input
        value={niche}
        onChange={(e) => setNiche(e.target.value)}
        placeholder="Restaurants, dentistes, garages…"
        className="flex-1 rounded-lg border border-line bg-paper/5 px-4 py-3 text-paper placeholder:text-muted focus:border-signal focus:outline-none"
      />
      <span className="hidden text-muted sm:block">à</span>
      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Cotonou"
        className="flex-1 rounded-lg border border-line bg-paper/5 px-4 py-3 text-paper placeholder:text-muted focus:border-signal focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-signal px-6 py-3 font-medium text-ink transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Lancement…" : "Trouver des prospects"}
      </button>
    </form>
  );
}
