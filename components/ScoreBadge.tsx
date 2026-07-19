export function ScoreBadge({ score }: { score: number }) {
  const tone =
    score >= 80
      ? "bg-ember/15 text-ember border-ember/30"
      : score >= 60
      ? "bg-signal/15 text-signal border-signal/30"
      : "bg-muted/15 text-muted border-muted/30";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs ${tone}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {score}
    </span>
  );
}
