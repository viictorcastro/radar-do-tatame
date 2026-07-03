import Link from "next/link";
import type { Championship } from "@/lib/types";
import { formatDistance } from "@/lib/geo";
import { toCalendarDate, brasiliaToday } from "@/lib/date";
import FavoriteButton from "./FavoriteButton";
import StateFlag from "./StateFlag";
import { getFederationBadge } from "@/lib/federation-badge";

const DAY_MS = 24 * 60 * 60 * 1000;

function daysUntil(date: Date): number {
  const today = brasiliaToday();
  return Math.round((date.getTime() - today.getTime()) / DAY_MS);
}

function countdownLabel(days: number): string {
  if (days <= 0) return "HOJE";
  if (days === 1) return "falta 1 dia para a competição";
  return `faltam ${days} dias para a competição`;
}

export default function ChampionshipCard({
  championship,
  distanceKm,
}: {
  championship: Championship;
  distanceKm?: number;
}) {
  const date = toCalendarDate(championship.date);
  const hasLink = Boolean(championship.sourceUrl || championship.federation.website);
  const days = daysUntil(date);
  const isSoon = days >= 0 && days < 10;
  const federationBadge = getFederationBadge(championship.federation.name);

  return (
    <div className="group relative flex gap-4 overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-belt-blue/10 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:shadow-belt-blue/20">
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-belt-blue to-belt-purple" />

      <div className="flex shrink-0 flex-col items-center gap-1 pl-2">
        <div className="rounded-2xl bg-gradient-to-br from-belt-blue to-belt-blue-dark px-3 py-2 text-center text-white shadow-sm">
          <p className="text-[0.65rem] font-semibold uppercase leading-none tracking-wide opacity-90">
            {date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}
          </p>
          <p className="text-xl font-bold leading-none mt-1">
            {date.toLocaleDateString("pt-BR", { day: "2-digit" })}
          </p>
        </div>
        <FavoriteButton championshipId={championship.id} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 font-semibold text-neutral-900 dark:text-neutral-50">
              <span
                className={`shrink-0 rounded px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-white ${federationBadge.className}`}
              >
                {federationBadge.label}
              </span>
              <span className="min-w-0">{championship.name}</span>
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{championship.federation.name}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-600 dark:text-neutral-300">
          <span className="inline-flex items-center gap-1.5">
            <StateFlag uf={championship.state} />
            {championship.city}/{championship.state}
          </span>
          {typeof distanceKm === "number" && (
            <span className="font-medium text-neutral-800 dark:text-neutral-200">
              a {formatDistance(distanceKm)} de você
            </span>
          )}

          {hasLink && (
            <Link
              href={`/go/${championship.id}`}
              target="_blank"
              className="ml-auto shrink-0 text-sm font-medium text-belt-blue transition group-hover:translate-x-0.5 hover:underline dark:text-blue-400"
            >
              Ver detalhes / inscrição →
            </Link>
          )}
        </div>

        {isSoon && (
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-belt-amber to-red-500 px-3 py-1 text-xs font-semibold text-white">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            {countdownLabel(days)}
          </div>
        )}
      </div>
    </div>
  );
}
