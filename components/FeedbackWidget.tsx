"use client";

import { useEffect, useState } from "react";

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  function handleClose() {
    setOpen(false);
    setError(null);
    setSent(false);
    setMessage("");
    setContact("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, contact: contact || undefined }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error?.fieldErrors?.message?.[0] || "Não foi possível enviar.");
      }

      setSent(true);
      setMessage("");
      setContact("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível enviar.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Envie-nos uma mensagem"
        aria-label="Envie-nos uma mensagem"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-belt-blue to-belt-purple text-white shadow-lg transition hover:scale-110 hover:shadow-xl"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={handleClose}
        >
          <div
            className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-5 shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
            onClick={(e) => e.stopPropagation()}
          >
            {sent ? (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <p className="text-2xl">🥋</p>
                <p className="font-semibold text-neutral-900 dark:text-neutral-50">
                  Mensagem enviada!
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Obrigado pela sugestão. Vamos dar uma olhada.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-2 rounded-full bg-gradient-to-r from-belt-blue to-belt-blue-dark px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02]"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                      Envie-nos uma mensagem
                    </h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Sugestões, campeonatos faltando, problemas — o que quiser.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Fechar"
                    className="shrink-0 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                  >
                    ✕
                  </button>
                </div>

                {error && (
                  <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
                    {error}
                  </p>
                )}

                <textarea
                  required
                  autoFocus
                  rows={4}
                  placeholder="Escreva sua mensagem…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input resize-none"
                />

                <input
                  type="text"
                  placeholder="Seu e-mail ou contato (opcional)"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="input"
                />

                <button
                  type="submit"
                  disabled={submitting || !message.trim()}
                  className="rounded-full bg-gradient-to-r from-belt-blue to-belt-blue-dark px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                >
                  {submitting ? "Enviando…" : "Enviar"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
