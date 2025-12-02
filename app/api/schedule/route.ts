import { NextResponse } from "next/server";
import { parse } from "csv-parse";
import { Readable } from "stream";
import { OutageSchedule, ParsedItems } from "@/types";

function transform(data: ParsedItems): OutageSchedule {
  const result: Partial<OutageSchedule> = {};
  const records = data;

  // First item → title
  result.title = records[0][0];

  // The rest → groups
  for (let i = 1; i < records.length; i++) {
    const row = records[i][0];
    const [group, timesStr] = row.split(": ");
    // Check if timesStr exists to prevent crashes on bad data
    if (timesStr) {
      const times = timesStr.split(", ").map((t) => t.trim());

      (result[group as keyof OutageSchedule] as string[]) = times;
    }
  }

  return result as OutageSchedule;
}

export async function GET() {
  const GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/1VopkZBS0_eLJQmg6MizJnJ0vDkosgPA137Z3WtdPeAI/export?format=csv&gid=0&t=${new Date().getTime()}`;

  try {
    const response = await fetch(GOOGLE_SHEET_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();

    const readableStream = Readable.from(csvText);

    const records: ParsedItems = [];

    const parser = readableStream.pipe(
      parse({
        delimiter: ",",
        skip_empty_lines: true,
      })
    );

    for await (const record of parser) {
      records.push(record);
    }

    if (records.length > 0) {
      const schedule = transform(records);

      return NextResponse.json({
        schedule,
      });
    }
  } catch (error) {
    console.error("Error loading schedule: " + error);

    return NextResponse.json({ error: `${error} ` }, { status: 500 });
  }
}
