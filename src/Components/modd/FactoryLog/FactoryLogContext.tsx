import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

import axios from "axios";

type Option = {
  text: string;
  value: string;
};

type FactoryLogPreData = {
  factory: Option[];
  point: Option[];
  dateType: Option[];
  dep: { [key: string]: Option[] };
};

type LogData = {
  dep: string;
  data: Array<{
    date_start: string;
    date_end: string;
    raw: Array<{ [key: string]: number }>;
  }>;
};

type RawData = {
  post: {
    factory: string;
    point: string;
    date_type: string;
    date_start: string;
  };
  dep: string[];
  duration: Array<{ date_start: string; date_end: string }>;
  data: LogData[];
};

type FactoryLogDataContextType = {
  preData: FactoryLogPreData;
  rawData: RawData | null;
  fetchRawData: (params: {
    factory: string;
    date_type: string;
    date_start: string;
    point: string;
  }) => Promise<void>;
  setRawData: React.Dispatch<React.SetStateAction<RawData | null>>;
  isPreDataLoading: boolean;
  isRawDataLoading: boolean;
};

const FactoryLogDataContext = createContext<FactoryLogDataContextType | null>(
  null,
);

export const useFactoryLogDataContext = () => {
  const context = useContext(FactoryLogDataContext);
  if (context === null) {
    throw new Error(
      "useFactoryLogDataContext must be used within a FactoryLogDataProvider",
    );
  }
  return context;
};

export const FactoryLogDataContextProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [preData, setPreData] = useState<FactoryLogPreData>({
    factory: [],
    point: [],
    dateType: [],
    dep: {},
  });
  const [isPreDataLoading, setIsPreDataLoading] = useState(true);
  const [rawData, setRawData] = useState<RawData | null>(null);
  const [isRawDataLoading, setIsRawDataLoading] = useState(true);

  useEffect(() => {
    const fetchPreData = async () => {
      try {
        const response = await axios.get(
          "http://192.168.123.240:9000/api/fj/pre-data/",
        );
        const data = response.data.preData;
        console.log(data);
        setPreData({
          factory: Object.entries(data.factory).map(
            ([value, text]): Option => ({ value, text: text as string }),
          ),
          point: Object.entries(data.point).map(
            ([value, text]): Option => ({ value, text: text as string }),
          ),
          dateType: Object.entries(data.date_type).map(
            ([value, text]): Option => ({ value, text: text as string }),
          ),
          dep: Object.entries(data.dep).reduce(
            (acc, [factory, deps]) => {
              acc[factory] = Object.entries(
                deps as { [key: string]: string },
              ).map(([value, text]) => ({ value, text }));
              return acc;
            },
            {} as { [key: string]: Option[] },
          ),
        });
        setIsPreDataLoading(false);
      } catch (error) {
        console.error("Failed to fetch preData", error);
      }
    };

    fetchPreData();
  }, []);

  const fetchRawData = async (params: {
    factory: string;
    date_type: string;
    date_start: string;
  }) => {
    try {
      const response = await axios.post(
        "http://192.168.123.240:9000/api/fj/raw-data/",
        {
          ...params,
        },
      );

      console.log(response.data);
      setRawData(response.data);
      setIsRawDataLoading(false);
    } catch (error) {
      console.error("Failed to fetch raw data", error);
    }
  };

  return (
    <FactoryLogDataContext.Provider
      value={{
        isPreDataLoading,
        preData,
        rawData,
        fetchRawData,
        setRawData,
        isRawDataLoading,
      }}
    >
      {children}
    </FactoryLogDataContext.Provider>
  );
};
