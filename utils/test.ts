// УТИЛІТИ
function toMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function parseRange(range: string) {
  const [start, end] = range.split("–").map((t) => t.trim());
  return [toMinutes(start), toMinutes(end)];
}

function getTodayMinutes() {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

// ГОЛОВНА ФУНКЦІЯ
export function analyzeQueue(
  schedule: Record<string, string[]>,
  queue: string
) {
  const ranges = schedule[queue] || [];
  const minuteRanges = ranges.map(parseRange);

  const now = getTodayMinutes();

  // 1) ЧИ Є СВІТЛО ЗАРАЗ?
  let isOffNow = false;
  for (const [start, end] of minuteRanges) {
    if (now >= start && now < end) {
      isOffNow = true;
      break;
    }
  }

  // 2) КІЛЬКІСТЬ ВИМКНЕНЬ НА ДЕНЬ
  const outagesCount = ranges.length;

  // 3) СКІЛЬКИ ГОДИН Є/НЕМАЄ СВІТЛА
  const totalOffMinutes = minuteRanges.reduce(
    (sum, [s, e]) => sum + (e - s),
    0
  );
  const totalOnMinutes = 24 * 60 - totalOffMinutes;

  // 4) ЧАС ДО НАСТУПНОГО ВИМКНЕННЯ/ВКЛЮЧЕННЯ
  let timeToNextEvent = null;
  let nextEventType: "off" | "on" | null = null;

  // якщо світло є → шукаємо коли вимкнеться
  if (!isOffNow) {
    for (const [start] of minuteRanges) {
      if (start > now) {
        timeToNextEvent = start - now;
        nextEventType = "off";
        break;
      }
    }
  } else {
    // якщо зараз виключено → шукаємо коли включиться
    for (const [start, end] of minuteRanges) {
      if (now >= start && now < end) {
        timeToNextEvent = end - now;
        nextEventType = "on";
        break;
      }
    }
  }

  return {
    isOffNow,
    outagesCount,
    hoursOff: +(totalOffMinutes / 60).toFixed(2),
    hoursOn: +(totalOnMinutes / 60).toFixed(2),
    nextEvent:
      timeToNextEvent !== null
        ? {
            inMinutes: timeToNextEvent,
            type: nextEventType,
          }
        : null,
  };
}
