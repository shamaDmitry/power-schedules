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
  ranges: string[];
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
  ranges: string[];
}

export type ScheduleNumbers =
  | "1.1"
  | "1.2"
  | "2.1"
  | "2.2"
  | "3.1"
  | "3.2"
  | "4.1"
  | "4.2"
  | "5.1"
  | "5.2"
  | "6.1"
  | "6.2";

export interface ISchedule {
  [key: string]: OutageGroup;
}

type ParsedItem = [string];

export type ParsedItems = ParsedItem[];

export interface OutageSchedule {
  title: string;
  "1.1": string[];
  "1.2": string[];
  "2.1": string[];
  "2.2": string[];
  "3.1": string[];
  "3.2": string[];
  "4.1": string[];
  "4.2": string[];
  "5.1": string[];
  "5.2": string[];
  "6.1": string[];
  "6.2": string[];
}
