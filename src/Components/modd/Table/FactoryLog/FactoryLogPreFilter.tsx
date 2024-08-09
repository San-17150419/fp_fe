import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Select from "../../Select/Select";
import { PostDataParams, FactoryLogRawData } from "./FactoryLogDataType";
import InputBase from "../../Input/InputBase";
import { GrSearch } from "react-icons/gr";
import { GrDownload } from "react-icons/gr";
import axios, { isAxiosError, type AxiosProgressEvent } from "axios";
import Loading from "../../../Loading";
import ProgressBar from "./Chart/ProgressBar";
import { type FactoryLogPreData } from "./FactoryLogDataType";
import FactoryLogTable from "./FactoryLogTable";

type FactoryLogPreFilterProps = {
  preData: FactoryLogPreData["preData"];
};

export default function FactoryLogPreFilter({
  preData,
}: FactoryLogPreFilterProps) {
  const [selectedFactory, setSelectedFactory] = useState<"GD" | "HP" | "DL">(
    "GD",
  );
  const [selectedDateType, setSelectedDateType] = useState<
    "half-year" | "quarter"
  >("half-year");
  const [selectedPoint, setSelectedPoint] = useState<"ar" | "pamt_p">("ar");
  const { t } = useTranslation();
  const [dateStart, setDateStart] = useState<string>(
    new Date(Date.now() - 86400000 * 7).toISOString().split("T")[0],
  );
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [factoryLogRawData, setFactoryLogRawData] =
    useState<FactoryLogRawData | null>(null);

  const onDownloadProgress = (progressEvent: AxiosProgressEvent) => {
    console.log(progressEvent);
    if (!progressEvent.total) return;
    const percentCompleted = Math.round(
      (progressEvent.loaded / progressEvent.total) * 100,
    );
    setProgress(percentCompleted);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setFactoryLogRawData(null);
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
        const response = await axios
          .post<FactoryLogRawData>(url, params, {
            onDownloadProgress: onDownloadProgress,
          })
          .then((response) => {
            setTimeout(() => {
              setProgress(0);
              setIsLoading(false);
            }, 500);
            return response;
          });
        setIsLoading(false);
        console.dir(response);
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
    ).then((data) => {
      if (!data) return;
      setIsLoading(false);
      setFactoryLogRawData(data);
      // console.log(Object.keys(data.));
      console.log(data.dep);
      console.log(data.duration);
    });
  };

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
    <>
      <section className="min-h-[100px] border-b border-black">
        {isLoading && (
          <>
            <div>{progress}%</div>
            <div>Loading</div>
          </>
        )}
        <form id="form" onSubmit={handleSubmit} className="flex w-full">
          <div className="flex w-full flex-grow gap-4">
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
                <div key={key} className="flex w-full flex-col">
                  <label
                    className="ml-1 mt-2 text-xs desktop:text-sm"
                    htmlFor={key}
                  >
                    {t(key)}
                  </label>
                  <Select
                    key={`key-${key}`}
                    name={key}
                    className="my-1"
                    onSelect={onSelectHandler}
                    options={options}
                  />
                </div>
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
                onChange={(e) => setDateStart(e.target.value)}
              />
            </div>
          </div>

          <div className="ml-4 flex gap-4">
            <button
              title="Search"
              className="ml-auto mt-6 flex h-[1.875rem] w-[1.875rem] items-center justify-center rounded bg-gray-400 text-xs shadow shadow-gray-500 hover:bg-gray-500 hover:text-white hover:shadow-gray-800 focus:shadow focus:shadow-gray-800 desktop:mt-8 desktop:h-9 desktop:w-9 desktop:text-sm"
              type="submit"
              form="form"
            >
              <GrSearch />
            </button>
            <button
              type="button"
              className="ml-auto mt-6 flex h-[1.875rem] w-[1.875rem] items-center justify-center rounded bg-gray-400 text-xs shadow shadow-gray-500 hover:bg-gray-500 hover:text-white hover:shadow-gray-800 focus:shadow focus:shadow-gray-800 desktop:mt-8 desktop:h-9 desktop:w-9 desktop:text-sm"
              onClick={() => alert("Download Excel")}
              aria-label="Download Excel"
            >
              <GrDownload />
            </button>
          </div>
        </form>
      </section>
      {/* Show loading indicator when a request is made but data is not yet loaded */}
      {isLoading && !factoryLogRawData && <Loading />}
      {/* Only show table when data is loaded */}
      {factoryLogRawData && <FactoryLogTable logData={factoryLogRawData} />}
    </>
  );
}
