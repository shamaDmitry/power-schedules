export type TimeRange = {
  start: string;
  end: string;
};

export type GroupSchedule = {
  group: string;
  ranges: TimeRange[];
};

export type GpvSchedule = {
  title: string;
  items: GroupSchedule[];
};

export type RawGpvRow = [string];
export type RawGpvData = RawGpvRow[];

export type TimeRangeString = `${string} - ${string}`;
export type GroupKey = `${number}.${number}`;
export type ScheduleRawData = {
  title: string;
} & {
  [key in GroupKey]: TimeRangeString[];
};

export type AnalyzedData = {
  [key in GroupKey]: TimeRangeString[];
};
