import React, { useState } from "react";
import { useFactoryLogContext } from "./FactoryLogContext";
import { useTranslation } from "react-i18next";
import Select from "../../Select/Select";
import { PostDataParams } from "./FactoryLogDataType";
import InputBase from "../../Input/InputBase";
import { GrSearch } from "react-icons/gr";
export default function FactoryLogPreFilter() {
  // TODO: Maybe I need to change the default value of selectedDate to "yesterday". When the dafault value is today, the data in fourth interval is always missing. It could be a mistake from backend. Possible solution: 1. Set the default value to yesterday. 2. Change backend data or api. 3. Maybe fetch 5 intervals? Or some other way to increase or even make sure the data is not missing.

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
      <section className="flex min-h-[100px] p-2">
        <form
          id="form"
          onSubmit={handleSubmit}
          className="grid w-full grid-cols-9 place-items-center gap-1"
        >
          {preData &&
            Object.entries(preData).map(([key, value]) => {
              if (key === "dep") {
                return null;
              }
              return (
                <div key={key} className="col-span-2 flex w-full flex-col">
                  <label
                    className="ml-3 mt-2 text-xs desktop:text-sm"
                    htmlFor={key}
                  >
                    {t(key)}
                  </label>
                  <Select
                    key={`key-${key}`}
                    name={key}
                    className="my-1 font-semibold"
                    onSelect={(value) => handleSelectChange(key, value)}
                    options={Object.entries(value).map(([key, value]) => ({
                      value: key,
                      text: value,
                    }))}
                  />
                </div>
              );
            })}
          <div className="col-span-2 flex w-full flex-col">
            <label className="ml-2 mt-2 text-xs desktop:text-sm" htmlFor="date">
              {t("當期開始")}
            </label>
            <InputBase
              type="date"
              defaultValue={dateStart}
              name="date"
              id="date"
              className="font-semibold"
              onChange={(e) => setDateStart(e.target.value)}
            />
          </div>
          <div className="col-span-1 flex w-full flex-col">
            <button
              title="Search"
              className="ml-auto mt-6 flex h-[1.875rem] w-[1.875rem] items-center justify-center rounded border bg-gray-400 text-xs hover:bg-gray-500 hover:text-white desktop:mt-8 desktop:h-9 desktop:w-9 desktop:text-sm"
              type="submit"
              form="form"
            >
              <GrSearch />
            </button>
          </div>
        </form>
        {/* <div className="flex flex-grow pt-9">
          <button
            title="Search"
            className="ml-2 flex h-8 w-8 items-center justify-center rounded border text-xs hover:bg-gray-500 hover:text-white desktop:text-sm"
            type="submit"
            form="form"
          >
            <GrSearch />
          </button>
        </div> */}
      </section>
    </>
  );
}
