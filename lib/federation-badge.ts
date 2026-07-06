type FederationBadge = { label: string; className: string; hex: string };

const FEDERATION_BADGES: Record<string, FederationBadge> = {
  "CBJJ - Confederação Brasileira de Jiu-Jitsu": {
    label: "CBJJ",
    className: "bg-blue-600",
    hex: "#2563eb",
  },
  "IBJJF - International Brazilian Jiu-Jitsu Federation": {
    label: "IBJJF",
    className: "bg-indigo-600",
    hex: "#4f46e5",
  },
  "AJP Tour": { label: "AJP", className: "bg-amber-600", hex: "#d97706" },
  "Federação Paulista de Jiu-Jitsu": {
    label: "FPJJ",
    className: "bg-green-600",
    hex: "#16a34a",
  },
  "CBJJO - Confederação Brasileira de Jiu-Jitsu Olímpico": {
    label: "CBJJO",
    className: "bg-purple-600",
    hex: "#9333ea",
  },
  CBJJE: { label: "CBJJE", className: "bg-rose-600", hex: "#e11d48" },
  CBJJD: { label: "CBJJD", className: "bg-teal-600", hex: "#0d9488" },
  "FJJ RIO": { label: "FJJ RIO", className: "bg-cyan-600", hex: "#0891b2" },
  FMJJ: { label: "FMJJ", className: "bg-orange-600", hex: "#ea580c" },
  "FJJEMG - Federação de Jiu Jitsu do Estado de Minas Gerais": {
    label: "FJJEMG",
    className: "bg-emerald-600",
    hex: "#059669",
  },
};

const FALLBACK_COLORS: Array<{ className: string; hex: string }> = [
  { className: "bg-blue-600", hex: "#2563eb" },
  { className: "bg-indigo-600", hex: "#4f46e5" },
  { className: "bg-amber-600", hex: "#d97706" },
  { className: "bg-green-600", hex: "#16a34a" },
  { className: "bg-purple-600", hex: "#9333ea" },
  { className: "bg-rose-600", hex: "#e11d48" },
  { className: "bg-teal-600", hex: "#0d9488" },
  { className: "bg-cyan-600", hex: "#0891b2" },
  { className: "bg-orange-600", hex: "#ea580c" },
  { className: "bg-emerald-600", hex: "#059669" },
];

export function hashString(value: string): number {
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
  const fallback = FALLBACK_COLORS[hashString(federationName) % FALLBACK_COLORS.length];
  return { label: shortName.slice(0, 6).toUpperCase(), className: fallback.className, hex: fallback.hex };
}
