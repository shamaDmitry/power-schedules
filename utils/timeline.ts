export const timeLabels = [
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

export const generateHourlyScheduleFromRanges = (
  ranges: string[]
): number[] => {
  const schedule = Array(24).fill(1); // 1 = online (default)

  ranges.forEach((range) => {
    const [start, end] = range.split("–");
    const [startHour, startMin] = start.split(":").map(Number);
    const [endHour, endMin] = end.split(":").map(Number);

    // Mark hours as offline (0)
    for (let h = startHour; h < endHour; h++) {
      schedule[h] = 0;
    }
    // If end time has minutes, mark the end hour as offline too
    if (endMin > 0 && endHour < 24) {
      schedule[endHour] = 0;
    }
  });

  return schedule;
};
