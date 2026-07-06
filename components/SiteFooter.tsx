"use client";

export default function SiteFooter() {
  function openFeedback() {
    window.dispatchEvent(new Event("open-feedback"));
  }

  return (
    <footer className="mt-10 bg-belt-black text-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="font-display text-xl font-bold uppercase tracking-wide leading-none">
          Radar · Tatame
        </p>

        <div className="flex items-center gap-4">
          <span title="Em breve" className="text-neutral-400">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M12 2.2c2.7 0 3 0 4 .1 1 .1 1.7.2 2.3.5.6.2 1.1.6 1.6 1.1.5.5.8 1 1.1 1.6.2.6.4 1.3.5 2.3.1 1 .1 1.3.1 4s0 3-.1 4c-.1 1-.2 1.7-.5 2.3-.2.6-.6 1.1-1.1 1.6-.5.5-1 .8-1.6 1.1-.6.2-1.3.4-2.3.5-1 .1-1.3.1-4 .1s-3 0-4-.1c-1-.1-1.7-.2-2.3-.5-.6-.2-1.1-.6-1.6-1.1-.5-.5-.8-1-1.1-1.6-.2-.6-.4-1.3-.5-2.3-.1-1-.1-1.3-.1-4s0-3 .1-4c.1-1 .2-1.7.5-2.3.2-.6.6-1.1 1.1-1.6.5-.5 1-.8 1.6-1.1.6-.2 1.3-.4 2.3-.5 1-.1 1.3-.1 4-.1zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zm5.2-8.4a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
            </svg>
          </span>
          <span title="Em breve" className="text-neutral-400">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.2.2-.4.1-.1.1-.3 0-.4-.1-.1-.5-1.2-.7-1.7-.2-.4-.4-.4-.5-.4h-.5c-.1 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.1 1.6 2.5 3.9 3.4.5.2 1 .4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3Z" />
            </svg>
          </span>

          <button
            type="button"
            onClick={openFeedback}
            className="rounded-full border border-neutral-600 px-3.5 py-1.5 text-xs font-medium text-neutral-200 transition hover:bg-white/10"
          >
            Cadastre seu campeonato
          </button>
        </div>
      </div>
    </footer>
  );
}
