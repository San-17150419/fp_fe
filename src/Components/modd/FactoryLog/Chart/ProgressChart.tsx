import React from "react";
import ProgressBar from "./ProgressBar";
import { type FactoryEventReponse } from "../types/factoryLogDataType";
type ProgressChartProps = {
  eventData: FactoryEventReponse;
  children?: React.ReactNode;
};
export default function ProgressChart({
  eventData,
  children,
}: ProgressChartProps) {
  function generateProgressChartData() {
    const data: { title: string; target: number; achieved: number }[] = [];
    eventData.data.forEach((item) => {
      data.push({
        title: item.prod_name,
        target: item.cpamt,
        achieved: item.pamt,
      });
    });

    return data;
  }

  return (
    <div>
      {children}
      <div className="w-[90% mx-2 my-8 grid grid-cols-2 px-2 py-4">
        {generateProgressChartData().map((item, index) => (
          <ProgressBar
            indexNmber={index}
            key={item.title}
            title={item.title}
            target={item.target}
            achieved={item.achieved}
          />
        ))}
      </div>
    </div>
  );
}
