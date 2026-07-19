import { SearchBar } from "@/components/SearchBar";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6">
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-signal">
        ProspectIQ
      </p>
      <h1 className="font-display text-4xl leading-tight sm:text-5xl">
        Trouve les entreprises qui ont vraiment besoin de toi.
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        Recherche par métier et par ville. On analyse leur site, leur SEO et
        leur activité en ligne, puis on te dit lesquels sont prêts à acheter
        — et pourquoi.
      </p>
      <div className="mt-10">
        <SearchBar />
      </div>
    </main>
  );
}
