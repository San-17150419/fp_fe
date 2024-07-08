import React, { useMemo, useState } from "react";
import DepartmentRow from "./modd/DepartmentRow";

export default function Department({
  data,
  title,
}: {
  data: Array<any>;
  title: string;
}) {
  const generateTestData = () => {
    const all = [];
    for (let i = 0; i < 10; i++) {
      const holder = [];
      for (let j = 0; j < 4; j++) {
        holder.push(Math.floor(7000 + Math.random() * 3000) / 100);
      }
      all.push(holder);
    }
    return all;
  };
  const [testData, setTestData] = useState<Array<any>>(generateTestData());

  return (
    <div className="border border-black">
      <h2 className="text-center text-3xl">{title}</h2>
      <button
        type="button"
        onClick={() => setTestData(generateTestData())}
        className="my-2 ml-auto mr-2 block h-10 w-fit justify-items-end justify-self-end rounded-md border bg-white p-2 text-black"
      >
        Reset
      </button>

      {testData.map((item: any, index: number) => (
        <DepartmentRow key={index} data={item} />
      ))}
    </div>
  );
}
