import * as cheerio from "cheerio";

export interface DaySchedule {
  id: string;
  date: string; // ISO Format YYYY-MM-DD
  rawDate: string;
  updateTime: string | null;
  title: string;
  entries: Record<string, string[]>;
}

const MONTH_MAP: Record<string, string> = {
  СІЧНЯ: "01",
  ЛЮТОГО: "02",
  БЕРЕЗНЯ: "03",
  КВІТНЯ: "04",
  ТРАВНЯ: "05",
  ЧЕРВНЯ: "06",
  ЛИПНЯ: "07",
  СЕРПНЯ: "08",
  ВЕРЕСНЯ: "09",
  ЖОВТНЯ: "10",
  ЛИСТОПАДА: "11",
  ГРУДНЯ: "12",
};

export function parseZoeSchedule(htmlContent: string): DaySchedule[] {
  const $ = cheerio.load(htmlContent);
  const results: DaySchedule[] = [];

  let currentSchedule: DaySchedule | null = null;

  // 1. GLOBAL YEAR DETECTION (Sticky Year)
  const fullText = $.root().text();
  const globalYearMatch = fullText.match(/(202[4-9])/);
  const currentYear = globalYearMatch
    ? globalYearMatch[1]
    : new Date().getFullYear().toString();

  // 2. EXPANDED SELECTOR
  const elements = $('p, h1, h2, h3, h4, div[dir="auto"], li');

  elements.each((_, element) => {
    const $el = $(element);

    if ($el.children("p, div, h1, h2, h3").length > 0) return;

    const text = $el
      .text()
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!text || text.length < 5) return;

    // --- DETECT HEADER ---
    const dateMatch = text.match(
      /(\d{1,2})\s+(СІЧНЯ|ЛЮТОГО|БЕРЕЗНЯ|КВІТНЯ|ТРАВНЯ|ЧЕРВНЯ|ЛИПНЯ|СЕРПНЯ|ВЕРЕСНЯ|ЖОВТНЯ|ЛИСТОПАДА|ГРУДНЯ)/i
    );

    const isHeaderTag = ["h1", "h2", "h3", "h4"].includes(
      element.tagName.toLowerCase()
    );

    const hasKeywords =
      text.toUpperCase().includes("ОНОВЛЕНО") ||
      text.toUpperCase().includes("ГПВ") ||
      text.toUpperCase().includes("ВІДКЛЮЧЕННЯ") ||
      text.toUpperCase().includes("ДІЯТИМУТЬ");

    const isBold =
      $el.find("strong, b").length > 0 || $el.css("font-weight") === "bold";

    if (dateMatch && (isHeaderTag || hasKeywords || isBold)) {
      const timeMatch = text.match(
        /(?:оновлено|о)\s*(?:о|об)?\s*(\d{1,2}[:;.-]\d{2})/i
      );

      const dayStr = dateMatch[1].padStart(2, "0");
      const monthKey = dateMatch[2].toUpperCase();
      const monthStr = MONTH_MAP[monthKey] || "01";

      const localYearMatch = text.match(/(202\d)/);
      const entryYear = localYearMatch ? localYearMatch[1] : currentYear;

      const isoDate = `${entryYear}-${monthStr}-${dayStr}`;

      if (
        currentSchedule &&
        currentSchedule.date === isoDate &&
        currentSchedule.updateTime ===
          (timeMatch ? timeMatch[1].replace(/[;.]/, ":") : null)
      ) {
        return;
      }

      if (currentSchedule) {
        results.push(currentSchedule);
      }

      // Initialize entries as an empty object ({})
      currentSchedule = {
        id: `${isoDate}-${Math.random().toString(36).substr(2, 6)}`,
        date: isoDate,
        rawDate: `${dayStr} ${monthKey}`,
        updateTime: timeMatch ? timeMatch[1].replace(/[;.]/, ":") : null,
        title: text,
        entries: {},
      };

      return;
    }

    // --- DETECT SCHEDULE ROW ---
    if (currentSchedule) {
      const queueMatch = text.match(/^(\d\.\d(?:,\s*\d\.\d)*)\s*[:;-]\s*(.*)/);

      if (queueMatch) {
        const queues = queueMatch[1].split(",").map((q) => q.trim());
        const hoursRaw = queueMatch[2];

        let hoursList: string[] = [];

        // Handle "No Outage" case
        if (
          hoursRaw.toLowerCase().includes("не вимикається") ||
          hoursRaw.toLowerCase().includes("не вимикаються")
        ) {
          hoursList = ["No Outage"];
        } else {
          // Extract time ranges
          const rangeRegex =
            /(\d{1,2}[:;.]\d{2})\s*[-–—]\s*(\d{1,2}[:;.]\d{2})/g;
          let match;

          while ((match = rangeRegex.exec(hoursRaw)) !== null) {
            const start = match[1].replace(/[;.]/, ":");
            const end = match[2].replace(/[;.]/, ":");

            hoursList.push(`${start} - ${end}`);
          }
        }

        // Populate the map structure
        if (hoursList.length > 0) {
          queues.forEach((q) => {
            // Initialize the queue array if it doesn't exist
            if (!currentSchedule!.entries[q]) {
              currentSchedule!.entries[q] = [];
            }

            // Append the hours to the correct queue array
            currentSchedule!.entries[q].push(...hoursList);
          });
        }
      }
    }
  });

  if (currentSchedule) {
    results.push(currentSchedule);
  }

  // Sort descending by date + time
  return results.sort((a, b) => {
    const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();

    if (dateDiff !== 0) {
      return dateDiff;
    }

    if (a.updateTime && b.updateTime) {
      return b.updateTime.localeCompare(a.updateTime);
    }

    return 0;
  });
}
