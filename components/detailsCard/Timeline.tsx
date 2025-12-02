import { QueueInfo } from "@/types";
import { generateHourlyScheduleFromRanges, timeLabels } from "@/utils/timeline";
import { FC } from "react";

interface TimelineProps {
  info: QueueInfo;
}

const Timeline: FC<TimelineProps> = ({ info }) => {
  const hourlySchedule = generateHourlyScheduleFromRanges(info.ranges);

  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  const currentHourProgress = currentHour + currentMinute / 60; // 0-24 range

  return (
    <div className="bg-secondary/5 border border-border rounded-xl p-6">
      <h4 className="text-sm font-semibold text-foreground mb-4">
        Цілодобовий графік живлення
      </h4>

      <div className="mb-6 p-4 bg-card/50 rounded-lg border border-border/50">
        <p className="text-xs font-semibold text-muted-foreground mb-3">
          Періоди без електроенергії:
        </p>

        <div className="flex flex-wrap gap-2">
          {info.ranges.length > 0 ? (
            info.ranges.map((range, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-chart-4/20 text-chart-4 rounded-full text-sm font-medium border border-chart-4/30"
              >
                {range}
              </span>
            ))
          ) : (
            <span className="text-chart-2 font-medium">
              No scheduled outages
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex gap-0.5 h-12 relative group">
          {hourlySchedule.map((isOn, hour) => (
            <div
              key={hour}
              className="flex-1 rounded-sm transition-all hover:opacity-80 cursor-pointer relative group/hour"
              style={{
                backgroundColor: isOn ? "var(--success)" : "var(--error)",
              }}
              title={`${timeLabels[hour]} - ${isOn ? "ON" : "OFF"}`}
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs font-semibold text-foreground opacity-0 group-hover/hour:opacity-100 transition-opacity whitespace-nowrap bg-card border border-border px-2 py-1 rounded shadow-md z-20">
                {timeLabels[hour]}
                <br />
                {isOn ? "ВКЛ" : "ВИКЛ"}
              </div>
            </div>
          ))}

          <div
            className="absolute top-0 bottom-0 w-0.5 bg-primary shadow-lg rounded-full"
            style={{
              left: `${(currentHourProgress / 24) * 100}%`,
              height: "calc(100% + 16px)",
              top: "-8px",
              zIndex: 10,
            }}
            title={`Current time: ${String(currentHour).padStart(
              2,
              "0"
            )}:${String(currentMinute).padStart(2, "0")}`}
          >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full border-2 border-background shadow-md" />
          </div>
        </div>

        {/* Time Labels Row */}
        <div className="flex justify-between text-xs text-muted-foreground mt-8 px-1">
          <span>00:00</span>
          <span>04:00</span>
          <span>08:00</span>
          <span>12:00</span>
          <span>16:00</span>
          <span>20:00</span>
          <span>23:00</span>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
