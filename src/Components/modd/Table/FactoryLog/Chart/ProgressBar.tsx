import  { useEffect, useRef } from "react";

//
type ProgressBarProps = {
  title?: string;
  target: number;
  achieved: number;
  indexNmber?: number;
};
export default function ProgressBar({
  target,
  achieved,
  title,
  indexNmber = 0,
}: ProgressBarProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.setAttribute("aria-valuenow", String(achieved));
      progressBarRef.current.setAttribute("aria-valuemax", String(target));
      progressBarRef.current.setAttribute("aria-valuemin", "0");
    }
  }, [achieved, target]);

  const backgroundColors = [
    "bg-red-300",
    "bg-green-200",
    "bg-sky-200",
    "bg-amber-200",
    "bg-purple-300",
  ];

  const progressPercentage = (achieved / target) * 100;
  return (
    <div className="my-2 flex flex-col gap-1 px-4">
      <div className="flex justify-between">
        <h2 className="text-base font-bold">{title || "項目"}</h2>
        {/* TODO: I am not sure wether this should display the target or the achieved */}
        <p className="text-xs">{achieved}</p>
      </div>
      <div className={`flex gap-2 rounded bg-gray-200`}>
        <div
          aria-label={`Progress: ${progressPercentage}%`}
          role="progressbar"
          className={`relative h-6 rounded ${backgroundColors[indexNmber % backgroundColors.length]}`}
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
