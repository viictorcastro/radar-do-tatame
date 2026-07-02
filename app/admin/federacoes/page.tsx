"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Federation } from "@/lib/types";

export default function FederacoesPage() {
  const [federations, setFederations] = useState<Federation[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    fetch("/api/federations")
      .then((res) => res.json())
      .then((data: Federation[]) => {
        if (cancelled) return;
        setFederations(data);
        setDrafts(Object.fromEntries(data.map((f) => [f.id, f.website ?? ""])));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave(id: string) {
    setSavingId(id);
    const website = drafts[id]?.trim() ?? "";
    const res = await fetch(`/api/federations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ website }),
    });
    if (res.ok) {
      const updated: Federation = await res.json();
      setFederations((prev) => prev.map((f) => (f.id === id ? updated : f)));
    }
    setSavingId(null);
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight dark:text-neutral-50">Federações</h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Cadastre o site oficial de cada federação — é para onde o link do campeonato leva quando
          o link direto do evento não funciona.
        </p>
      </div>

      {loading ? (
        <p className="text-neutral-500 dark:text-neutral-400">Carregando…</p>
      ) : (
        <div className="flex flex-col gap-3">
          {federations.map((f) => (
            <div key={f.id} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <p className="mb-2 font-medium text-neutral-900 dark:text-neutral-100">{f.name}</p>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://..."
                  value={drafts[f.id] ?? ""}
                  onChange={(e) => setDrafts((prev) => ({ ...prev, [f.id]: e.target.value }))}
                  className="input flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleSave(f.id)}
                  disabled={savingId === f.id}
                  className="rounded-full bg-gradient-to-r from-belt-blue to-belt-blue-dark px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                >
                  {savingId === f.id ? "Salvando…" : "Salvar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link href="/admin" className="mt-6 inline-block text-sm font-medium text-belt-blue hover:underline dark:text-blue-400">
        ← Voltar para o painel
      </Link>
    </div>
  );
}
