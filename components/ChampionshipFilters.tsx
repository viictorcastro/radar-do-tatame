"use client";

import { nomeEstado } from "@/lib/brasil";
import HeartIcon from "./HeartIcon";
import MultiSelectChips from "./MultiSelectChips";

export type SortMode = "data" | "proximidade";
export type ViewMode = "lista" | "mapa";

export type FederationOption = { id: string; name: string };

export default function ChampionshipFilters({
  states,
  cities,
  federations,
  selectedStates,
  selectedCities,
  selectedFederations,
  onStatesChange,
  onCitiesChange,
  onFederationsChange,
  sort,
  onSortChange,
  view,
  onViewChange,
  geoStatus,
  onlyFavorites,
  onOnlyFavoritesChange,
}: {
  states: string[];
  cities: string[];
  federations: FederationOption[];
  selectedStates: string[];
  selectedCities: string[];
  selectedFederations: string[];
  onStatesChange: (values: string[]) => void;
  onCitiesChange: (values: string[]) => void;
  onFederationsChange: (values: string[]) => void;
  sort: SortMode;
  onSortChange: (value: SortMode) => void;
  view: ViewMode;
  onViewChange: (value: ViewMode) => void;
  geoStatus: "idle" | "loading" | "granted" | "denied";
  onlyFavorites: boolean;
  onOnlyFavoritesChange: (value: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex flex-col gap-4">
        <MultiSelectChips
          label="Federação"
          options={federations.map((f) => ({ value: f.id, label: f.name }))}
          selected={selectedFederations}
          onChange={onFederationsChange}
        />
        <MultiSelectChips
          label="Estado"
          options={states.map((uf) => ({ value: uf, label: nomeEstado(uf) }))}
          selected={selectedStates}
          onChange={onStatesChange}
        />
        <MultiSelectChips
          label="Cidade"
          options={cities.map((city) => ({ value: city, label: city }))}
          selected={selectedCities}
          onChange={onCitiesChange}
          disabled={cities.length === 0}
          emptyLabel="Nenhuma cidade disponível"
        />
      </div>

      <div className="flex flex-col gap-3 border-t border-neutral-100 pt-3 dark:border-neutral-800">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400" htmlFor="filter-sort">
            Ordenar por
          </label>
          <select
            id="filter-sort"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortMode)}
            className="input w-full"
          >
            <option value="data">Data (mais próximos)</option>
            <option value="proximidade">Proximidade</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => onOnlyFavoritesChange(!onlyFavorites)}
          aria-pressed={onlyFavorites}
          className={`flex w-full items-center justify-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition ${
            onlyFavorites
              ? "border-belt-amber bg-belt-amber/10 text-belt-amber"
              : "border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
          }`}
        >
          <HeartIcon filled={onlyFavorites} className="h-4 w-4" />
          Favoritos
        </button>

        <div className="relative flex w-full rounded-full bg-neutral-100 p-1 text-sm font-medium dark:bg-neutral-800">
          <div
            className={`absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full bg-belt-blue shadow-sm transition-transform duration-200 ease-out ${
              view === "mapa" ? "translate-x-[calc(100%+0.5rem)]" : "translate-x-0"
            }`}
          />
          <button
            type="button"
            onClick={() => onViewChange("lista")}
            className={`relative z-10 flex-1 rounded-full px-4 py-1.5 transition-colors ${
              view === "lista" ? "text-white" : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
            }`}
          >
            Lista
          </button>
          <button
            type="button"
            onClick={() => onViewChange("mapa")}
            className={`relative z-10 flex-1 rounded-full px-4 py-1.5 transition-colors ${
              view === "mapa" ? "text-white" : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
            }`}
          >
            Mapa
          </button>
        </div>
      </div>

      {sort === "proximidade" && geoStatus === "denied" && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          Não conseguimos acessar sua localização — mostrando por data. Permita o acesso à
          localização no navegador para ordenar por proximidade.
        </p>
      )}
      {sort === "proximidade" && geoStatus === "loading" && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Obtendo sua localização…</p>
      )}
    </div>
  );
}
