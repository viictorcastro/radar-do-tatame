"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChampionshipForm, { type ChampionshipFormValues } from "@/components/ChampionshipForm";
import type { Championship } from "@/lib/types";

export default function EditarChampionshipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [championship, setChampionship] = useState<Championship | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/championships/${id}`).then(async (res) => {
      if (!res.ok) {
        setNotFound(true);
        return;
      }
      setChampionship(await res.json());
    });
  }, [id]);

  async function handleSubmit(values: ChampionshipFormValues) {
    const res = await fetch(`/api/championships/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        federationId: values.federationId,
        date: values.date,
        state: values.state,
        city: values.city,
        venue: values.venue || undefined,
        latitude: values.latitude ? Number(values.latitude) : undefined,
        longitude: values.longitude ? Number(values.longitude) : undefined,
        sourceUrl: values.sourceUrl || undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.error || "Não foi possível salvar o campeonato.");
    }
    router.push("/admin");
    router.refresh();
  }

  if (notFound) {
    return <p className="text-neutral-500 dark:text-neutral-400">Campeonato não encontrado.</p>;
  }

  if (!championship) {
    return <p className="text-neutral-500 dark:text-neutral-400">Carregando…</p>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight dark:text-neutral-50">Editar campeonato</h1>
      <ChampionshipForm
        initial={championship}
        onSubmit={handleSubmit}
        submitLabel="Salvar alterações"
      />
    </div>
  );
}
