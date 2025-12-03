import fs from "fs";
import path from "path";

const CACHE_FILE = path.join(process.cwd(), "schedule-cache.json");

export type CacheShape = {
  lastHash?: string;
  perDate?: Record<string, { hash: string; updatedAt?: string }>; // key: YYYY-MM-DD
};

export function loadCache(): CacheShape {
  try {
    if (!fs.existsSync(CACHE_FILE)) return {};

    const raw = fs.readFileSync(CACHE_FILE, "utf8");

    return JSON.parse(raw || "{}");
  } catch (e) {
    return {};
  }
}

export function saveCache(cache: CacheShape) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
}
