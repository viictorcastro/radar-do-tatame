type Coordinates = { latitude: number; longitude: number };

const USER_AGENT = "RadarDoTatame/1.0 (app de calendário de campeonatos de Jiu-Jitsu)";

export async function geocodeCityState(city: string, state: string): Promise<Coordinates | null> {
  const query = new URLSearchParams({
    city,
    state,
    country: "Brazil",
    format: "json",
    limit: "1",
  });

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`https://nominatim.openstreetmap.org/search?${query}`, {
      headers: { "User-Agent": USER_AGENT },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const results: Array<{ lat: string; lon: string }> = await res.json();
    const first = results[0];
    if (!first) return null;

    const latitude = Number(first.lat);
    const longitude = Number(first.lon);
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;

    return { latitude, longitude };
  } catch {
    return null;
  }
}
