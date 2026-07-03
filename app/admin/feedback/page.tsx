"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Feedback } from "@/lib/types";

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/feedback");
    setFeedback(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    queueMicrotask(load);
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta mensagem?")) return;
    await fetch(`/api/feedback/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight dark:text-neutral-50">
          Mensagens recebidas
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Sugestões e feedback enviados pelos visitantes do site.
        </p>
      </div>

      {loading ? (
        <p className="text-neutral-500 dark:text-neutral-400">Carregando…</p>
      ) : feedback.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">Nenhuma mensagem recebida ainda.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {feedback.map((f) => (
            <div
              key={f.id}
              className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <p className="whitespace-pre-wrap text-neutral-900 dark:text-neutral-50">
                {f.message}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>
                  {f.contact ? `Contato: ${f.contact} · ` : ""}
                  {new Date(f.createdAt).toLocaleString("pt-BR")}
                </span>
                <button
                  onClick={() => handleDelete(f.id)}
                  className="font-medium text-red-600 hover:underline dark:text-red-400"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/admin"
        className="mt-6 inline-block text-sm font-medium text-belt-blue hover:underline dark:text-blue-400"
      >
        ← Voltar para o painel
      </Link>
    </div>
  );
}
