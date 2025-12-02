"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useQueueStore } from "@/store/useQueueStore";
import { QueueInfo } from "@/types";
import { formatMinutes } from "@/utils/formatMinutes";
import { Power, AlertTriangle, Clock } from "lucide-react";

export default function QueueStatus({
  queue,
  info,
  className,
}: {
  queue: string;
  info: QueueInfo;
  className?: string;
}) {
  const statusMap = {
    on: "Увімкнення",
    off: "Вимкнення",
  };

  const { selectedQueue, setSelectedQueue } = useQueueStore();

  return (
    <Card
      className={cn(
        "bg-card text-card-foreground border-border transition-all cursor-pointer",
        {
          "bg-primary/10 outline-2 outline-primary": selectedQueue === queue,
        },

        className
      )}
      onClick={() => setSelectedQueue(queue)}
    >
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold ">Черга {queue}</h3>

            <div
              className={cn(
                "flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold",
                {
                  "bg-error/10 text-error": info.isOffNow,
                  "bg-success/10 text-success": !info.isOffNow,
                }
              )}
            >
              <Power className="size-4" />

              <span className="">
                {info.isOffNow ? "Вимкнено" : "Увімкнено"}
              </span>
            </div>
          </div>

          {/* Hours Info */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-success/10 p-2 rounded">
              <p className="text-xs mb-1 text-muted-foreground">
                Годин увімкнено
              </p>
              <p className="text-success font-semibold">{info.hoursOn}h</p>
            </div>

            <div className="bg-error/10 p-2 rounded">
              <p className="text-xs mb-1 text-muted-foreground">
                Годин вимкнено
              </p>
              <p className="text-error font-semibold">{info.hoursOff}h</p>
            </div>
          </div>

          {/* Outages */}
          <div className="flex items-center gap-2 bg-accent text-accent-foreground p-2 rounded text-sm">
            <AlertTriangle className="w-4 h-4 text-accent-foreground" />

            <div>
              <p className="text-sm">Кількість відключень</p>
              <p className="font-semibold">{info.outagesCount}</p>
            </div>
          </div>

          {/* Next Event */}
          {info.nextEvent && (
            <div className="flex items-center gap-2 bg-primary p-2 rounded text-sm">
              <Clock className="w-4 h-4 text-primary-foreground" />

              <div className="text-primary-foreground">
                <p className="text-sm flex gap-1.5">
                  Наступне:
                  <span className="font-bold">
                    {statusMap[info.nextEvent.type as keyof typeof statusMap]}
                  </span>
                </p>

                <p className="font-semibold">
                  {formatMinutes(info.nextEvent.inMinutes)}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
