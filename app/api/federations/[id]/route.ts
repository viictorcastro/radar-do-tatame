import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

const federationUpdateInput = z.object({
  name: z.string().min(1).optional(),
  website: z.string().url().optional().or(z.literal("")),
});

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const parsed = federationUpdateInput.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const federation = await prisma.federation.update({
    where: { id },
    data: {
      ...(parsed.data.name !== undefined ? { name: parsed.data.name } : {}),
      ...(parsed.data.website !== undefined
        ? { website: parsed.data.website || null }
        : {}),
    },
  });

  return NextResponse.json(federation);
}
