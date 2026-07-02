export default function KimonoIcon({
  filled,
  className,
}: {
  filled: boolean;
  className?: string;
}) {
  const detailColor = filled ? "white" : "currentColor";

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      {filled && (
        <defs>
          <linearGradient id="kimono-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--color-belt-amber)" />
            <stop offset="1" stopColor="var(--color-belt-purple)" />
          </linearGradient>
        </defs>
      )}

      <path
        d="M7 3 L17 3 L21 8 L19 9.5 L18 21 L6 21 L5 9.5 L3 8 Z"
        fill={filled ? "url(#kimono-fill)" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.4}
        strokeLinejoin="round"
      />

      <path d="M4.2 10 L6.4 13" stroke={detailColor} strokeWidth="1" strokeLinecap="round" opacity="0.8" />
      <path d="M19.8 10 L17.6 13" stroke={detailColor} strokeWidth="1" strokeLinecap="round" opacity="0.8" />

      <path d="M8 3.4 L16 15" stroke={detailColor} strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <path d="M16 3.4 L11 10.4" stroke={detailColor} strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <circle cx="13" cy="7" r="0.7" fill={detailColor} />
      <circle cx="11.2" cy="11" r="0.7" fill={detailColor} />

      <rect x="4.5" y="15" width="15" height="2" rx="0.4" fill={detailColor} opacity={filled ? 0.95 : 1} stroke={filled ? "none" : "currentColor"} strokeWidth={filled ? 0 : 1.1} />

      <path d="M10.5 17.2 L15 21" stroke={detailColor} strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M13.5 17.2 L9 21" stroke={detailColor} strokeWidth="1.2" strokeLinecap="round" fill="none" />

      <rect x="5.2" y="18.4" width="3" height="2" rx="0.4" stroke={detailColor} strokeWidth="0.9" fill="none" opacity="0.85" />
      <circle cx="17" cy="19" r="0.55" fill={detailColor} opacity="0.85" />
    </svg>
  );
}
