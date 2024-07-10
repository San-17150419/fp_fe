import {
  createContext,
  useContext,
  useEffect,
  useState,
  useReducer,
  ReactNode,
} from "react";
import axios from "axios";
import {
  FactoryLogPreData,
  PostDataParams,
  FactoryLogRawData,
  FactoryLogContextType,
} from "./FactoryLogDataType";

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
  const [preData, setPreData] = useState<FactoryLogPreData["preData"]>({
    factory: [],
    point: [],
    date_type: [],
    dep: {},
  });

  const [isPreDataReady, setIsPreDataReady] = useState(false);
  // After request is made, the FactoryLogPostFilter will be rendered
  const [isRequestMade, setIsRequestMade] = useState(false);
  // I have not decided where to process the raw data
  // Two questions. First is whether I need the raw data for the chart.
  const [isRawDataReady, setIsRawDataReady] = useState(false);
  const [isPostDataReady, setIsPostDataReady] = useState(false);
  const [departmentList, setDepartmentList] = useState<string[]>([]);
  const [currentDepartment, setCurrentDepartment] = useState<string>(
    departmentList[0],
  );
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
    try {
      const response = await axios.post<FactoryLogRawData>(rawDataUrl, {
        factory,
        date_type,
        date_start,
      });
      const data = response.data;
      setRawData(data);
      setIsRawDataReady(true);
      console.log(data.dep);
      setDepartmentList(data.dep);
      setIsPostDataReady(true);
      console.log(data);
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
        rawData,
        isRawDataReady,
        isPostDataReady,
        departmentList,
        isRequestMade,
        setIsRequestMade,
        currentDepartment,
        setCurrentDepartment,
      }}
    >
      {children}
    </FactoryLogContext.Provider>
  );
};
