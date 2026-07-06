"use client";

import { useEffect, useState } from "react";
import { toCalendarDate, brasiliaToday } from "@/lib/date";
import { getFederationBadge, hashString } from "@/lib/federation-badge";
import type { Championship } from "@/lib/types";

const DAY_MS = 24 * 60 * 60 * 1000;
const CENTER = { x: 620, y: 100 };
const MAX_DOTS = 16;
const MIN_RADIUS = 22;
const MAX_RADIUS = 150;

// Rio de Janeiro — usado como referência quando a localização do navegador
// não está disponível (é onde a maior parte dos campeonatos acontece hoje).
const FALLBACK_LOCATION = { latitude: -22.9068, longitude: -43.1729 };

function daysUntil(date: Date): number {
  const today = brasiliaToday();
  return Math.round((date.getTime() - today.getTime()) / DAY_MS);
}

function formatCoord(value: number, positiveSuffix: string, negativeSuffix: string): string {
  const suffix = value >= 0 ? positiveSuffix : negativeSuffix;
  return `${Math.abs(value).toFixed(2)} ${suffix}`;
}

export default function RadarHero({ championships }: { championships: Championship[] }) {
  const [location, setLocation] = useState(FALLBACK_LOCATION);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;

    let cancelled = false;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (cancelled) return;
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {},
      { timeout: 5000 }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  const withDays = championships.map((c) => ({
    championship: c,
    days: Math.max(daysUntil(toCalendarDate(c.date)), 0),
  }));

  const shown = [...withDays].sort((a, b) => a.days - b.days).slice(0, MAX_DOTS);

  const maxDays = Math.max(...shown.map((c) => c.days), 1);
  const minDays = Math.min(...shown.map((c) => c.days), 0);
  const spread = Math.max(maxDays - minDays, 1);

  const dots = shown.map(({ championship, days }) => {
    const radius = MIN_RADIUS + ((days - minDays) / spread) * (MAX_RADIUS - MIN_RADIUS);
    const angle = (hashString(championship.id) % 360) * (Math.PI / 180);
    const x = CENTER.x + radius * Math.cos(angle);
    const y = CENTER.y + radius * Math.sin(angle);
    const isSoon = days < 10;
    return {
      id: championship.id,
      x,
      y,
      color: getFederationBadge(championship.federation.name).hex,
      size: isSoon ? 5 : 3.5,
    };
  });

  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <svg viewBox="0 0 800 220" className="h-[180px] w-full sm:h-[220px]">
        <g
          className="radar-sweep"
          style={{ transformOrigin: `${CENTER.x}px ${CENTER.y}px` }}
        >
          <path
            d={`M ${CENTER.x} ${CENTER.y} L ${CENTER.x + 170} ${CENTER.y - 90} A 190 190 0 0 1 ${CENTER.x + 170} ${CENTER.y + 90} Z`}
            fill="#16a34a"
            opacity="0.12"
          />
        </g>

        <line
          x1={CENTER.x}
          y1={CENTER.y - 22}
          x2={CENTER.x}
          y2={CENTER.y + 22}
          stroke="#16a34a"
          strokeWidth="1.5"
        />

        {dots.map((dot) => (
          <circle key={dot.id} cx={dot.x} cy={dot.y} r={dot.size} fill={dot.color} opacity="0.85" />
        ))}

        <circle cx={CENTER.x} cy={CENTER.y} r="6" fill="#16a34a" />
      </svg>

      <p className="border-t border-neutral-100 px-4 py-2 font-mono text-[0.65rem] uppercase tracking-wider text-neutral-400 dark:border-neutral-800 dark:text-neutral-500">
        {formatCoord(location.latitude, "N", "S")} · {formatCoord(location.longitude, "L", "O")} ·{" "}
        {championships.length} eventos detectados
      </p>
    </div>
  );
}
