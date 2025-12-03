import { NextResponse } from "next/server";
import { parseArticle } from "@/lib/parser";
import { sha256 } from "@/lib/hash";
import { Agent } from "undici";

export const dynamic = "force-dynamic";

export const ZOE_URL =
  "https://www.zoe.com.ua/графіки-погодинних-стабілізаційних/";

export const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

export const dispatcher = new Agent({
  connect: {
    rejectUnauthorized: false, // << disable SSL validation
  },
});

export async function GET() {
  const res = await fetch(ZOE_URL, {
    headers: HEADERS,
    cache: "no-store",
    dispatcher,
  } as unknown as RequestInit);

  if (!res.ok)
    return NextResponse.json(
      { error: "fetch_failed", status: res.status },
      { status: 502 }
    );

  const html = await res.text();

  const blocks = parseArticle(html);
  const pageHash = sha256(html);

  return NextResponse.json({
    pageHash,
    blocks,
    lastUpdated: new Date().toISOString(),
  });
}
