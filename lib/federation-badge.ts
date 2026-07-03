type FederationBadge = { label: string; className: string };

const FEDERATION_BADGES: Record<string, FederationBadge> = {
  "CBJJ - Confederação Brasileira de Jiu-Jitsu": { label: "CBJJ", className: "bg-blue-600" },
  "IBJJF - International Brazilian Jiu-Jitsu Federation": {
    label: "IBJJF",
    className: "bg-indigo-600",
  },
  "AJP Tour": { label: "AJP", className: "bg-amber-600" },
  "Federação Paulista de Jiu-Jitsu": { label: "FPJJ", className: "bg-green-600" },
  "CBJJO - Confederação Brasileira de Jiu-Jitsu Olímpico": {
    label: "CBJJO",
    className: "bg-purple-600",
  },
  CBJJE: { label: "CBJJE", className: "bg-rose-600" },
  CBJJD: { label: "CBJJD", className: "bg-teal-600" },
  "FJJ RIO": { label: "FJJ RIO", className: "bg-cyan-600" },
  FMJJ: { label: "FMJJ", className: "bg-orange-600" },
  "FJJEMG - Federação de Jiu Jitsu do Estado de Minas Gerais": {
    label: "FJJEMG",
    className: "bg-emerald-600",
  },
};

const FALLBACK_COLORS = [
  "bg-blue-600",
  "bg-indigo-600",
  "bg-amber-600",
  "bg-green-600",
  "bg-purple-600",
  "bg-rose-600",
  "bg-teal-600",
  "bg-cyan-600",
  "bg-orange-600",
  "bg-emerald-600",
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getFederationBadge(federationName: string): FederationBadge {
  const known = FEDERATION_BADGES[federationName];
  if (known) return known;

  const shortName = federationName.split(" - ")[0].split(" ")[0];
  const color = FALLBACK_COLORS[hashString(federationName) % FALLBACK_COLORS.length];
  return { label: shortName.slice(0, 6).toUpperCase(), className: color };
}
