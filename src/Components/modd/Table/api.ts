import axios, { AxiosResponse, AxiosError } from "axios";
import { ResponseTableData, Data } from "./type";

const API_URL = "http://192.168.123.240:9000/api/modd/data-table";

interface FetchResult {
  data: Data[] | null;
  error: string | null;
}

export const getTableData = async (): Promise<FetchResult> => {
  try {
    const response: AxiosResponse<ResponseTableData> = await axios.get(API_URL);
    console.log("From api.ts: getTableData");
    console.log(response)
    console.log(response.data);
console.log('data receive ')
    return { data: response.data.demoData, error: null };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error fetching data:", error.message);
      return { data: null, error: error.message };
    } else {
      console.error("Unexpected error fetching data:", error);
      return { data: null, error: "Unexpected error occurred" };
    }
  }
};
