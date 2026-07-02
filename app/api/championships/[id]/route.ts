import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { geocodeCityState } from "@/lib/geocode";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const championship = await prisma.championship.findUnique({
    where: { id },
    include: { federation: true },
  });

  if (!championship) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  return NextResponse.json(championship);
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

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
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

  const championship = await prisma.championship.update({
    where: { id },
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

  return NextResponse.json(championship);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  await prisma.championship.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
