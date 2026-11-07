import { useEffect, useState } from "react";

type BootKeyframe = readonly [time: number, progress: number];

const BOOT_TIMELINE: readonly BootKeyframe[] = [
  [0, 0],
  [350, 6],
  [900, 31],
  [1050, 31],
  [1700, 59],
  [1850, 60],
  [2300, 88],
  [2400, 90],
  [2900, 100],
];

function interpolateProgress(elapsed: number) {
  if (elapsed >= BOOT_TIMELINE[BOOT_TIMELINE.length - 1][0]) return 100;

  for (let index = 1; index < BOOT_TIMELINE.length; index += 1) {
    const [endTime, endProgress] = BOOT_TIMELINE[index];
    const [startTime, startProgress] = BOOT_TIMELINE[index - 1];
    if (elapsed <= endTime) {
      const span = endTime - startTime || 1;
      const position = (elapsed - startTime) / span;
      return Math.round(startProgress + (endProgress - startProgress) * position);
    }
  }

  return 100;
}

export function useBootProgress(active: boolean, cycle: number) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) return;

    let frame = 0;
    const startedAt = Date.now();

    const tick = () => {
      const nextProgress = interpolateProgress(Date.now() - startedAt);
      setProgress(nextProgress);
      if (nextProgress < 100) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [active, cycle]);

  return progress;
}

