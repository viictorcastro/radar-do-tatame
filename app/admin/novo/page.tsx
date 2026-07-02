"use client";

import { useRouter } from "next/navigation";
import ChampionshipForm, { type ChampionshipFormValues } from "@/components/ChampionshipForm";

export default function NovoChampionshipPage() {
  const router = useRouter();

  async function handleSubmit(values: ChampionshipFormValues) {
    const res = await fetch("/api/championships", {
      method: "POST",
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

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight dark:text-neutral-50">Novo campeonato</h1>
      <ChampionshipForm onSubmit={handleSubmit} submitLabel="Criar campeonato" />
    </div>
  );
}
