import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { PostDataParams, FactoryLogRawData } from "./types/factoryLogDataType";
import InputBase from "../Input/InputBase";
import axios, { isAxiosError } from "axios";
import Loading from "../../Loading";
import { type FactoryLogPreFilterProps } from "./types/factoryLogDataType";
import FactoryLogTable from "./FactoryLogTable";
import FactoryButtons from "./FactoryButtons";
import FactoryPreFilterSelect from "./FactoryPreFilterSelect";
import usePreFilterSelect from "./hooks/usePreFilterSelect";

export default function FactoryLogPreFilter({
  preData,
}: FactoryLogPreFilterProps) {
  const {
    selectedFactory,
    selectedDateType,
    selectedPoint,
    dateStart,
    isLoading,
    factoryLogRawData,
    dispatch,
  } = usePreFilterSelect(preData);

  const { t } = useTranslation();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch({
      type: "setIsLoading",
      payload: true,
    });

    dispatch({ type: "setFactoryLogRawData", payload: null });
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

    const fetchFactoryLogRawData = async (
      url: string = "http://192.168.123.240:9000/api/fj/raw-data/",
      params: PostDataParams,
    ): Promise<FactoryLogRawData | undefined> => {
      try {
        const response = await axios.post<FactoryLogRawData>(url, params);
        dispatch({ type: "setIsLoading", payload: false });
        dispatch({ type: "setFactoryLogRawData", payload: response.data });
        return response.data;
      } catch (error) {
        console.error(error);
        isAxiosError(error) &&
          error.response &&
          console.error(error.response.data);
        // return undefined indicating that the request failed
        return undefined;
      }
    };

    fetchFactoryLogRawData(
      "http://192.168.123.240:9000/api/fj/raw-data/",
      params,
    );
  };

  // preData is always defined
  const options = Object.entries(preData).reduce(
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
  const handleFactoryChange = useCallback((value: "GD" | "HP" | "DL") => {
    dispatch({ type: "setSelectedFactory", payload: value });
  }, []);

  const handleDateTypeChange = useCallback((value: "half-year" | "quarter") => {
    dispatch({ type: "setSelectedDateType", payload: value });
  }, []);

  const handlePointChange = useCallback((value: "ar" | "pamt_p") => {
    dispatch({ type: "setSelectedPoint", payload: value });
  }, []);
  return (
    <>
      <section className="min-h-[100px] border-b border-black">
        <form id="form" onSubmit={handleSubmit} className="flex w-full">
          <div className="flex w-full flex-grow gap-4">
            {Object.entries(options).map(([key, options]) => {
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
                <FactoryPreFilterSelect
                  text={key}
                  key={key}
                  options={options}
                  onSelect={onSelectHandler}
                />
              );
            })}
            <div className="flex w-full flex-col">
              <label
                className="ml-1 mt-2 text-xs desktop:text-sm"
                htmlFor="date"
              >
                {t("當期開始")}
              </label>
              <InputBase
                type="date"
                defaultValue={dateStart}
                name="date"
                id="date"
                className="font-normal shadow shadow-slate-300"
                onChange={(e) =>
                  dispatch({ type: "setDateStart", payload: e.target.value })
                }
              />
            </div>
          </div>

          <FactoryButtons
            factory={factoryLogRawData?.post.factory}
            duration={factoryLogRawData?.duration}
          />
        </form>
      </section>
      {/* Show loading indicator when a request is made but data is not yet loaded */}
      {isLoading && !factoryLogRawData && <Loading />}
      {/* Only show table when data is loaded */}
      {factoryLogRawData && <FactoryLogTable logData={factoryLogRawData} />}
    </>
  );
}
