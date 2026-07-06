"use client";

import { useEffect, useState } from "react";
import HeartIcon from "./HeartIcon";
import { FAVORITES_EVENT, isFavoriteId, toggleFavoriteId } from "@/lib/favorites";

export default function FavoriteButton({ championshipId }: { championshipId: string }) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    let cancelled = false;

    function sync() {
      if (!cancelled) setFavorite(isFavoriteId(championshipId));
    }

    queueMicrotask(sync);

    window.addEventListener(FAVORITES_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      cancelled = true;
      window.removeEventListener(FAVORITES_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [championshipId]);

  return (
    <button
      type="button"
      onClick={() => setFavorite(toggleFavoriteId(championshipId))}
      title={favorite ? "Remover dos favoritos" : "Favoritar"}
      aria-label={favorite ? "Remover dos favoritos" : "Favoritar"}
      aria-pressed={favorite}
      className={`group shrink-0 rounded-md p-1.5 transition hover:scale-110 hover:bg-belt-amber/10 dark:hover:bg-belt-amber/20 ${
        favorite ? "" : "text-neutral-300 hover:text-belt-amber dark:text-neutral-600"
      }`}
    >
      <HeartIcon filled={favorite} className="h-6 w-6" />
    </button>
  );
}
