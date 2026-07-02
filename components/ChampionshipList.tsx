import type { Championship } from "@/lib/types";
import { toCalendarDate } from "@/lib/date";
import ChampionshipCard from "./ChampionshipCard";

type Item = { championship: Championship; distanceKm?: number };

export default function ChampionshipList({
  items,
  groupByMonth,
}: {
  items: Item[];
  groupByMonth: boolean;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-300 py-16 text-center text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
        Nenhum campeonato encontrado com esses filtros.
      </div>
    );
  }

  if (!groupByMonth) {
    return (
      <div className="flex flex-col gap-3">
        {items.map(({ championship, distanceKm }) => (
          <ChampionshipCard
            key={championship.id}
            championship={championship}
            distanceKm={distanceKm}
          />
        ))}
      </div>
    );
  }

  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const label = toCalendarDate(item.championship.date).toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
    const key = label.charAt(0).toUpperCase() + label.slice(1);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }

  return (
    <div className="flex flex-col gap-6">
      {Array.from(groups.entries()).map(([month, monthItems]) => (
        <div key={month}>
          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            <span className="h-1.5 w-1.5 rounded-full bg-belt-blue" />
            {month}
          </h2>
          <div className="flex flex-col gap-3">
            {monthItems.map(({ championship, distanceKm }) => (
              <ChampionshipCard
                key={championship.id}
                championship={championship}
                distanceKm={distanceKm}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
