import { useState, useMemo } from "react";
import axios, { isAxiosError } from "axios";
import {
  PreData,
  type Factory,
  type PostDataParams,
  type FactoryLogRawData,
  type FilterConfig,
  type FactoryTableData,
} from "../types";

import { transformData } from "../formatFactoryData";

const api = import.meta.env.VITE_FACTORY_LOG_URL;

export default function useFilterState(
  preData: PreData,
  defaultDateStart?: string,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [factory, setFactory] = useState<Factory | null>(null);
  const [point, setPoint] = useState<"ar" | "pamt_h" | null>(null);
  const [dateType, setDateType] = useState<"half-year" | "quarter" | null>(
    null,
  );
  const [dateStart, setDateStart] = useState<string>(
    defaultDateStart ||
      new Date(Date.now() - 86400000 * 7).toISOString().split("T")[0],
  );
  const [logData, setLogData] = useState<FactoryTableData | null>(null);

  const memoizedFactoryOptions = useMemo(() => {
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!factory || !point || !dateType || !dateStart) {
      setError("Missing required fields");
      return;
    }
    setIsLoading(true);
    setError(null);
    const params: PostDataParams = {
      date_start: dateStart,
      factory: factory,
      date_type: dateType,
      point: point,
    };

    const fetchFactoryLogRawData = async (
      url: string = `${api}/raw-data/`,
      params: PostDataParams,
    ): Promise<FactoryLogRawData | undefined> => {
      try {
        const response = await axios.post<FactoryLogRawData>(url, params);
        setError(null);
        setLogData(transformData(response.data));
        return response.data;
      } catch (error) {
        console.error(error);
        // TODO: Need to find a more elegant way to show error message
        if (isAxiosError(error)) {
          const errorHTML = error.response?.data;
          const parser = new DOMParser();
          const doc = parser.parseFromString(errorHTML, "text/html");
          const summary = (doc.querySelector("#summary h1") as HTMLElement)
            ?.innerText;
          const exceptionMessage = (
            doc.querySelector(".exception_value") as HTMLElement
          ).innerText;

          setError(`Error: ${summary} - ${exceptionMessage}`);
        }

        // return undefined indicating that the request failed
        return undefined;
      }
    };

    fetchFactoryLogRawData(
      "http://192.168.123.240:9000/api/fj/raw-data/",
      params,
    ).then(() => setIsLoading(false));
  };

  const filterConfig: {
    factory: FilterConfig<"select">;
    date_type: FilterConfig<"select">;
    point: FilterConfig<"select">;
    date_start: FilterConfig<"input">;
  } = {
    factory: {
      type: "select",
      onChange: (value: string) => setFactory(value as Factory),
      options: memoizedFactoryOptions.factory,
    },
    date_type: {
      type: "select",
      onChange: (value: string) =>
        setDateType(value as "half-year" | "quarter"),
      options: memoizedFactoryOptions.date_type,
    },
    point: {
      type: "select",
      onChange: (value: string) => setPoint(value as "ar" | "pamt_h"),
      options: memoizedFactoryOptions.point,
    },
    date_start: {
      type: "input",
      onChange: setDateStart,
      defaultValue: dateStart,
    },
  };

  return {
    isLoading,
    error,
    logData,
    handleSubmit,
    filterConfig,
  };
}
