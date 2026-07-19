import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProspectIQ — Find. Analyze. Sell.",
  description: "Ton commercial IA qui trouve les prospects prêts à acheter.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="font-body min-h-screen antialiased">{children}</body>
    </html>
  );
}
