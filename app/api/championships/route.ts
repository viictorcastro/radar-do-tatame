import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { geocodeCityState } from "@/lib/geocode";
import { brasiliaTodayUTC } from "@/lib/date";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state") || undefined;
  const city = searchParams.get("city") || undefined;
  const upcoming = searchParams.get("upcoming") === "true";
  const past = searchParams.get("past") === "true";

  const championships = await prisma.championship.findMany({
    where: {
      ...(state ? { state } : {}),
      ...(city ? { city } : {}),
      ...(upcoming ? { date: { gte: brasiliaTodayUTC() } } : {}),
      ...(past ? { date: { lt: brasiliaTodayUTC() } } : {}),
    },
    include: { federation: true },
    orderBy: { date: past ? "desc" : "asc" },
  });

  return NextResponse.json(championships);
}

const championshipInput = z.object({
  name: z.string().min(1),
  federationId: z.string().min(1),
  date: z.string().min(1),
  state: z.string().length(2),
  city: z.string().min(1),
  venue: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  sourceUrl: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = championshipInput.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  let latitude = data.latitude;
  let longitude = data.longitude;

  if (latitude === undefined || longitude === undefined) {
    const geocoded = await geocodeCityState(data.city, data.state);
    if (!geocoded) {
      return NextResponse.json(
        {
          error:
            "Não foi possível determinar a latitude/longitude automaticamente a partir da cidade. Preencha manualmente.",
        },
        { status: 422 }
      );
    }
    latitude = geocoded.latitude;
    longitude = geocoded.longitude;
  }

  const championship = await prisma.championship.create({
    data: {
      name: data.name,
      federationId: data.federationId,
      date: new Date(data.date),
      state: data.state,
      city: data.city,
      venue: data.venue || null,
      latitude,
      longitude,
      sourceUrl: data.sourceUrl || null,
    },
  });

  return NextResponse.json(championship, { status: 201 });
}
