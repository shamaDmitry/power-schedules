"use client";

import { Button } from "@/components/ui/button";
import { GROUP_NAMES } from "@/utils/groupNames";
import { Heading } from "./typography/Heading";
import { QueueStates } from "@/types";
import { cn } from "@/lib/utils";

interface QueueSelectorProps {
  selectedQueue: string;
  onQueueChange: (queue: string) => void;
  queueStates?: QueueStates;
}

export default function QueueSelector({
  selectedQueue,
  onQueueChange,
  queueStates,
}: QueueSelectorProps) {
  return (
    <div className="mb-6 space-y-3">
      <h3 className="text-sm  text-muted-foreground"></h3>
      <Heading level="h3">Оберіть чергу</Heading>

      <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-12 gap-2">
        {GROUP_NAMES.map((queue) => {
          const state = queueStates?.[queue];
          const isSelected = selectedQueue === queue;
          const isOn = state?.isOn ?? true;

          return (
            <Button
              key={queue}
              onClick={() => onQueueChange(queue)}
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "h-10 text-sm font-semibold transition-all relative group shadow-md dark:hover:text-primary ",
                {
                  "bg-primary text-primary-foreground ring-2 ring-primary/50":
                    isSelected,
                  "hover:bg-secondary/20": !isSelected && isOn,
                  "hover:bg-destructive/20": !isSelected && !isOn,
                }
              )}
              title={`Черга ${queue} - ${isOn ? "Включена" : "Відключена"}`}
            >
              {queue}

              <div
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{
                  backgroundColor: isOn ? "var(--success)" : "var(--error)",
                }}
              />
            </Button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: "var(--success)" }}
          />
          <span>Є світло</span>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: "var(--error)" }}
          />
          <span>Немає світла</span>
        </div>
      </div>
    </div>
  );
}
