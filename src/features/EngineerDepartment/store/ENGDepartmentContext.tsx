import { useState, useContext, createContext, useEffect } from "react";
import { type PreData } from "../types";
import axios from "axios";
import { createEngineerFilterOptions } from "../utils/generateOptions";
// import { type SelectOption } from "../../../Components/modd/Select/selectType";
// import { set } from "date-fns";

type Option = {
  text: string;
  value: string;
  id: string;
};
type ENGDepartmentContextValue = {
  states: PreData;
  makerOptions: Option[];
  seriesOptions: Option[];
  siteOptions: Option[];
  factoryOptions: Option[];
  isLoading: boolean;
} | null;
const ENGDepartmentContext = createContext<ENGDepartmentContextValue | null>(
  null,
);

const initialPreData: PreData = {
  preData: {
    factory: {},
    maker: [],
    series: {},
    site: [],
    status: [],
  },
};

export const useENGDepartmentContext = () => {
  const context = useContext(ENGDepartmentContext);
  if (!context) {
    throw new Error(
      "useENGDepartmentContext must be used within a ENGDepartmentProvider",
    );
  }
  return context;
};

export const ENGDepartmentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [states, setStates] = useState<PreData>(initialPreData);
  const [makerOptions, setMakerOptions] = useState<Option[]>([]);
  const [seriesOptions, setSeriesOptions] = useState<Option[]>([]);
  const [siteOptions, setSiteOptions] = useState<Option[]>([]);
  const [factoryOptions, setFactoryOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const api = import.meta.env.VITE_ENGINEER_DEPARTMENT_URL + "pre-data/";
    const fetchPreData = async () => {
      try {
        const response = await axios.get<PreData>(api);
        const data = response.data;
        setStates(data);
        const { makerOptions, seriesOptions, siteOptions, factoryOptions } =
          createEngineerFilterOptions(data.preData);
        setFactoryOptions(factoryOptions);
        setMakerOptions(makerOptions);
        setSeriesOptions(seriesOptions);
        setSiteOptions(siteOptions);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPreData().finally(() => {
      setIsLoading(false);
    });
  }, []);

  // This check is needed. Otherwise, it will throw an error saying that useENGDepartmentContext must be used within a ENGDepartmentProvider, even though it is inside the ENGDepartmentProvider. I don't remember having this issue before.
  // const preData = states?.preData;
  // const { makerOptions, seriesOptions, siteOptions, factoryOptions } = useMemo(
  //   () => generateOptions(preData),
  //   [preData],
  // );
  return (
    <ENGDepartmentContext.Provider
      value={{
        states,
        makerOptions,
        seriesOptions,
        siteOptions,
        factoryOptions,
        isLoading,
      }}
    >
      {children}
    </ENGDepartmentContext.Provider>
  );
};

export default ENGDepartmentContext;
