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
  propertyOptions: Option[];
  isLoading: boolean;
  statusOptions: Option[];
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
  const [propertyOptions, setPropertyOptions] = useState<Option[]>([]);
  const [statusOptions, setStatusOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const api = import.meta.env.VITE_ENGINEER_DEPARTMENT_URL + "pre-data/";
    const fetchPreData = async () => {
      try {
        const response = await axios.get<PreData>(api);
        const data = response.data;
        setStates(data);
        const {
          makerOptions,
          statusOptions,
          seriesOptions,
          siteOptions,
          propertyOptions,
        } = createEngineerFilterOptions(data.preData);
        setStatusOptions(statusOptions);
        setPropertyOptions(propertyOptions);
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


  return (
    <ENGDepartmentContext.Provider
      value={{
        states,
        statusOptions,
        makerOptions,
        seriesOptions,
        siteOptions,
        propertyOptions,
        isLoading,
      }}
    >
      {children}
    </ENGDepartmentContext.Provider>
  );
};

export default ENGDepartmentContext;
