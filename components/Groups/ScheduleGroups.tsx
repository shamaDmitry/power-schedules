"use client";

import useSWR from "swr";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useQueueStore } from "@/store/useQueueStore";
import { DaySchedule } from "@/lib/schedule-parser";
import QueueStatus from "@/components/QueueStatus";
import { QueueInfo, QueueStates } from "@/types";
import { Heading } from "@/components/typography/Heading";
import { toast } from "sonner";
import QueueSelector from "@/components/QueueSelector";
import { Calendar } from "@/components/ui/calendar";
import QueueDetailCard from "../QueueDetailCard";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ScheduleGroups() {
  const latestHashRef = useRef<string | null>(null);
  const { setAnalyzedData, analyzedData, selectedQueue, setSelectedQueue } =
    useQueueStore();

  // const [date, setDate] = useState("2024-12-05");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));

  const { data, error, isLoading, mutate } = useSWR<{
    lastUpdated: string;
    pageHash: string;
    schedule: DaySchedule[];
  }>("/api/parse", fetcher, {
    // refreshInterval: 60000,
    // revalidateOnFocus: false,
    // revalidateIfStale: false,
    // revalidateOnMount: false,
    onSuccess: (newData) => {
      const currentHash = newData?.pageHash;
      const prevHash = latestHashRef.current;

      if (currentHash && prevHash && currentHash !== prevHash) {
        toast.info("Графік оновлено! ZOE опублікували нові дані.");
      }

      if (currentHash) {
        latestHashRef.current = currentHash;
      }
    },
  });

  useEffect(() => {
    if (data) {
      const currentSchedule = data.schedule.filter((item) => {
        return item.date === date;
      });

      const [entries] = currentSchedule;

      setAnalyzedData(entries.entries);
    }
  }, [data, date, setAnalyzedData]);

  if (!data) return null;

  const queueStates = Object.entries(
    (analyzedData ?? {}) as Record<string, QueueInfo>
  ).reduce((acc, [queue, info]) => {
    acc[queue] = {
      isOn: !info.isOffNow,
      isSelected: selectedQueue === queue,
      queue: queue,
    };

    return acc;
  }, {} as QueueStates);

  return (
    <div className="flex flex-col font-sans min-h-screen p-4 max-w-7xl mx-auto">
      <div className="flex gap-5">
        <Button
          onClick={() => {
            mutate();
          }}
          disabled={isLoading}
          className="mb-5"
        >
          {isLoading ? "Parsing..." : "Parse Data"}
        </Button>
      </div>

      <h1 className="text-2xl font-bold">Графік відключень</h1>

      <Calendar
        mode="single"
        // selected={date}
        // onSelect={setDate}
        className="rounded-lg border"
      />

      <div className="mt-4">
        <QueueSelector
          selectedQueue={selectedQueue}
          onQueueChange={setSelectedQueue}
          queueStates={queueStates}
        />
      </div>

      {/* {analyzedData && (
        <QueueDetailCard
          queue={selectedQueue}
          info={analyzedData[selectedQueue]}
        />
      )} */}

      <div className="text- opacity-60 mt-6">Оновлено: {data.lastUpdated}</div>

      <div className="mb-8">
        <Heading level={"h3"} className="text-2xl font-bold  mb-4">
          Деталі черг
        </Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.entries(analyzedData ?? {}).map(([queue, info]) => {
            return <QueueStatus key={queue} queue={queue} info={info} />;
          })}
        </div>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.entries(analyzed ?? {}).map(([queue, info]) => {
          return (
            <QueueStatus key={queue} queue={queue} info={info as QueueInfo} />
          );
        })}
      </div> */}

      {/* <pre>{JSON.stringify(analyzed, null, 2)}</pre> */}
    </div>
  );
}
