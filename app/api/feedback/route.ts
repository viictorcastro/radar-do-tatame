import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

export async function GET() {
  const feedback = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(feedback);
}

const feedbackInput = z.object({
  message: z.string().trim().min(1, "Escreva uma mensagem.").max(2000),
  contact: z.string().trim().max(200).optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = feedbackInput.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const feedback = await prisma.feedback.create({
    data: {
      message: parsed.data.message,
      contact: parsed.data.contact || null,
    },
  });

  return NextResponse.json(feedback, { status: 201 });
}
