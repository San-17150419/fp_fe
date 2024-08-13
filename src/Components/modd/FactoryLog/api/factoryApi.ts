import axios, { type AxiosProgressEvent } from "axios";
import {
  type FactoryLogRawData,
  type PostDataParams,
} from "../types/factoryLogDataType";

const factoryLogURL = process.env.FACTORY_LOG_URL as string;

const onDownloadProgress = (progressEvent: AxiosProgressEvent) => {
  if (!progressEvent.total) return;
  const percentCompleted = Math.round(
    (progressEvent.loaded * 100) / progressEvent.total,
  );
  console.log(percentCompleted);
};

export const fetchFactoryLogRawData = async (
  url: string = factoryLogURL + "raw-data/",
  params: PostDataParams,
): Promise<FactoryLogRawData | undefined> => {
  try {
    const response = await axios.post<FactoryLogRawData>(url, params, {
      onDownloadProgress: onDownloadProgress,
    });

    return response.data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
