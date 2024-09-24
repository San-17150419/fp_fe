import { useState, useMemo } from "react";
import { type Site, type FilterData, type Sys } from "../types";
import { createDictionary } from "../utils/createDictionary";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
// manage state in pre filter (sys, property, site)
// fetch filter data when state changes
// generate options for post filter
// generate dictionary for post filter
// TODO: Not sure yet. But I think I should ensure select in preFilter and combobox in postFilter are in sync. They should be rendered in the same time. So visually, they should appear in the same time. Not the first three is rendered first, then the rest show up.

export default function usePreFilter() {
  const [sys, setSys] = useState<Sys | "">("");
  const [property, setProperty] = useState<string>("");
  const [site, setSite] = useState<Site | "">("");

  const params = {
    sys,
    property,
    site,
    mold_num: "",
    prod_name_board: "",
    sn_num: "",
  };
  // Use React Query's useQuery to fetch data and cache it
  const { data, isLoading } = useQuery({
    queryKey: ["preFilterData", params],
    queryFn: async () => {
      const api = import.meta.env.VITE_ENGINEER_DEPARTMENT_URL + "filter-data/";
      const response = await axios.post<FilterData>(api, params);
      return response.data;
    },
  });

  const memoizedBoardNameOptions = useMemo(() => {
    const temp: {
      [key: string]: { text: string; value: string; id: string };
    } = {};
    data?.data.forEach((d) => {
      if (!temp[d.sn_num]) {
        temp[d.sn_num] = {
          text: d.prod_name_board,
          value: d.prod_name_board,
          id: d.sn_num,
        };
      }
    });
    return temp;
  }, [data]);

  const memoizedMoldNumOptions = useMemo(() => {
    const temp: {
      [key: string]: { text: string; value: string; id: string };
    } = {};
    data?.data.forEach((d) => {
      if (!temp[d.sn_num]) {
        temp[d.sn_num] = {
          text: d.mold_num,
          value: d.mold_num,
          id: d.sn_num,
        };
      }
    });
    return temp;
  }, [data]);

  const memoizedSnNumOptions = useMemo(() => {
    const temp: {
      [key: string]: { text: string; value: string; id: string };
    } = {};
    data?.data.forEach((d) => {
      if (!temp[d.sn_num]) {
        temp[d.sn_num] = {
          text: d.sn_num,
          value: d.sn_num,
          id: d.sn_num,
        };
      }
    });
    return temp;
  }, [data]);

  const memoizedProcessedData = useMemo(() => {
    return createDictionary(data?.data || []);
  }, [data]);

  return {
    sys,
    setSys,
    property,
    setProperty,
    site,
    setSite,
    data: memoizedProcessedData,
    isLoading,
    postFilterOptions: {
      snNumOptions: memoizedSnNumOptions,
      moldNumOptions: memoizedMoldNumOptions,
      boardNameOptions: memoizedBoardNameOptions,
    },
  };
}
