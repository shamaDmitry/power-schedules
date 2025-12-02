"use client";

import { useEffect } from "react";
import QueueStatus from "@/components/QueueStatus";
import { QueueInfo, QueueStates } from "@/types";
import { useQueueStore } from "@/store/useQueueStore";
import QueueSelector from "@/components/QueueSelector";
import { Heading } from "@/components/typography/Heading";
import QueueDetailCard from "@/components/QueueDetailCard";

export default function Schedule() {
  const {
    data,
    fetchData,
    selectedQueue,
    setSelectedQueue,
    analyzedData,
    loading,
  } = useQueueStore();

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 1800000); // 30min

    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) return <div>Loading...</div>;

  if (!data) return <div>No data</div>;

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
    <div className="w-full">
      <div className="flex gap-4 items-center mb-5 justify-between flex-wrap">
        <Heading level="h2">{data.title}</Heading>
      </div>

      <QueueSelector
        selectedQueue={selectedQueue}
        onQueueChange={setSelectedQueue}
        queueStates={queueStates}
      />

      {analyzedData && (
        <QueueDetailCard
          queue={selectedQueue}
          info={(analyzedData as Record<string, QueueInfo>)[selectedQueue]}
        />
      )}

      <div className="mb-8">
        <Heading level={"h3"} className="text-2xl font-bold  mb-4">
          Деталі черг
        </Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.entries(analyzedData ?? {}).map(([queue, info]) => {
            return (
              <QueueStatus key={queue} queue={queue} info={info as QueueInfo} />
            );
          })}
        </div>
      </div>
    </div>
  );
}
