import { toCalendarDate, brasiliaToday } from "@/lib/date";
import { getFederationBadge, hashString } from "@/lib/federation-badge";
import type { Championship } from "@/lib/types";

const DAY_MS = 24 * 60 * 60 * 1000;
const CENTER = { x: 560, y: 190 };
const MAX_DOTS = 16;
const MIN_RADIUS = 40;
const MAX_RADIUS = 260;

function daysUntil(date: Date): number {
  const today = brasiliaToday();
  return Math.round((date.getTime() - today.getTime()) / DAY_MS);
}

export default function RadarHero({ championships }: { championships: Championship[] }) {
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
      size: isSoon ? 6 : 4,
    };
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        viewBox="0 0 800 380"
        className="absolute right-0 top-1/2 h-[280px] w-[560px] max-w-none -translate-y-1/2 opacity-[0.16] dark:opacity-[0.14] sm:h-[380px] sm:w-[760px]"
      >
        <g className="radar-sweep" style={{ transformOrigin: `${CENTER.x}px ${CENTER.y}px` }}>
          <path
            d={`M ${CENTER.x} ${CENTER.y} L ${CENTER.x + 260} ${CENTER.y - 140} A 290 290 0 0 1 ${CENTER.x + 260} ${CENTER.y + 140} Z`}
            fill="#16a34a"
            opacity="0.35"
          />
        </g>

        <circle cx={CENTER.x} cy={CENTER.y} r={MAX_RADIUS} fill="none" stroke="#16a34a" strokeWidth="1" opacity="0.4" />
        <circle cx={CENTER.x} cy={CENTER.y} r={MAX_RADIUS * 0.66} fill="none" stroke="#16a34a" strokeWidth="1" opacity="0.3" />
        <circle cx={CENTER.x} cy={CENTER.y} r={MAX_RADIUS * 0.33} fill="none" stroke="#16a34a" strokeWidth="1" opacity="0.3" />

        {dots.map((dot) => (
          <circle key={dot.id} cx={dot.x} cy={dot.y} r={dot.size} fill={dot.color} opacity="0.9" />
        ))}

        <circle cx={CENTER.x} cy={CENTER.y} r="7" fill="#16a34a" />
      </svg>
    </div>
  );
}
