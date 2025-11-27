import { QueueInfo, ScheduleRawData, Stats } from "@/types";
import { GROUP_NAMES } from "@/utils/groupNames";
import { analyzeQueue } from "@/utils/schedule-api";
import { create } from "zustand";

interface QueueStore {
  loading: boolean;
  error: string | null;
  stats: Stats | null;

  selectedQueue: string;
  data: ScheduleRawData | null;

  analyzedData: QueueInfo | null;
  setAnalyzedData: (data: ScheduleRawData) => void;

  fetchData: () => Promise<void>;
  setSelectedQueue: (queue: string) => void;

  // setStats: (stats: Stats) => void;
}

// const stats = {

// }

export const useQueueStore = create<QueueStore>()((set, get) => ({
  selectedQueue: "1.1",
  data: null,
  loading: false,
  error: null,
  analyzedData: null,
  stats: null,

  setSelectedQueue: (queue: string) => set({ selectedQueue: queue }),

  setAnalyzedData: (data: ScheduleRawData) => {
    if (!data || Object.keys(data).length === 0) return {};

    const analyzed = GROUP_NAMES.reduce((acc, group) => {
      acc[group] = analyzeQueue(data, group);

      return acc;
    }, {} as Record<string, QueueInfo>);

    set({
      stats: {
        totalQueues: Object.keys(analyzed).length,
        activeQueues: Object.values(analyzed).filter((q) => !q.isOffNow).length,
        inactiveQueues: Object.values(analyzed).filter((q) => q.isOffNow)
          .length,
        totalOutages: Object.values(analyzed).reduce(
          (sum: number, q) => sum + q.outagesCount,
          0
        ),
      },
    });
    set({ analyzedData: analyzed });
  },

  fetchData: async () => {
    const { setAnalyzedData } = get();

    set({ loading: true, error: null });

    try {
      const res = await fetch("/api/schedule", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load data");

      const data = await res.json();

      setAnalyzedData(data.schedule);
      set({ data: data.schedule, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },
}));
