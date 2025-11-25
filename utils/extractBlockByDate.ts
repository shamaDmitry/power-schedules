import * as cheerio from "cheerio";

function getUAMonthName(month: number) {
  const months = [
    "СІЧНЯ",
    "ЛЮТОГО",
    "БЕРЕЗНЯ",
    "КВІТНЯ",
    "ТРАВНЯ",
    "ЧЕРВНЯ",
    "ЛИПНЯ",
    "СЕРПНЯ",
    "ВЕРЕСНЯ",
    "ЖОВТНЯ",
    "ЛИСТОПАДА",
    "ГРУДНЯ",
  ];
  return months[month - 1];
}

function extractBlockByDate(html: string, day: number, month: number) {
  const monthName = getUAMonthName(month);

  // === 1. Знаходимо початковий заголовок ===
  const titleRegex = new RegExp(
    `${day}\\s+${monthName}[^<]*ПО\\s+ЗАПОРІЗЬКІЙ\\s+ОБЛАСТІ`,
    "i"
  );

  const monthNames = [
    "СІЧНЯ",
    "ЛЮТОГО",
    "БЕРЕЗНЯ",
    "КВІТНЯ",
    "ТРАВНЯ",
    "ЧЕРВНЯ",
    "ЛИПНЯ",
    "СЕРПНЯ",
    "ВЕРЕСНЯ",
    "ЖОВТНЯ",
    "ЛИСТОПАДА",
    "ГРУДНЯ",
  ].join("|");

  const anyTitleRegex = new RegExp(
    `\\d{1,2}\\s+(${monthNames})[^<]*ПО\\s+ЗАПОРІЗЬКІЙ\\s+ОБЛАСТІ`,
    "gi"
  );

  const match = html.match(titleRegex);
  if (!match) return null;

  const startIndex = html.indexOf(match[0]);

  // === 2. Знаходимо наступний заголовок ===
  const allTitles = [...html.matchAll(anyTitleRegex)];

  let endIndex = html.length;

  for (const t of allTitles) {
    const pos = t.index!;
    if (pos > startIndex) {
      endIndex = pos;
      break;
    }
  }

  const blockHtml = html.slice(startIndex, endIndex);

  // === 3. Парсимо HTML блок і витягуємо дані ===
  const $ = cheerio.load(blockHtml);

  const result: Record<string, string[]> = {};

  $("p").each((_, el) => {
    const text = $(el).text().trim();

    // Формат типу "1.1:" або "3.2:"
    const groupMatch = text.match(/^(\d\.\d)\s*[:.-]/i);
    if (groupMatch) {
      const group = groupMatch[1];
      const intervals = text.replace(groupMatch[0], "").trim();

      if (!result[group]) result[group] = [];

      // розбиваємо: "00:00 – 05:00, 08:00 – 13:00"
      const parts = intervals.split(/[,;]/).map((s) => s.trim());
      result[group].push(...parts);
    }
  });

  // === 4. Формуємо текст у потрібному форматі ===
  const finalLines: string[] = [];

  Object.keys(result).forEach((g) => {
    finalLines.push(`${g}: ${result[g].join(", ")}`);
  });

  return finalLines.join("\n");
}

export { extractBlockByDate };
