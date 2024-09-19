import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Maker, MoldStatus, Property, Site, Sys, type PreData } from "../types";
import { type Option } from "../../../Components/modd/Select/Select";
const api = import.meta.env.VITE_ENGINEER_DEPARTMENT_URL + "pre-data/";
import { createEngineerFilterOptions } from "../utils/generateOptions";

export default function useENGDepartmentPreData() {
  const { error, data, isPending } = useQuery<PreFilterData>({
    queryKey: ["ENGDPreData"],
    queryFn: async () => {
      const response = await axios.get<PreData>(api);
      return {
        states: response.data,
        ...createEngineerFilterOptions(response.data.preData),
      };
    },
  });

  if (isPending || !data) return { isPending: true, error: null, data: null };
  if (error) return { isPending: false, error, data: null };

  return { isPending: false, error: null, data };

  //   return {
  //     isPending,
  //     isLoading,
  //     error,
  //     data: data,
  //   };
}

export type PreFilterData = {
  makerOptions: Option<Maker["list_id"]>[];
  seriesOptions: Option<Sys>[];
  siteOptions: Option<Site>[];
  propertyOptions: Option<Property>[];
  statusOptions: Option<MoldStatus>[];
  states: PreData;
};
