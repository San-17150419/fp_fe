import React, { useState } from "react";
import { useFactoryLogContext } from "./FactoryLogContext";
import { useTranslation } from "react-i18next";
import Select from "../../Select/Select";
import { PostDataParams } from "./FactoryLogDataType";
import InputBase from "../../Input/InputBase";

export default function FactoryLogPreFilter() {
  const { preData, isPreDataReady, fetchRawData, setIsRequestMade } =
    useFactoryLogContext();
  const [selectedValues, setSelectedValues] = useState<{
    factory?: "GD" | "HP" | "DL";
    date_type?: "half-year" | "quarter";
    point?: "ar" | "pamt_p";
    [key: string]: string | undefined;
  }>({});
  const { t } = useTranslation();
  const [dateStart, setDateStart] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );

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
  if (!isPreDataReady) return <div>{t("Loading...")}</div>;
  return (
    <>
      <section className="min-h-[100px] p-2 outline">
        <form
          id="form"
          onSubmit={handleSubmit}
          className="grid grid-cols-4 place-items-center gap-2"
        >
          {preData &&
            Object.entries(preData).map(([key, value]) => {
              if (key === "dep") {
                return null;
              }
              return (
                <div key={key} className="flex w-full flex-col">
                  <label className="ml-3 mt-2 text-xs" htmlFor={key}>
                    {t(key)}
                  </label>
                  <Select
                    key={`key-${key}`}
                    name={key}
                    className="my-1"
                    onSelect={(value) => handleSelectChange(key, value)}
                    options={Object.entries(value).map(([key, value]) => ({
                      value: key,
                      text: value,
                    }))}
                  />
                </div>
              );
            })}
          <div className="flex w-full flex-col">
            <label className="ml-2 mt-2 text-xs" htmlFor="date">
              {t("當期開始")}
            </label>
            <InputBase
              type="date"
              defaultValue={dateStart}
              name="date"
              id="date"
              onChange={(e) => setDateStart(e.target.value)}
            />
          </div>
        </form>
        <div className="m-2 block">
          <button
            className="ml-auto block rounded border border-gray-700 bg-gray-400 p-2 text-xs hover:bg-gray-500 hover:text-white"
            type="submit"
            form="form"
          >
            {t("Search")}
          </button>
        </div>
      </section>
    </>
  );
}
