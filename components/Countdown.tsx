"use client";

import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  remainingTime: number; // Duration in minutes
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ remainingTime }) => {
  // Convert minutes to seconds
  const [timeLeft, setTimeLeft] = useState(remainingTime * 60);

  useEffect(() => {
    // If time is up, stop
    if (timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  // Helper to format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Pad with zeros (e.g., 5 becomes 05)
    const displayMinutes = String(minutes).padStart(2, "0");
    const displaySeconds = String(remainingSeconds).padStart(2, "0");

    return `${displayMinutes}:${displaySeconds}`;
  };

  // Calculate percentage for a progress bar (optional visual flair)
  const totalSeconds = remainingTime * 60;
  const progress = (timeLeft / totalSeconds) * 100;

  // Dynamic colors based on urgency
  const isUrgent = timeLeft < 60; // Less than 1 minute
  const textColor = isUrgent ? "text-red-500" : "text-gray-100";
  const borderColor = isUrgent ? "border-red-500" : "border-blue-500";

  return (
    <div
      className={`flex flex-col items-center justify-center p-6 bg-gray-900 rounded-xl shadow-lg border-2 ${borderColor} transition-colors duration-500 w-64`}
    >
      {/* Label */}
      <span className="text-gray-400 text-sm uppercase tracking-wider mb-2">
        Time Remaining
      </span>

      {/* Timer Display */}
      <div
        className={`text-5xl font-mono font-bold ${textColor} tabular-nums mb-4`}
      >
        {timeLeft > 0 ? formatTime(timeLeft) : "00:00"}
      </div>

      {/* Progress Bar Background */}
      <div className="w-full bg-gray-700 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
        {/* Actual Progress */}
        <div
          className={`h-2.5 rounded-full ${
            isUrgent ? "bg-red-500" : "bg-blue-500"
          } transition-all duration-1000 ease-linear`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Time's Up Message */}
      {timeLeft === 0 && (
        <div className="mt-4 text-red-400 font-semibold animate-pulse">
          Times Up!
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
