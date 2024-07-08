import React, { useEffect, useState } from "react";

type DepartmentRowProps = {
  children?: React.ReactNode;
  //   A number array with 4 elements
  data: [number, number, number, number];
  title?: string;
};

export default function DepartmentRow({
  children,
  data,
  title,
}: DepartmentRowProps) {
  const [isLowest, setIsLowest] = useState(false);
  const [
    isLowerThanStandardConsecutively,
    setIsLowerThanStandardConsecutively,
  ] = useState(false);
  const [
    numberOfConsecutiveLowerThanStandard,
    setNumberOfConsecutiveLowerThanStandard,
  ] = useState(0);
  //   Lower than standard(85 for now)
  //   Is lowest
  //   Lower than standard consecutively

  useEffect(() => {
    const calculateStatus = (data: [number, number, number, number]) => {
      const current = data[3];
      let consecutiveCount = 0;

      // Check for consecutive values lower than standard (85)
      for (let i = 3; i >= 0; i--) {
        if (data[i] < 85) {
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

    calculateStatus(data);
  }, [data]);

  return (
    <div>
      <p>
        {children} {title}
      </p>
      <div className="flex gap-4 border border-black p-2 text-white">
        {data.map((item) => (
          <p
            className={` ${item < 85 ? "text-red-500" : "text-green-500"}`}
            key={item}
          >
            {item} %
          </p>
        ))}
        <div className="flex gap-2">
          {isLowest && (
            <p
              className={`${data[3] < 85 ? "bg-amber-500" : "bg-green-500"} rounded-full p-2 px-4 text-white`}
            >
              最低達成率
            </p>
          )}
          {isLowerThanStandardConsecutively && (
            <p className="rounded-full bg-red-500 p-2 px-4 text-white">
              連續低於標準
              {numberOfConsecutiveLowerThanStandard > 1 &&
                ` \(${numberOfConsecutiveLowerThanStandard}\)`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
