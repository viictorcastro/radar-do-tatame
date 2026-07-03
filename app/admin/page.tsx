"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Championship } from "@/lib/types";
import { toCalendarDate } from "@/lib/date";
import StateFlag from "@/components/StateFlag";

export default function AdminPage() {
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchChampionships(): Promise<Championship[]> {
    const res = await fetch("/api/championships");
    const data: Championship[] = await res.json();
    return [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  useEffect(() => {
    let cancelled = false;

    fetchChampionships().then((data) => {
      if (cancelled) return;
      setChampionships(data);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Excluir este campeonato?")) return;
    await fetch(`/api/championships/${id}`, { method: "DELETE" });
    setChampionships(await fetchChampionships());
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight dark:text-neutral-50">Painel administrativo</h1>
          <p className="text-neutral-500 dark:text-neutral-400">Cadastre e gerencie os campeonatos.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/feedback"
            className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
          >
            Mensagens
          </Link>
          <Link
            href="/admin/federacoes"
            className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
          >
            Federações
          </Link>
          <Link
            href="/admin/importar"
            className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
          >
            Importar planilha
          </Link>
          <Link
            href="/admin/novo"
            className="rounded-full bg-gradient-to-r from-belt-blue to-belt-blue-dark px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:scale-105"
          >
            + Novo campeonato
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-neutral-500 dark:text-neutral-400">Carregando…</p>
      ) : championships.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">Nenhum campeonato cadastrado ainda.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-xs uppercase text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Federação</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Local</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {championships.map((c) => (
                <tr key={c.id} className="border-t border-neutral-100 dark:border-neutral-800">
                  <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">{c.name}</td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{c.federation.name}</td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                    {toCalendarDate(c.date).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                    <span className="inline-flex items-center gap-1.5">
                      <StateFlag uf={c.state} />
                      {c.city}/{c.state}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/${c.id}/editar`}
                      className="mr-3 font-medium text-belt-blue hover:underline dark:text-blue-400"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="font-medium text-red-600 hover:underline dark:text-red-400"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
