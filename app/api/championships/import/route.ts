import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/db";
import { geocodeCityState } from "@/lib/geocode";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type RowResult = { linha: number; motivo: string };

const COLUMNS = [
  "name",
  "federation",
  "date",
  "state",
  "city",
  "venue",
  "latitude",
  "longitude",
  "sourceUrl",
] as const;

function cellText(value: ExcelJS.CellValue): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object" && "text" in value) return String(value.text ?? "");
  if (typeof value === "object" && "result" in value) return String(value.result ?? "");
  return String(value).trim();
}

function parseDate(value: ExcelJS.CellValue): Date | null {
  if (value instanceof Date) return value;
  const text = cellText(value).trim();
  if (!text) return null;
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = new ExcelJS.Workbook();

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- exceljs's Buffer type comes from a different @types/node version than ours
    await workbook.xlsx.load(buffer as any);
  } catch {
    return NextResponse.json(
      { error: "Não foi possível ler o arquivo. Envie um .xlsx válido." },
      { status: 400 }
    );
  }

  const sheet = workbook.worksheets[0];
  if (!sheet) {
    return NextResponse.json({ error: "A planilha está vazia." }, { status: 400 });
  }

  const existing = await prisma.championship.findMany({
    select: { name: true, date: true, city: true },
  });

  const federationCache = new Map<string, string>();
  const federations = await prisma.federation.findMany();
  for (const f of federations) federationCache.set(f.name.toLowerCase(), f.id);

  const pulados: RowResult[] = [];
  const erros: RowResult[] = [];
  let criados = 0;

  for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber++) {
    const row = sheet.getRow(rowNumber);
    if (row.actualCellCount === 0) continue;

    const raw: Record<string, string> = {};
    COLUMNS.forEach((key, index) => {
      raw[key] = cellText(row.getCell(index + 1).value);
    });

    if (!raw.name && !raw.federation && !raw.city) continue;

    if (!raw.name || !raw.federation || !raw.date || !raw.state || !raw.city) {
      erros.push({ linha: rowNumber, motivo: "Campos obrigatórios ausentes." });
      continue;
    }

    const date = parseDate(row.getCell(3).value);
    if (!date) {
      erros.push({ linha: rowNumber, motivo: "Data inválida." });
      continue;
    }

    const state = raw.state.toUpperCase().slice(0, 2);

    if (raw.latitude && Number.isNaN(Number(raw.latitude))) {
      erros.push({ linha: rowNumber, motivo: "Latitude inválida." });
      continue;
    }
    if (raw.longitude && Number.isNaN(Number(raw.longitude))) {
      erros.push({ linha: rowNumber, motivo: "Longitude inválida." });
      continue;
    }

    const isDuplicate = existing.some(
      (c) =>
        c.name.trim().toLowerCase() === raw.name.trim().toLowerCase() &&
        c.city.trim().toLowerCase() === raw.city.trim().toLowerCase() &&
        sameDay(c.date, date)
    );
    if (isDuplicate) {
      pulados.push({ linha: rowNumber, motivo: "Já existe um campeonato com mesmo nome, data e cidade." });
      continue;
    }

    let latitude = raw.latitude ? Number(raw.latitude) : undefined;
    let longitude = raw.longitude ? Number(raw.longitude) : undefined;

    if (latitude === undefined || longitude === undefined) {
      const geocoded = await geocodeCityState(raw.city, state);
      await sleep(1100); // respeita o limite de 1 requisição/segundo do Nominatim
      if (!geocoded) {
        erros.push({
          linha: rowNumber,
          motivo:
            "Não foi possível geocodificar a cidade automaticamente. Preencha latitude/longitude manualmente.",
        });
        continue;
      }
      latitude = geocoded.latitude;
      longitude = geocoded.longitude;
    }

    let federationId = federationCache.get(raw.federation.trim().toLowerCase());
    if (!federationId) {
      const created = await prisma.federation.create({ data: { name: raw.federation.trim() } });
      federationId = created.id;
      federationCache.set(raw.federation.trim().toLowerCase(), created.id);
    }

    await prisma.championship.create({
      data: {
        name: raw.name.trim(),
        federationId,
        date,
        state,
        city: raw.city.trim(),
        venue: raw.venue.trim() || null,
        latitude,
        longitude,
        sourceUrl: raw.sourceUrl.trim() || null,
      },
    });

    existing.push({ name: raw.name, date, city: raw.city });
    criados++;
  }

  return NextResponse.json({ criados, pulados, erros });
}
