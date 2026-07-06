"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import ChampionshipFilters, {
  type SortMode,
  type ViewMode,
} from "@/components/ChampionshipFilters";
import ChampionshipList from "@/components/ChampionshipList";
import RadarHero from "@/components/RadarHero";
import { SponsorPlaceholder, WhatsAppPlaceholder } from "@/components/SidebarPromo";
import { distanceKm } from "@/lib/geo";
import { FAVORITES_EVENT, getFavoriteIds } from "@/lib/favorites";
import type { Championship } from "@/lib/types";

const ChampionshipMap = dynamic(() => import("@/components/ChampionshipMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[520px] items-center justify-center rounded-lg border border-neutral-200 text-neutral-400">
      Carregando mapa…
    </div>
  ),
});

type GeoStatus = "idle" | "loading" | "granted" | "denied";
type Tab = "proximos" | "realizados";

export default function HomePage() {
  const [tab, setTab] = useState<Tab>("proximos");
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedFederations, setSelectedFederations] = useState<string[]>([]);
  const [sort, setSort] = useState<SortMode>("data");
  const [view, setView] = useState<ViewMode>("lista");
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(
    null
  );
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    function sync() {
      if (!cancelled) setFavoriteIds(getFavoriteIds());
    }

    queueMicrotask(sync);

    window.addEventListener(FAVORITES_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      cancelled = true;
      window.removeEventListener(FAVORITES_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (!cancelled) setLoading(true);
    });

    const query = tab === "realizados" ? "past=true" : "upcoming=true";

    fetch(`/api/championships?${query}`)
      .then((res) => res.json())
      .then((data: Championship[]) => {
        if (cancelled) return;
        setChampionships(data);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tab]);

  useEffect(() => {
    if (sort !== "proximidade" || userLocation || geoStatus === "denied") return;

    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      if (!("geolocation" in navigator)) {
        setGeoStatus("denied");
        return;
      }

      setGeoStatus("loading");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (cancelled) return;
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setGeoStatus("granted");
        },
        () => {
          if (!cancelled) setGeoStatus("denied");
        },
        { timeout: 10000 }
      );
    });

    return () => {
      cancelled = true;
    };
  }, [sort, userLocation, geoStatus]);

  const states = useMemo(
    () => Array.from(new Set(championships.map((c) => c.state))).sort(),
    [championships]
  );

  const cities = useMemo(() => {
    const pool = selectedStates.length
      ? championships.filter((c) => selectedStates.includes(c.state))
      : championships;
    return Array.from(new Set(pool.map((c) => c.city))).sort();
  }, [championships, selectedStates]);

  const federations = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of championships) map.set(c.federationId, c.federation.name);
    return Array.from(map, ([id, name]) => ({ id, name })).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [championships]);

  const filtered = useMemo(() => {
    return championships.filter((c) => {
      if (selectedStates.length && !selectedStates.includes(c.state)) return false;
      if (selectedCities.length && !selectedCities.includes(c.city)) return false;
      if (selectedFederations.length && !selectedFederations.includes(c.federationId)) return false;
      if (onlyFavorites && !favoriteIds.includes(c.id)) return false;
      return true;
    });
  }, [championships, selectedStates, selectedCities, selectedFederations, onlyFavorites, favoriteIds]);

  const items = useMemo(() => {
    const withDistance = filtered.map((championship) => ({
      championship,
      distanceKm:
        sort === "proximidade" && userLocation
          ? distanceKm(userLocation, {
              latitude: championship.latitude,
              longitude: championship.longitude,
            })
          : undefined,
    }));

    if (sort === "proximidade" && userLocation) {
      withDistance.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
    } else {
      const direction = tab === "realizados" ? -1 : 1;
      withDistance.sort(
        (a, b) =>
          direction *
          (new Date(a.championship.date).getTime() - new Date(b.championship.date).getTime())
      );
    }

    return withDistance;
  }, [filtered, sort, userLocation, tab]);

  function handleStatesChange(values: string[]) {
    setSelectedStates(values);
    if (values.length === 0) return;
    const validCities = new Set(
      championships.filter((c) => values.includes(c.state)).map((c) => c.city)
    );
    setSelectedCities((prev) => prev.filter((city) => validCities.has(city)));
  }

  return (
    <div className="lg:grid lg:grid-cols-[220px_1fr_220px] lg:items-start lg:gap-6">
      <aside className="mb-6 lg:sticky lg:top-20 lg:order-1 lg:mb-0">
        <ChampionshipFilters
          states={states}
          cities={cities}
          federations={federations}
          selectedStates={selectedStates}
          selectedCities={selectedCities}
          selectedFederations={selectedFederations}
          onStatesChange={handleStatesChange}
          onCitiesChange={setSelectedCities}
          onFederationsChange={setSelectedFederations}
          sort={sort}
          onSortChange={setSort}
          view={view}
          onViewChange={setView}
          geoStatus={geoStatus}
          onlyFavorites={onlyFavorites}
          onOnlyFavoritesChange={setOnlyFavorites}
        />
      </aside>

      <div className="lg:order-2">
      <div className="relative mb-6 overflow-hidden rounded-2xl">
        {!loading && tab === "proximos" && championships.length > 0 && (
          <RadarHero championships={championships} />
        )}

        <div className="relative flex flex-col gap-6 py-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Todo campeonato de jiu-jitsu, no{" "}
              <span className="bg-gradient-to-r from-belt-blue to-belt-purple bg-clip-text text-transparent">
                seu radar.
              </span>
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400">
              Todos os campeonatos das federações, em um só calendário.
            </p>
            {!loading && (
              <span className="mt-2 inline-block rounded-full bg-belt-blue/10 px-3 py-1 text-sm font-semibold text-belt-blue dark:bg-blue-400/10 dark:text-blue-300">
                {items.length} campeonato{items.length === 1 ? "" : "s"} encontrado
                {items.length === 1 ? "" : "s"}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="relative mb-6 flex w-fit rounded-full bg-neutral-100 p-1 text-sm font-medium dark:bg-neutral-800">
        <div
          className={`absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full bg-belt-blue shadow-sm transition-transform duration-200 ease-out ${
            tab === "realizados" ? "translate-x-[calc(100%+0.5rem)]" : "translate-x-0"
          }`}
        />
        <button
          type="button"
          onClick={() => setTab("proximos")}
          className={`relative z-10 rounded-full px-4 py-1.5 transition-colors ${
            tab === "proximos" ? "text-white" : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
          }`}
        >
          Próximos
        </button>
        <button
          type="button"
          onClick={() => setTab("realizados")}
          className={`relative z-10 rounded-full px-4 py-1.5 transition-colors ${
            tab === "realizados" ? "text-white" : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
          }`}
        >
          Realizados
        </button>
      </div>

      {loading ? (
        <p className="text-neutral-500 dark:text-neutral-400">Carregando campeonatos…</p>
      ) : view === "lista" ? (
        <ChampionshipList items={items} groupByMonth={sort === "data"} />
      ) : (
        <ChampionshipMap championships={items.map((i) => i.championship)} />
      )}
      </div>

      <aside className="mb-6 flex flex-col gap-4 lg:sticky lg:top-20 lg:order-3 lg:mb-0">
        <SponsorPlaceholder />
        <WhatsAppPlaceholder />
      </aside>
    </div>
  );
}
