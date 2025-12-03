import { NextResponse } from "next/server";
import { loadCache, saveCache } from "@/lib/cache";
import { dispatcher, HEADERS, ZOE_URL } from "../parse/route";
import { sha256 } from "@/lib/hash";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch(ZOE_URL, {
      headers: HEADERS,
      cache: "no-store",
      dispatcher,
    } as unknown as RequestInit);

    const html = await res.text();

    const newHash = sha256(html);
    const cache = loadCache();

    if (!cache) {
      saveCache({ lastHash: newHash });

      return NextResponse.json({
        updated: true,
        reason: "no-cache",
        newHash,
      });
    }

    if (cache.lastHash !== newHash) {
      saveCache({ lastHash: newHash });

      return NextResponse.json({
        updated: true,
        reason: "content-changed",
        oldHash: cache.lastHash,
        newHash,
      });
    }

    return NextResponse.json({
      updated: false,
      reason: "same-content",
      oldHash: cache.lastHash,
    });
  } catch (error) {
    return NextResponse.json({ error: true, message: error }, { status: 500 });
  }
}
