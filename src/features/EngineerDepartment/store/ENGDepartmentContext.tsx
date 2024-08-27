import { useState, useContext, createContext, useEffect, useMemo } from "react";
import { type PreData } from "../types";
import axios from "axios";
import { generateOptions } from "../utils/generateOptions";
import { type SelectOption } from "../../../Components/modd/Select/selectType";

type ENGDepartmentContextValue = {
  states: PreData;
  makerOptions: SelectOption[];
  seriesOptions: SelectOption[];
  siteOptions: SelectOption[];
  factoryOptions: SelectOption[];
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
  useEffect(() => {
    const api = import.meta.env.VITE_ENGINEER_DEPARTMENT_URL + "pre-data/";
    const fetchPreData = async () => {
      try {
        const response = await axios.get<PreData>(api);
        const data = response.data;
        setStates(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPreData();
  }, []);

  // This check is needed. Otherwise, it will throw an error saying that useENGDepartmentContext must be used within a ENGDepartmentProvider, even though it is inside the ENGDepartmentProvider. I don't remember having this issue before.
  const preData = states?.preData;
  const { makerOptions, seriesOptions, siteOptions, factoryOptions } = useMemo(
    () => generateOptions(preData),
    [preData],
  );
  return (
    <ENGDepartmentContext.Provider
      value={{
        states,
        makerOptions,
        seriesOptions,
        siteOptions,
        factoryOptions,
      }}
    >
      {children}
    </ENGDepartmentContext.Provider>
  );
};

export default ENGDepartmentContext;
