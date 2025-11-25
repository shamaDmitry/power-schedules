import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { Agent } from "undici";
import { GROUP_NAMES } from "@/utils/groupNames";
import dayjs from "@/lib/dayjs";
import { extractBlockByDate } from "@/utils/extractBlockByDate";

function getUAMonthName(monthNumber: number) {
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

  return months[monthNumber - 1];
}

function extractBlock(html: string, day: number, month: number) {
  const monthName = getUAMonthName(month);

  // Регулярка для конкретного заголовка (який шукаємо)
  const titleRegex = new RegExp(
    `${day}\\s+${monthName}\\s+ПО\\s+ЗАПОРІЗЬКІЙ\\s+ОБЛАСТІ`,
    "i"
  );

  // Регулярка для будь-якого заголовка
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
    `\\d{1,2}\\s+(${monthNames})\\s+ПО\\s+ЗАПОРІЗЬКІЙ\\s+ОБЛАСТІ`,
    "gi"
  );

  // ============================
  //  Знаходимо позицію нашого заголовка
  // ============================
  const match = html.match(titleRegex);
  if (!match) return null;

  const startIndex = html.indexOf(match[0]);

  // ============================
  //  Знаходимо всі заголовки, щоб визначити кінець
  // ============================
  const allTitles = [...html.matchAll(anyTitleRegex)];
  let endIndex = html.length;

  for (const t of allTitles) {
    const pos = t.index!;
    if (pos > startIndex) {
      endIndex = pos;
      break;
    }
  }

  // Вирізаємо
  return html.slice(startIndex, endIndex).trim();
}

// function extractBlockByDate(html: string, date: string) {
//   const $ = cheerio.load(html);

//   const paragraphs = $("p").toArray();

//   const titleRegex = new RegExp(
//     `${date}\\s+ЛИСТОПАДА\\s+ПО\\s+ЗАПОРІЗЬКІЙ\\s+ОБЛАСТІ`,
//     "i"
//   );
//   const anyTitleRegex = /\d{1,2}\s+ЛИСТОПАДА\s+ПО\s+ЗАПОРІЗЬКІЙ\s+ОБЛАСТІ/i;

//   let startIndex = -1;
//   let endIndex = -1;

//   const titleIndexes: number[] = [];

//   paragraphs.forEach((el, i) => {
//     const text = $(el).text().trim();

//     if (anyTitleRegex.test(text)) {
//       titleIndexes.push(i);
//     }
//   });

//   for (let i = 0; i < titleIndexes.length; i++) {
//     const idx = titleIndexes[i];
//     const text = $(paragraphs[idx]).text();

//     if (titleRegex.test(text)) {
//       startIndex = idx;
//       endIndex = titleIndexes[i + 1] ?? paragraphs.length;
//       break;
//     }
//   }

//   if (startIndex === -1) return [];

//   const block = paragraphs
//     .slice(startIndex, endIndex)
//     .map((el) => $(el).text().trim());

//   const cleaned = block.filter(Boolean);

//   const lineRegex = /^[1-6]\.[1-2]:\s*.+/;
//   const scheduleLines = cleaned.filter((line) => lineRegex.test(line));

//   return scheduleLines;
// }

export async function GET() {
  const url = "https://www.zoe.com.ua/графіки-погодинних-стабілізаційних/";
  const dispatcher = new Agent({
    connect: {
      rejectUnauthorized: false, // << disable SSL validation
    },
  });

  try {
    const res = await fetch(url, {
      dispatcher,
    } as unknown as RequestInit);

    const html = await res.text();
    const $ = cheerio.load(html);

    const title = $("title").text();
    const headings = $("h1")
      .map((_, el) => {
        return $(el).text();
      })
      .get();

    const article = $("article")
      .find("p")
      .map((_, el) => {
        if ($(el).text().includes(GROUP_NAMES[0])) {
          return $(el).text();
        }
      })
      .get();

    const data = $.extract({
      headlines: [
        {
          selector: "p",

          value: (el, key) => {
            const style = $(el).attr("style");

            return `${key}=${style === "text-align: center;"}`;
          },

          // value: (el, key) => {
          //   if ($(el).text().includes(GROUP_NAMES[0])) {
          //     const content = $(el).text();

          //     return `${key}=${content}`;
          //   }
          // },

          // Then, we extract the release date, name, and notes from each section.
          // value: {
          //   // Selectors are executed within the context of the selected element.
          //   name: "h2",
          //   date: {
          //     selector: "relative-time",
          //     // The actual release date is stored in the `datetime` attribute.
          //     value: "datetime",
          //   },
          //   notes: {
          //     selector: ".markdown-body",
          //     // We are looking for the HTML content of the element.
          //     value: "innerHTML",
          //   },
          // },
        },
      ],
    });

    // const schedule = extractBlockByDate(html, "25");

    const block = extractBlock(html, Number(25), Number(11));

    return NextResponse.json({
      // title,
      // headings,
      // article,
      // data,
      // todayDate: dayjs().format("MMMM"),
      // schedule,
      block: extractBlockByDate(html, 25, 11),
    });
  } catch (error) {
    console.log("error", error);

    return NextResponse.json(
      { error: "Error fetching data", details: error },
      { status: 500 }
    );
  }
}
