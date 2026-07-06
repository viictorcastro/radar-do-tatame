import { getFederationBadge } from "@/lib/federation-badge";

type FederationOption = { id: string; name: string };

export default function PartnerFederations({
  federations,
}: {
  federations: FederationOption[];
}) {
  if (federations.length === 0) return null;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
        Federações parceiras
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {federations.map((federation) => {
          const badge = getFederationBadge(federation.name);
          return (
            <div key={federation.id} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: badge.hex }}
              />
              <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                {badge.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
