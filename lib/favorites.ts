const STORAGE_KEY = "jj-favoritos";
export const FAVORITES_EVENT = "favoritos-changed";

function readIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeIds(ids: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(FAVORITES_EVENT));
}

export function getFavoriteIds(): string[] {
  return readIds();
}

export function isFavoriteId(id: string): boolean {
  return readIds().includes(id);
}

export function toggleFavoriteId(id: string): boolean {
  const ids = readIds();
  const index = ids.indexOf(id);

  if (index === -1) {
    writeIds([...ids, id]);
    return true;
  }

  writeIds(ids.filter((existing) => existing !== id));
  return false;
}
