import React, { useEffect, useState } from "react";
type StatusComponentProps = {
  value: number[];
};

const StatusComponent: React.FC<StatusComponentProps> = ({ value }) => {
  const [isLowest, setIsLowest] = useState(false);
  const [
    isLowerThanStandardConsecutively,
    setIsLowerThanStandardConsecutively,
  ] = useState(false);
  const [
    numberOfConsecutiveLowerThanStandard,
    setNumberOfConsecutiveLowerThanStandard,
  ] = useState(0);

  useEffect(() => {
    const calculateStatus = (data: number[]) => {
      const current = data[data.length - 1];
      let consecutiveCount = 0;

      // Check for consecutive values lower than standard (85)
      for (let i = data.length - 1; i >= 0; i--) {
        if (data[i] < 0.85) {
          consecutiveCount++;
        } else {
          break;
        }
      }

      setNumberOfConsecutiveLowerThanStandard(consecutiveCount);
      setIsLowerThanStandardConsecutively(consecutiveCount > 1);

      // Check if the current value is the lowest
      const lowest = Math.min(...data);
      setIsLowest(current === lowest);
    };

    calculateStatus(value);
  }, [value]);

  return (
    <div className="flex gap-2">
      {isLowest && (
        <p
          className={`${value[value.length - 1] < 0.85 ? "bg-amber-500" : "bg-green-500"} rounded-full p-2 px-4 text-white`}
        >
          最低達成率
        </p>
      )}
      {isLowerThanStandardConsecutively && (
        <p className="rounded-full bg-red-500 p-2 px-4 text-white">
          連續低於標準
          {numberOfConsecutiveLowerThanStandard > 1 &&
            ` (${numberOfConsecutiveLowerThanStandard})`}
        </p>
      )}
    </div>
  );
};

export default StatusComponent;
