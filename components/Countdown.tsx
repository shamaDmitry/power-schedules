"use client";

import React, { useState, useEffect, useMemo } from "react";

interface CountdownTimerProps {
  remainingTime: number; // Required: Total duration in minutes
  showHours?: boolean; // Optional: Show hours (HH)
  showMinutes?: boolean; // Optional: Show minutes (MM)
  showSeconds?: boolean; // Optional: Show seconds (SS)
  showMilliseconds?: boolean; // Optional: Show milliseconds (XXX)
  onComplete?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  remainingTime,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
  showMilliseconds = false, // Defaults to false
  onComplete,
}) => {
  // Calculate total starting time in milliseconds (min * 60 * 1000)
  const totalInitialMilliseconds = remainingTime * 60 * 1000;

  // State to track remaining time in milliseconds
  const [timeLeft, setTimeLeft] = useState(totalInitialMilliseconds);

  // ---------------------------------------------
  // Time Calculation Logic
  // ---------------------------------------------

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

  // ---------------------------------------------
  // Display Formatting (Memoized for performance)
  // ---------------------------------------------

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

  // ---------------------------------------------
  // Effect for Ticking and Cleanup
  // ---------------------------------------------

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

  // ---------------------------------------------
  // Dynamic Styling
  // ---------------------------------------------

  const isLowTime = totalSeconds < 60; // Less than 1 minute (using totalSeconds here)
  const isFinished = timeLeft === 0;

  return (
    <div
      className={`
      flex flex-col items-center justify-center 
      p-6 rounded-xl shadow-lg border-2 
      transition-colors duration-300 w-full max-w-lg mx-auto
      ${
        isFinished
          ? "bg-red-50 border-red-200"
          : isLowTime
          ? "bg-orange-50 border-orange-200"
          : "bg-white border-gray-100 dark:bg-slate-800 dark:border-slate-700"
      }
    `}
    >
      <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-2">
        {isFinished ? "Time's Up!" : "Time Remaining"}
      </h3>

      <div
        className={`
        text-6xl font-mono font-bold tracking-tight
        ${
          isFinished
            ? "text-red-500"
            : isLowTime
            ? "text-orange-500"
            : "text-gray-900 dark:text-white"
        }
      `}
      >
        {timeDisplay}
      </div>

      {/* Progress Bar */}
      {totalInitialMilliseconds > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4 dark:bg-gray-700 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-1000 ease-linear ${
              isLowTime ? "bg-orange-500" : "bg-blue-600"
            }`}
            style={{ width: `${(timeLeft / totalInitialMilliseconds) * 100}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
