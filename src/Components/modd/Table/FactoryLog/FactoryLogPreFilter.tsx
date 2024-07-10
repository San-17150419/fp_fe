import React, { useState } from "react";
import { useFactoryLogContext } from "./FactoryLogContext";
import Select from "../../Select/Select";
import { PostDataParams } from "./FactoryLogDataType";

export default function FactoryLogPreFilter() {
  const { preData, isPreDataReady, fetchRawData, setIsRequestMade } =
    useFactoryLogContext();
  const [selectedValues, setSelectedValues] = useState<{
    factory?: "GD" | "HP" | "DL";
    date_type?: "half-year" | "quarter";
    point?: "ar" | "pamt_p";
    [key: string]: string | undefined;
  }>({});

  const [dateStart, setDateStart] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );

  if (!isPreDataReady) return <div>Loading...</div>;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !selectedValues.factory ||
      !selectedValues.date_type ||
      !selectedValues.point
    ) {
      console.error("Missing required fields");
      return;
    }

    const params: PostDataParams = {
      date_start: dateStart,
      factory: selectedValues.factory,
      date_type: selectedValues.date_type,
      point: selectedValues.point,
      ...selectedValues,
    };

    console.log(params);
    fetchRawData(params);
    setIsRequestMade(true);
  }

  const handleSelectChange = (key: string, value: string) => {
    setSelectedValues((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  return (
    <section className="min-h-[100px] outline">
      <form
        id="form"
        onSubmit={handleSubmit}
        className="grid grid-cols-4 place-items-center gap-4 p-3"
      >
        {Object.entries(preData).map(([key, value]) => {
          if (key === "dep") {
            return null;
          }
          return (
            <Select
              key={key}
              name={key}
              onSelect={(value) => handleSelectChange(key, value)}
              options={Object.entries(value).map(([key, value]) => ({
                value: key,
                text: value,
              }))}
            />
          );
        })}

        <input
          type="date"
          defaultValue={dateStart}
          className="h-[38px] w-full rounded border px-4 hover:border-blue-400"
          name="date"
          onChange={(e) => setDateStart(e.target.value)}
        />
      </form>
      <div className="m-2 block">
        <button
          className="ml-auto block rounded border border-gray-700 bg-gray-400 p-1 text-xs hover:bg-gray-500 hover:text-white"
          type="submit"
          form="form"
        >
          Search
        </button>
      </div>
    </section>
  );
}
