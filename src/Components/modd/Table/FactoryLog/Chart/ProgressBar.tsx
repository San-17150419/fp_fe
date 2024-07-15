import React from "react";

type ProgressBarProps = {
  target: number;
  achieved: number;
};
export default function ProgressBar({ target, achieved }: ProgressBarProps) {
  return (
    <div className="flex flex-col gap-1 pr-8">
      <div className="flex justify-between">
        <h2 className="text-sm">項目</h2>
        <p className="text-xs">數字</p>
      </div>
      <div className="flex gap-2 rounded bg-gray-300">
        <div
          className="relative h-6 rounded bg-gray-600"
          style={{ width: `${(achieved / target) * 100}%` }}
        >
          <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-xs text-gray-200">
            {((achieved / target) * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}
