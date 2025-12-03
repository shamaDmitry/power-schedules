import * as cheerio from "cheerio";

const MONTHS_UA: Record<string, number> = {
  січня: 0,
  лютого: 1,
  березня: 2,
  квітня: 3,
  травня: 4,
  червня: 5,
  липня: 6,
  серпня: 7,
  вересня: 8,
  жовтня: 9,
  листопада: 10,
  грудня: 11,
};

function normalizeSpaces(s: string) {
  return s
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseDayMonthYearFromString(
  s: string
): { year?: number; month?: number; day?: number } | null {
  // match variants: "25 грудня 2025", "2 ГРУДНЯ", "03 грудня 2025"
  const regexFull =
    /(\d{1,2})\s+(січня|лютого|березня|квітня|травня|червня|липня|серпня|вересня|жовтня|листопада|грудня)\s*(\d{4})?/i;
  const m = s.match(regexFull);
  if (!m) return null;
  const day = Number(m[1]);
  const monthWord = m[2].toLowerCase();
  const month = MONTHS_UA[monthWord];
  const year = m[3] ? Number(m[3]) : undefined;

  return { day, month, year };
}

export type GroupEntry = { id: string; ranges: string[] };

export type DateBlock = {
  date: string; // ISO date string if year can be inferred, else 'DD.MM'
  updatedAt?: string | null; // HH:MM or ISO if full timestamp available
  rawText: string;
  groups: Record<string, string[]>;
};

export function parseArticle(html: string): DateBlock[] {
  const $ = cheerio.load(html);
  const article = $("#post-371392");

  if (!article.length) {
    // fallback: try first article
    const firstArticle = $("article").first();

    if (!firstArticle.length) return [];
  }

  const pNodes = (article.length ? article : $("article")).find("p").toArray();

  const blocks: DateBlock[] = [];

  let current: DateBlock | null = null;

  for (const p of pNodes) {
    const raw = $(p).html() || $(p).text();
    const text = normalizeSpaces($(p).text() || "");

    if (!text) continue;

    // 1) check for explicit date heading like "2 ГРУДНЯ" or "03 ГРУДНЯ 2025" or "ГРАФІК НА 25 ЛИСТОПАДА 2025"
    const dateDirect = text.match(
      /(графік\s*(на)?\s*)?(\d{1,2})\s+(січня|лютого|березня|квітня|травня|червня|липня|серпня|вересня|жовтня|листопада|грудня)\s*(\d{4})?/i
    );

    if (dateDirect) {
      const day = Number(dateDirect[3]);
      const monthWord = dateDirect[4].toLowerCase();
      const month = MONTHS_UA[monthWord];
      const year = dateDirect[5] ? Number(dateDirect[5]) : undefined;

      // build ISO if possible (if year not provided, try infer current year; if month already passed, might be next year — heuristic omitted for simplicity)
      const now = new Date();
      const useYear = year ?? now.getFullYear();
      const iso = new Date(useYear, month, day).toISOString().slice(0, 10);

      current = { date: iso, updatedAt: null, rawText: text, groups: {} };
      blocks.push(current);

      continue;
    }

    // 2) check for "ОНОВЛЕНО" lines that include a date/time or specify "ОНОВЛЕНО ГПВ НА 02 ГРУДНЯ (оновлено о 23:20)"
    const updMatch = text.match(
      /оновлено[^\d]*(\d{1,2})\s+(січня|лютого|березня|квітня|травня|червня|липня|серпня|вересня|жовтня|листопада|грудня)\s*(?:\((оновлено\s*о\s*([0-2]?\d:[0-5]\d))\))?/i
    );

    if (updMatch) {
      // sometimes "ОНОВЛЕНО ГПВ НА 02 ГРУДНЯ (оновлено о 23:20)"
      const day = Number(updMatch[1]);
      const monthWord = updMatch[2].toLowerCase();
      const month = MONTHS_UA[monthWord];
      const time = updMatch[4] ?? null;
      const now = new Date();
      const iso = new Date(now.getFullYear(), month, day)
        .toISOString()
        .slice(0, 10);

      // create new block for this date if not exists
      current = { date: iso, updatedAt: time, rawText: text, groups: {} };
      blocks.push(current);
      continue;
    }

    // 3) if we're inside a current block, append raw text
    if (current) {
      current.rawText += "\n" + text;

      // check for group lines like "1.1: 05:30 – 08:00, 15:00 – 20:00" or "1.1: 05:30 – 08:00"
      // Accept different dash chars and separators
      const groupLineRegex = /(^|\n)\s*([1-6]\.[12])\s*[:\-]\s*([^\n]+)/gi;
      let m: RegExpExecArray | null;

      while ((m = groupLineRegex.exec(current.rawText)) !== null) {
        const gid = m[2];
        const timesRaw = m[3];
        // split by comma or semicolon
        const ranges = timesRaw
          .split(/[;,]/)
          .map((s) => s.trim().replace(/–|—/g, "-"));
        current.groups[gid] = ranges;
      }

      // also handle patterns inside the same paragraph separated by <br> or \n
      const inlineGroupRegex =
        /([1-6]\.[12])\s*:\s*([0-2]?\d[:.] [0-5]\d\s*[–-]\s*[0-2]?\d[:.] [0-5]\d(?:\s*,\s*[0-2]?\d[:.] [0-5]\d\s*[–-]\s*[0-2]?\d[:.] [0-5]\d)*)/gi;
      while ((m = inlineGroupRegex.exec(text)) !== null) {
        const gid = m[1];
        const ranges = m[2]
          .split(",")
          .map((r) => r.trim().replace(/–|—/g, "-"));

        current.groups[gid] = ranges;
      }
    }
  }

  return blocks;
}
