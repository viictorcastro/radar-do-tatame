import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

async function urlIsReachable(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.status === 405 || res.status === 501) {
      // Servidor não aceita HEAD — tenta GET como segunda checagem.
      const controller2 = new AbortController();
      const timeout2 = setTimeout(() => controller2.abort(), 4000);
      const getRes = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller2.signal,
      });
      clearTimeout(timeout2);
      return getRes.status < 400;
    }

    return res.status < 400;
  } catch {
    return false;
  }
}

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  const championship = await prisma.championship.findUnique({
    where: { id },
    include: { federation: true },
  });

  if (!championship) {
    return NextResponse.redirect(new URL("/", _request.url));
  }

  const fallback = championship.federation.website;

  if (championship.sourceUrl) {
    const reachable = await urlIsReachable(championship.sourceUrl);
    if (reachable) {
      return NextResponse.redirect(championship.sourceUrl);
    }
  }

  if (fallback) {
    return NextResponse.redirect(fallback);
  }

  return NextResponse.redirect(new URL("/", _request.url));
}
