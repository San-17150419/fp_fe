import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";
import {
  FactoryLogPreData,
  PostDataParams,
  FactoryLogRawData,
  FactoryLogContextType,
  FormattedData,
  PreData,
  RawData,
} from "./FactoryLogDataType";
import { formatFactoryLogData, transformData } from "./formatFactoryData";

const FactoryLogContext = createContext<FactoryLogContextType | null>(null);

export const useFactoryLogContext = () => {
  const context = useContext(FactoryLogContext);
  if (context === null) {
    throw new Error(
      "useFactoryLogContext must be used within a FactoryLogContextProvider",
    );
  }
  return context;
};

export const FactoryLogContextProvider: React.FC<{
  children: ReactNode;
  preDataUrl?: string;
  rawDataUrl?: string;
}> = ({
  children,
  preDataUrl = "http://192.168.123.240:9000/api/fj/pre-data/",
  rawDataUrl = "http://192.168.123.240:9000/api/fj/raw-data/",
}) => {
  const [rawData, setRawData] = useState<FactoryLogRawData | null>(null);
  const [preData, setPreData] = useState<FactoryLogPreData["preData"] | null>(
    null,
  );

  const [isPreDataReady, setIsPreDataReady] = useState(false);
  // After request is made, the FactoryLogPostFilter will be rendered
  const [isRequestMade, setIsRequestMade] = useState(false);

  // I have not decided where to process the raw data
  // Two questions. First is whether I need the raw data for the chart.
  const [isPostDataReady, setIsPostDataReady] = useState(false);
  const [tableData, setTableData] = useState<FormattedData | null>(null);
  const [duration, setDuration] = useState<
    Array<{ date_start: string; date_end: string }>
  >([]);
  const [isTableDataReady, setIsTableDataReady] = useState(false);

  const [postData, setPostData] = useState<Record<string, any>>({});
  useEffect(() => {
    const fetchPreData = async () => {
      try {
        const response = await axios.get<FactoryLogPreData>(preDataUrl);
        const data = response.data;
        const { factory, point, date_type, dep } = data.preData;
        setPreData({ factory, point, date_type, dep });
        setIsPreDataReady(true);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPreData();
  }, [preDataUrl]);

  const fetchRawData: (
    params: PostDataParams,
  ) => Promise<FactoryLogRawData | undefined> = async ({
    factory,
    date_type,
    date_start,
  }) => {
    setIsRequestMade(true);
    setIsPostDataReady(false);
    setIsTableDataReady(false);
    try {
      const response = await axios.post<FactoryLogRawData>(rawDataUrl, {
        factory,
        date_type,
        date_start,
      });
      const data = response.data;
      setDuration(data.duration);
      setRawData(data);
      console.log(data);
      const postData = transformData(response.data.data);
      setPostData(postData);
      setIsPostDataReady(true);
      setTableData(formatFactoryLogData(data));
      setIsTableDataReady(true);

      return data;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FactoryLogContext.Provider
      value={{
        preData,
        fetchRawData,
        isPreDataReady,
        isRequestMade,
        setIsRequestMade,
        postData,
        tableData,
        isTableDataReady,
        duration,
      }}
    >
      {children}
    </FactoryLogContext.Provider>
  );
};
