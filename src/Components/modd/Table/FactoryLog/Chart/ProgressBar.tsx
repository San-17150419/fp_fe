import React, { useEffect, useRef } from "react";

type ProgressBarProps = {
  target: number;
  achieved: number;
};
export default function ProgressBar({ target, achieved }: ProgressBarProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.setAttribute("aria-valuenow", String(achieved));
      progressBarRef.current.setAttribute("aria-valuemax", String(target));
      progressBarRef.current.setAttribute("aria-valuemin", "0");
    }
  }, [achieved, target]);

  const progressPercentage = (achieved / target) * 100;
  return (
    <div className="flex flex-col gap-1 pr-8">
      <div className="flex justify-between">
        <h2 className="text-sm">項目</h2>
        <p className="text-xs">數字</p>
      </div>
      <div className="flex gap-2 rounded bg-gray-300">
        <div
          aria-label={`Progress: ${progressPercentage}%`}
          role="progressbar"
          className="relative h-6 rounded bg-gray-600"
          style={{ width: `${progressPercentage}%` }}
        >
          <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-xs text-gray-200">
            {progressPercentage.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}
