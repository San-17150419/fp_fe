import React, { useState, useMemo, useCallback } from "react";
import { useFactoryLogContext } from "./FactoryLogContext";
import { useTranslation } from "react-i18next";
import Select from "../../Select/Select";
import { PostDataParams } from "./FactoryLogDataType";
import InputBase from "../../Input/InputBase";
import { GrSearch } from "react-icons/gr";

export default function FactoryLogPreFilter() {
  const { preData, isPreDataReady, fetchRawData, setIsRequestMade } =
    useFactoryLogContext();
  const [selectedFactory, setSelectedFactory] = useState<"GD" | "HP" | "DL">(
    "GD",
  );
  const [selectedDateType, setSelectedDateType] = useState<
    "half-year" | "quarter"
  >("half-year");
  const [selectedPoint, setSelectedPoint] = useState<"ar" | "pamt_p">("ar");
  const { t } = useTranslation();
  const [dateStart, setDateStart] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );
  const selectHandlers = {
    factory: setSelectedFactory,
    date_type: setSelectedDateType,
    point: setSelectedPoint,
  };

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!selectedFactory || !selectedDateType || !selectedPoint) {
        console.error("Missing required fields");
        return;
      }

      const params: PostDataParams = {
        date_start: dateStart,
        factory: selectedFactory,
        date_type: selectedDateType,
        point: selectedPoint,
      };

      fetchRawData(params);
      setIsRequestMade(true);
    },
    [dateStart, fetchRawData, setIsRequestMade],
  );

  const memoizedOptions = useMemo(() => {
    if (!preData) return {};
    return Object.entries(preData).reduce(
      (acc, [key, value]) => {
        if (key === "dep") return acc;
        acc[key] = Object.entries(value).map(([key, value]) => ({
          value: key,
          text: value,
        }));
        return acc;
      },
      {} as { [key: string]: { value: string; text: string }[] },
    );
  }, [preData]);
  const handleFactoryChange = useCallback((value: "GD" | "HP" | "DL") => {
    setSelectedFactory(value);
  }, []);

  const handleDateTypeChange = useCallback((value: "half-year" | "quarter") => {
    setSelectedDateType(value);
  }, []);

  const handlePointChange = useCallback((value: "ar" | "pamt_p") => {
    setSelectedPoint(value);
  }, []);
  return (
    <section className="flex min-h-[100px] p-2">
      <form
        id="form"
        onSubmit={handleSubmit}
        className="grid w-full grid-cols-9 place-items-center gap-1"
      >
        {Object.entries(memoizedOptions).map(([key, options]) => {
          let onSelectHandler: (value: any) => void;
          switch (key) {
            case "factory":
              onSelectHandler = handleFactoryChange;
              break;
            case "date_type":
              onSelectHandler = handleDateTypeChange;
              break;
            case "point":
              onSelectHandler = handlePointChange;
              break;
            default:
              onSelectHandler = () => {};
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
                onSelect={onSelectHandler}
                options={options}
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
            className="font-semibold shadow shadow-slate-300"
            onChange={(e) => setDateStart(e.target.value)}
          />
        </div>
        <div className="col-span-1 flex w-full flex-col">
          <button
            title="Search"
            className="ml-auto mt-6 flex h-[1.875rem] w-[1.875rem] items-center justify-center rounded bg-gray-400 text-xs shadow shadow-gray-500 hover:bg-gray-500 hover:text-white hover:shadow-gray-800 focus:shadow focus:shadow-gray-800 desktop:mt-8 desktop:h-9 desktop:w-9 desktop:text-sm"
            type="submit"
            form="form"
          >
            <GrSearch />
          </button>
        </div>
      </form>
    </section>
  );
}
