"use client";

import { useMemo } from "react";
import { getFederationBadge } from "@/lib/federation-badge";
import type { SortMode } from "./ChampionshipFilters";
import type { Championship } from "@/lib/types";

type FederationOption = { id: string; name: string };
type GeoStatus = "idle" | "loading" | "granted" | "denied";

export default function QuickFilterTabs({
  federations,
  championships,
  selectedFederations,
  onFederationsChange,
  sort,
  onSortChange,
  geoStatus,
}: {
  federations: FederationOption[];
  championships: Championship[];
  selectedFederations: string[];
  onFederationsChange: (values: string[]) => void;
  sort: SortMode;
  onSortChange: (value: SortMode) => void;
  geoStatus: GeoStatus;
}) {
  const topFederations = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of championships) {
      counts.set(c.federationId, (counts.get(c.federationId) ?? 0) + 1);
    }
    return [...federations]
      .sort((a, b) => (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0))
      .slice(0, 4);
  }, [federations, championships]);

  const isNearMe = sort === "proximidade";

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 text-sm font-medium">
      <button
        type="button"
        onClick={() => onFederationsChange([])}
        className={`rounded-full px-3.5 py-1.5 transition ${
          selectedFederations.length === 0
            ? "bg-belt-blue text-white"
            : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
        }`}
      >
        Todas
      </button>

      {topFederations.map((federation) => {
        const badge = getFederationBadge(federation.name);
        const isSelected =
          selectedFederations.length === 1 && selectedFederations[0] === federation.id;
        return (
          <button
            key={federation.id}
            type="button"
            onClick={() => onFederationsChange(isSelected ? [] : [federation.id])}
            className={`rounded-full px-3.5 py-1.5 transition ${
              isSelected
                ? "text-white"
                : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            }`}
            style={isSelected ? { backgroundColor: badge.hex } : undefined}
          >
            {badge.label}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onSortChange(isNearMe ? "data" : "proximidade")}
        className={`rounded-full px-3.5 py-1.5 transition ${
          isNearMe
            ? "bg-belt-blue text-white"
            : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
        }`}
      >
        📍 {isNearMe && geoStatus === "loading" ? "Localizando…" : "Perto de mim"}
      </button>
    </div>
  );
}
