"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { useTheme } from "next-themes";
import type { Championship } from "@/lib/types";
import { toCalendarDate } from "@/lib/date";
import StateFlag from "./StateFlag";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const BRAZIL_CENTER: [number, number] = [-14.235, -51.9253];

const LIGHT_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const DARK_TILE_URL = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const LIGHT_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const DARK_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

function FitBounds({ championships }: { championships: Championship[] }) {
  const map = useMap();

  useEffect(() => {
    if (championships.length === 0) return;

    if (championships.length === 1) {
      map.setView([championships[0].latitude, championships[0].longitude], 11);
      return;
    }

    const bounds = L.latLngBounds(
      championships.map((c) => [c.latitude, c.longitude] as [number, number])
    );
    map.fitBounds(bounds, { padding: [32, 32] });
  }, [championships, map]);

  return null;
}

export default function ChampionshipMap({
  championships,
}: {
  championships: Championship[];
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setMounted(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="h-[520px] w-full overflow-hidden rounded-xl border border-neutral-200 shadow-lg shadow-belt-blue/10 dark:border-neutral-800">
      <MapContainer
        center={BRAZIL_CENTER}
        zoom={4}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          key={isDark ? "dark" : "light"}
          attribution={isDark ? DARK_ATTRIBUTION : LIGHT_ATTRIBUTION}
          url={isDark ? DARK_TILE_URL : LIGHT_TILE_URL}
        />
        <FitBounds championships={championships} />
        {championships.map((c) => (
          <Marker key={c.id} position={[c.latitude, c.longitude]} icon={defaultIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{c.name}</p>
                <p className="text-neutral-600 dark:text-neutral-300">{c.federation.name}</p>
                <p className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                  <StateFlag uf={c.state} />
                  {c.city}/{c.state} —{" "}
                  {toCalendarDate(c.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
                {(c.sourceUrl || c.federation.website) && (
                  <Link
                    href={`/go/${c.id}`}
                    target="_blank"
                    className="text-belt-blue hover:underline dark:text-blue-400"
                  >
                    Ver detalhes
                  </Link>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
