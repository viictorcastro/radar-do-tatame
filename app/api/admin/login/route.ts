import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_COOKIE_NAME, computeSessionToken } from "@/lib/admin-auth";

const loginInput = z.object({ password: z.string().min(1) });

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = loginInput.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Informe a senha." }, { status: 400 });
  }

  if (parsed.data.password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
  }

  const token = await computeSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
