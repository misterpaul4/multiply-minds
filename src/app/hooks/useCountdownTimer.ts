import { useEffect, useState } from "react";

interface CountdownHook {
  start: () => void;
  stop: () => void;
  pause: () => void;
  isRunning: boolean;
  countdown: string;
}

const useCountdown = (
  initialTimeInSeconds: number,
  onFinish?: () => void
): CountdownHook => {
  const [time, setTime] = useState(initialTimeInSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: number;

    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      onFinish?.();
    }

    return () => {
      clearInterval(timer);
    };
  }, [isRunning, time, onFinish]);

  const start = () => {
    setTime(initialTimeInSeconds);
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
    setTime(initialTimeInSeconds);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const formatTime = (timeInSeconds: number): string => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return {
    start,
    stop,
    pause,
    isRunning,
    countdown: formatTime(time),
  };
};

export default useCountdown;
