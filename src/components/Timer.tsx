"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TimerProps {
  durationSeconds: number;
  onTimeUp: () => void;
  isPaused?: boolean;
}

export default function Timer({ durationSeconds, onTimeUp, isPaused = false }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);

  useEffect(() => {
    setTimeLeft(durationSeconds);
  }, [durationSeconds]);

  useEffect(() => {
    if (isPaused) return;
    
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isPaused, onTimeUp]);

  const percentage = (timeLeft / durationSeconds) * 100;
  const isDanger = timeLeft <= 10;
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="w-full flex-col flex gap-2">
      <div className="flex justify-between items-center text-sm font-semibold text-gray-400">
        <span className={isDanger ? 'text-red-400 animate-pulse' : ''}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
        <span>{durationSeconds}s Total</span>
      </div>
      <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${isDanger ? 'bg-red-500' : 'bg-[#e91e63]'}`}
          initial={false}
          animate={{ width: `${percentage}%` }}
          transition={{ ease: "linear", duration: 1 }}
        />
      </div>
    </div>
  );
}
