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
  [key in GroupKey]: QueueInfo;
};

export interface QueueInfo {
  isOffNow: boolean;
  outagesCount: number;
  hoursOff: number;
  hoursOn: number;
  nextEvent: { inMinutes: number; type: string } | null;
}

export interface QueueStates {
  [key: string]: { isOn: boolean; isSelected: boolean; queue: string };
}

export interface Stats {
  totalQueues: number;
  activeQueues: number;
  inactiveQueues: number;
  totalOutages: number;
}

export type EventType = "on" | "off";

export interface NextEvent {
  inMinutes: number;
  type: EventType;
}

export interface OutageGroup {
  isOffNow: boolean;
  outagesCount: number;
  hoursOff: number;
  hoursOn: number;
  nextEvent: NextEvent | null;
}

export type OutageSchedule = Record<string, OutageGroup>;

export interface Schedule {
  [key: string]: OutageGroup;
}
