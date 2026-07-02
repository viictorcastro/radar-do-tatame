import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

export async function GET() {
  const federations = await prisma.federation.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(federations);
}

const federationInput = z.object({
  name: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = federationInput.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const federation = await prisma.federation.create({
    data: { name: parsed.data.name },
  });

  return NextResponse.json(federation, { status: 201 });
}
