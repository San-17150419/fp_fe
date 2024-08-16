import axios from "axios";
import { type Duration, type Factory } from "../types";

type DownloadExcelParams = {
  factory: Factory;
  duration: Duration[];
};

// request data and return blob
const requestExcelFileData = async (
  url: string,
  params: DownloadExcelParams,
): Promise<Blob | undefined> => {
  try {
    const response = await axios.post(
      url,
      { ...params },
      {
        responseType: "blob",
      },
    );
    return new Blob([response.data]);
  } catch (error) {
    console.error(error);
  }
};

export const downloadExcelFile = async (
  url: string,
  params: DownloadExcelParams,
  filename: string,
) => {
  const blob = await requestExcelFileData(url, params);
  if (!blob) return;
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = `${filename}.xlsx`;
//   document.body.appendChild(link);
  link.click();
};
