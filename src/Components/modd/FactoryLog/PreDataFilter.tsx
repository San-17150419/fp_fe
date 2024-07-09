import React, { FormEvent, useState } from "react";
import Select from "../Select/Select";
import { useFactoryLogDataContext } from "./FactoryLogContext";
import { dummyData, formatDataForTable } from "./format";


const result = formatDataForTable(dummyData);
console.log(result);
const FirstFilterArea: React.FC = () => {
  const { preData, fetchRawData, isPreDataLoading } =
    useFactoryLogDataContext();
  const [factory, setFactory] = useState<string>("DL");
  const [dateType, setDateType] = useState<string>("");
  const [point, setPoint] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchRawData({
      factory,
      date_type: dateType,
      date_start: date,
      point: "ar",
    });
  };

  if (isPreDataLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <form
        id="form"
        onSubmit={handleFormSubmit}
        className="grid grid-cols-4 place-items-center gap-4 p-4"
      >
        <Select
          onSelect={setFactory}
          name="factory"
          options={preData.factory}
        />
        <Select
          onSelect={setDateType}
          name="dateType"
          options={preData.dateType}
        />
        <Select onSelect={setPoint} name="point" options={preData.point} />
        <input
          onChange={(e) => setDate(e.target.value)}
          className="h-[38px] w-full rounded px-4"
          type="date"
          name="date"
          defaultValue={new Date().toISOString().split("T")[0]}
          id="date"
        />
      </form>
      <button
        type="submit"
        form="form"
        className="rounded bg-gray-400 p-2 px-4 text-white hover:bg-gray-500 hover:text-gray-700"
      >
        Submit
      </button>
    </>
  );
};

export default FirstFilterArea;
