"use client";

import { useEffect, useState } from "react";
import { ESTADOS } from "@/lib/brasil";
import type { Championship, Federation } from "@/lib/types";

export type ChampionshipFormValues = {
  name: string;
  federationId: string;
  date: string;
  state: string;
  city: string;
  venue: string;
  latitude: string;
  longitude: string;
  sourceUrl: string;
};

function toFormValues(c?: Championship): ChampionshipFormValues {
  return {
    name: c?.name ?? "",
    federationId: c?.federationId ?? "",
    date: c ? new Date(c.date).toISOString().slice(0, 10) : "",
    state: c?.state ?? "",
    city: c?.city ?? "",
    venue: c?.venue ?? "",
    latitude: c ? String(c.latitude) : "",
    longitude: c ? String(c.longitude) : "",
    sourceUrl: c?.sourceUrl ?? "",
  };
}

export default function ChampionshipForm({
  initial,
  onSubmit,
  submitLabel,
}: {
  initial?: Championship;
  onSubmit: (values: ChampionshipFormValues) => Promise<void>;
  submitLabel: string;
}) {
  const [values, setValues] = useState<ChampionshipFormValues>(toFormValues(initial));
  const [federations, setFederations] = useState<Federation[]>([]);
  const [newFederationName, setNewFederationName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/federations")
      .then((res) => res.json())
      .then(setFederations);
  }, []);

  function set<K extends keyof ChampionshipFormValues>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      let federationId = values.federationId;

      if (federationId === "__nova__") {
        if (!newFederationName.trim()) {
          throw new Error("Informe o nome da nova federação.");
        }
        const res = await fetch("/api/federations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newFederationName.trim() }),
        });
        if (!res.ok) throw new Error("Não foi possível criar a federação.");
        const federation: Federation = await res.json();
        federationId = federation.id;
      }

      await onSubmit({ ...values, federationId });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl">
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">{error}</p>
      )}

      <Field label="Nome do campeonato">
        <input
          required
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          className="input"
        />
      </Field>

      <Field label="Federação">
        <select
          required
          value={values.federationId}
          onChange={(e) => set("federationId", e.target.value)}
          className="input"
        >
          <option value="">Selecione…</option>
          {federations.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
          <option value="__nova__">+ Nova federação…</option>
        </select>
      </Field>

      {values.federationId === "__nova__" && (
        <Field label="Nome da nova federação">
          <input
            required
            value={newFederationName}
            onChange={(e) => setNewFederationName(e.target.value)}
            className="input"
          />
        </Field>
      )}

      <Field label="Data">
        <input
          required
          type="date"
          value={values.date}
          onChange={(e) => set("date", e.target.value)}
          className="input"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Estado">
          <select
            required
            value={values.state}
            onChange={(e) => set("state", e.target.value)}
            className="input"
          >
            <option value="">UF</option>
            {ESTADOS.map((e) => (
              <option key={e.uf} value={e.uf}>
                {e.uf} — {e.nome}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Cidade">
          <input
            required
            value={values.city}
            onChange={(e) => set("city", e.target.value)}
            className="input"
          />
        </Field>
      </div>

      <Field label="Local (opcional)">
        <input
          value={values.venue}
          onChange={(e) => set("venue", e.target.value)}
          className="input"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Latitude (opcional)">
          <input
            type="number"
            step="any"
            value={values.latitude}
            onChange={(e) => set("latitude", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="Longitude (opcional)">
          <input
            type="number"
            step="any"
            value={values.longitude}
            onChange={(e) => set("longitude", e.target.value)}
            className="input"
          />
        </Field>
      </div>
      <p className="-mt-2 text-xs text-neutral-500 dark:text-neutral-400">
        Deixe em branco para descobrirmos automaticamente pela Cidade/Estado. Se preferir informar
        manualmente, pesquise o endereço no Google Maps, clique com o botão direito no local e
        copie as coordenadas.
      </p>

      <Field label="Link da fonte (opcional)">
        <input
          type="url"
          placeholder="https://..."
          value={values.sourceUrl}
          onChange={(e) => set("sourceUrl", e.target.value)}
          className="input"
        />
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 rounded-full bg-gradient-to-r from-belt-blue to-belt-blue-dark px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
      >
        {submitting ? "Salvando…" : submitLabel}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{label}</span>
      {children}
    </label>
  );
}
