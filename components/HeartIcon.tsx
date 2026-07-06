export default function HeartIcon({
  filled,
  className,
}: {
  filled: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {filled && (
        <defs>
          <linearGradient id="heart-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--color-belt-amber)" />
            <stop offset="1" stopColor="var(--color-belt-purple)" />
          </linearGradient>
        </defs>
      )}

      <path
        d="M12 20.2c-.3 0-.6-.1-.8-.3C6.9 16.4 3.6 13.3 3.6 9.6 3.6 6.7 5.8 4.4 8.6 4.4c1.6 0 3 .8 3.4 2 .4-1.2 1.8-2 3.4-2 2.8 0 5 2.3 5 5.2 0 3.7-3.3 6.8-7.6 10.3-.2.2-.5.3-.8.3Z"
        fill={filled ? "url(#heart-fill)" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.6}
        strokeLinejoin="round"
      />
    </svg>
  );
}
