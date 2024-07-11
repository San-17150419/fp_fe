import React, { useState } from "react";
import { useFactoryLogContext } from "./FactoryLogContext";
import { useTranslation } from "react-i18next";
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
    <section className="min-h-[100px] pr-10 outline">
      <form
        id="form"
        onSubmit={handleSubmit}
        className="grid grid-cols-2 place-items-center gap-2 desktop:grid-cols-3"
      >
        {Object.entries(preData).map(([key, value]) => {
          if (key === "dep") {
            return null;
          }
          return (
            <div
              key={key}
              className="flex w-full items-center justify-end gap-4"
            >
              <label className="text-sm" htmlFor={key}>
                {t(key)}
              </label>
              <div className="w-3/4">
                <Select
                  key={`key-${key}`}
                  name={key}
                  onSelect={(value) => handleSelectChange(key, value)}
                  options={Object.entries(value).map(([key, value]) => ({
                    value: key,
                    text: value,
                  }))}
                />
              </div>
            </div>
          );
        })}
        <div className="flex w-full items-center justify-end gap-4 text-nowrap">
          <label htmlFor="date">{t("當期開始")}</label>
          <div className="w-3/4 px-1">
            <input
              type="date"
              defaultValue={dateStart}
              className="h-[38px] w-full rounded border px-4 hover:border-blue-400"
              name="date"
              id="date"
              onChange={(e) => setDateStart(e.target.value)}
            />
          </div>
        </div>
      </form>
      <div className="m-2 block">
        <button
          className="ml-auto block rounded border border-gray-700 bg-gray-400 p-1 text-xs hover:bg-gray-500 hover:text-white"
          type="submit"
          form="form"
        >
          {t("Search")}
        </button>
      </div>
    </section>
  );
}
