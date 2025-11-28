"use client";

import { cn } from "@/lib/utils";
import React, { useState, useEffect, useMemo } from "react";
import { Heading } from "./typography/Heading";

interface CountdownTimerProps {
  className?: string;
  label?: string;
  event: string;
  remainingTime: number;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  showMilliseconds?: boolean;
  onComplete?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  className,
  label = "Лишилося часу",
  event,
  remainingTime,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
  showMilliseconds = false,
  onComplete,
}) => {
  // Calculate total starting time in milliseconds (min * 60 * 1000)
  const totalInitialMilliseconds = remainingTime * 60 * 1000;

  // State to track remaining time in milliseconds
  const [timeLeft, setTimeLeft] = useState(totalInitialMilliseconds);

  // Convert milliseconds to display components
  const ms = timeLeft % 1000;
  const totalSeconds = Math.floor(timeLeft / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Helper to format numbers (add leading zero if < 10)
  // For milliseconds, we pad to three digits
  const formatTime = (value: number, padLength: number = 2) =>
    value.toString().padStart(padLength, "0");

  const timeDisplay = useMemo(() => {
    const timeParts: string[] = [];

    // Always show hours if requested, or if hours > 0
    if (showHours || hours > 0) {
      timeParts.push(formatTime(hours));
    }

    if (showMinutes) {
      timeParts.push(formatTime(minutes));
    }

    if (showSeconds) {
      timeParts.push(formatTime(seconds));
    }

    // Fallback if no units are selected (defaults to MM:SS)
    if (timeParts.length === 0) {
      timeParts.push(formatTime(minutes));
      timeParts.push(formatTime(seconds));
    }

    let displayString = timeParts.join(":");

    // Add milliseconds if requested
    if (showMilliseconds) {
      displayString += `.${formatTime(ms, 3)}`; // Pad milliseconds to 3 digits
    }

    return displayString;
  }, [
    hours,
    minutes,
    seconds,
    ms,
    showHours,
    showMinutes,
    showSeconds,
    showMilliseconds,
  ]);

  useEffect(() => {
    // Stop the interval if time is finished
    if (timeLeft <= 0) {
      if (onComplete) onComplete();
      return;
    }

    // Interval runs every 100ms (1/10th of a second)
    const tickRate = 100;

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - tickRate));
    }, tickRate);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [timeLeft, onComplete]);

  // Reset timer if the remainingMinutes prop changes
  useEffect(() => {
    setTimeLeft(totalInitialMilliseconds);
  }, [totalInitialMilliseconds]);

  const isLowTime = totalSeconds < 60; // Less than 1 minute (using totalSeconds here)
  const isFinished = timeLeft === 0;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-xl shadow-lg border-2 transition-colors duration-300 w-full mx-auto bg-white border-gray-100 dark:bg-slate-800 dark:border-slate-700",
        className
      )}
    >
      <Heading
        level={"h3"}
        className={cn("text-sm uppercase tracking-wide  font-semibold mb-2", {
          "text-success": event === "on",
          "text-error": event === "off",
        })}
      >
        {isFinished
          ? "Час вийшов"
          : `${label} до ${event === "on" ? "включення" : "вимкнення"}`}
      </Heading>

      <div
        className={cn("text-3xl font-mono font-bold tracking-tight", {
          "animate-pulse": isLowTime,
        })}
      >
        {timeDisplay}
      </div>

      {/* Progress Bar */}
      {totalInitialMilliseconds > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4 dark:bg-gray-700 overflow-hidden">
          <div
            style={{ width: `${(timeLeft / totalInitialMilliseconds) * 100}%` }}
            className={cn(
              "h-2.5 rounded-full transition-all duration-1000 ease-linear",
              {
                "bg-success": event === "on",
                "bg-error": event === "off",
              }
            )}
          />
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
