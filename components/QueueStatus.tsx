import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Power, AlertTriangle, Clock } from "lucide-react";

export interface QueueInfo {
  isOffNow: boolean;
  outagesCount: number;
  hoursOff: number;
  hoursOn: number;
  nextEvent: { inMinutes: number; type: string } | null;
}

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

  return (
    <Card
      className={cn(
        "bg-card text-card-foreground border-border transition-all",
        className
      )}
    >
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Queue Name and Status */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold ">Черга {queue}</h3>
            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                info.isOffNow
                  ? "bg-red-500 text-red-950"
                  : "bg-green-500 text-green-300"
              }`}
            >
              <Power className="size-4" />

              <span className="">
                {info.isOffNow ? "Вимкнено" : "Увімкнено"}
              </span>
            </div>
          </div>

          {/* Hours Info */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-blue-500/10 p-2 rounded">
              <p className="text-slate-400 text-xs">Годин увімкнено</p>
              <p className="text-blue-300 font-semibold">{info.hoursOn}h</p>
            </div>

            <div className="bg-red-500/10 p-2 rounded">
              <p className="text-slate-400 text-xs">Годин вимкнено</p>
              <p className="text-red-300 font-semibold">{info.hoursOff}h</p>
            </div>
          </div>

          {/* Outages */}
          <div className="flex items-center gap-2 bg-yellow-900 p-2 rounded text-sm">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />

            <div>
              <p className="text-slate-400 text-sm">Кількість відключень</p>
              <p className="text-yellow-300 font-semibold">
                {info.outagesCount}
              </p>
            </div>
          </div>

          {/* Next Event */}
          {info.nextEvent && (
            <div className="flex items-center gap-2 bg-slate-700 p-2 rounded text-sm">
              <Clock className="w-4 h-4 text-slate-300" />

              <div>
                <p className="text-slate-400 text-sm flex gap-1.5">
                  Наступне:
                  <span className="font-bold">
                    {statusMap[info.nextEvent.type as keyof typeof statusMap]}
                  </span>
                </p>
                <p className="text-slate-200 font-semibold">
                  {info.nextEvent.inMinutes}m
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
