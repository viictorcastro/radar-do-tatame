"use client";

import { useState } from "react";
import Link from "next/link";

type ImportResult = {
  criados: number;
  pulados: { linha: number; motivo: string }[];
  erros: { linha: number; motivo: string }[];
};

export default function ImportarPage() {
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/championships/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao importar a planilha.");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao importar a planilha.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="mb-2 text-2xl font-bold tracking-tight dark:text-neutral-50">Importar planilha</h1>
      <p className="mb-6 text-neutral-500 dark:text-neutral-400">
        Suba uma planilha .xlsx com vários campeonatos de uma vez. Linhas duplicadas (mesmo nome,
        data e cidade de um campeonato já cadastrado) são puladas automaticamente. Se você deixar
        Latitude/Longitude em branco, tentamos descobrir automaticamente pela Cidade/Estado.
      </p>

      <a
        href="/templates/modelo-campeonatos.xlsx"
        download
        className="mb-6 inline-block rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
      >
        ⬇ Baixar planilha-modelo (.xlsx)
      </a>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">{error}</p>}

        <input
          type="file"
          accept=".xlsx"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="input"
        />

        <button
          type="submit"
          disabled={!file || submitting}
          className="rounded-full bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
        >
          {submitting ? "Importando…" : "Importar"}
        </button>
      </form>

      {result && (
        <div className="mt-6 flex flex-col gap-3">
          <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
            {result.criados} campeonato(s) criado(s) com sucesso.
          </p>

          {result.pulados.length > 0 && (
            <div className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <p className="font-semibold">{result.pulados.length} linha(s) pulada(s) (duplicadas):</p>
              <ul className="mt-1 list-disc pl-5">
                {result.pulados.map((p) => (
                  <li key={p.linha}>
                    Linha {p.linha}: {p.motivo}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.erros.length > 0 && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
              <p className="font-semibold">{result.erros.length} linha(s) com erro:</p>
              <ul className="mt-1 list-disc pl-5">
                {result.erros.map((e) => (
                  <li key={e.linha}>
                    Linha {e.linha}: {e.motivo}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link href="/admin" className="text-sm font-medium text-green-700 hover:underline dark:text-green-400">
            ← Voltar para o painel
          </Link>
        </div>
      )}
    </div>
  );
}
