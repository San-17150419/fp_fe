import { AxiosResponse } from "axios";

export type int = number;

type GenericObject = Record<string, any>;

export type FactoryLogPreData = {
  preData: {
    factory: GenericObject;
    point: GenericObject;
    date_type: GenericObject;
    dep: { [key: string]: GenericObject };
  };
};

export type PostDataParams = {
  factory: "GD" | "HP" | "DL";
  date_type: "half-year" | "quarter";
  date_start: string;
  // right now, we do not need to specify point. I only include it for completeness
  point: "ar" | "pamt_p";
};

export type LogData = {
  dep: string;
  data: Array<{
    date_start: string;
    date_end: string;
    raw: Array<{ [key: string]: int }>;
  }>;
};

export type FactoryLogRawData = {
  dep: string[];
  duration: { date_start: string; date_end: string }[];
  data: LogData[];
  post: {
    date_start: string;
    date_type: string;
    factory: string;
    // Right now, the return value of point is null, regardless of wether it was specified or not
    point: string | null;
  };
};

export type FactoryLogContextType = {
  preData: FactoryLogPreData["preData"];
  fetchRawData: (
    params: PostDataParams,
  ) => Promise<FactoryLogRawData | undefined>;
  isPreDataReady: boolean;
  isRawDataReady: boolean;
  rawData: FactoryLogRawData | null;
  isPostDataReady: boolean;
  departmentList: string[];
  isRequestMade: boolean;
  setIsRequestMade: React.Dispatch<React.SetStateAction<boolean>>;
  currentDepartment: string;
  setCurrentDepartment: React.Dispatch<React.SetStateAction<string>>;
};
