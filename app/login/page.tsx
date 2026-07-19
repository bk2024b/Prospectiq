"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-signal">
        ProspectIQ
      </p>
      <h1 className="font-display text-2xl">Connexion</h1>

      {sent ? (
        <p className="mt-4 text-muted">
          Lien de connexion envoyé à {email}. Ouvre ta boîte mail.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="toi@exemple.com"
            className="rounded-lg border border-line bg-paper/5 px-4 py-3 text-paper placeholder:text-muted focus:border-signal focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-signal px-6 py-3 font-medium text-ink hover:opacity-90"
          >
            Recevoir le lien de connexion
          </button>
          {error && <p className="text-sm text-ember">{error}</p>}
        </form>
      )}
    </main>
  );
}