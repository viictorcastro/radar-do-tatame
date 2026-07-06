"use client";

export function SponsorPlaceholder() {
  function handleClick() {
    window.dispatchEvent(new Event("open-feedback"));
  }

  return (
    <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-4 text-center dark:border-neutral-700 dark:bg-neutral-900">
      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        Espaço patrocinado
      </p>
      <button
        type="button"
        onClick={handleClick}
        className="mt-2 rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
      >
        Fale conosco
      </button>
    </div>
  );
}

export function WhatsAppPlaceholder() {
  return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center dark:border-green-900 dark:bg-green-950/40">
      <div className="flex items-center justify-center gap-1.5 text-green-700 dark:text-green-400">
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.2.2-.4.1-.1.1-.3 0-.4-.1-.1-.5-1.2-.7-1.7-.2-.4-.4-.4-.5-.4h-.5c-.1 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.1 1.6 2.5 3.9 3.4.5.2 1 .4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3Z" />
        </svg>
        <p className="text-sm font-semibold">Avisos no seu grupo de treino</p>
      </div>
      <p className="mt-1 text-xs text-green-700/80 dark:text-green-400/80">
        Entre no nosso canal do WhatsApp para novidades e avisos de campeonatos.
      </p>
      <button
        type="button"
        disabled
        title="Em breve"
        className="mt-3 inline-flex cursor-not-allowed items-center gap-1.5 rounded-full bg-green-200/60 px-3.5 py-1.5 text-xs font-medium text-green-800 opacity-80 dark:bg-green-900/50 dark:text-green-300"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
          <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
        </svg>
        Entrar
      </button>
    </div>
  );
}
