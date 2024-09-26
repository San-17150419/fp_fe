import { useState } from "react";
import { type Site, type FilterData, type Sys } from "../types";
import { createDictionary } from "../utils/createDictionary";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { type Option } from "../../../Components/modd/Select/Select";
// manage state in pre filter (sys, property, site)
// fetch filter data when state changes
// generate options for post filter
// generate dictionary for post filter
// TODO: Not sure yet. But I think I should ensure select in preFilter and combobox in postFilter are in sync. They should be rendered in the same time. So visually, they should appear in the same time. Not the first three is rendered first, then the rest show up.

export type OptionDictionary = Record<string, Option<string>>;

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
  const { data, isPending } = useQuery({
    queryKey: ["preFilterData", params],
    queryFn: async () => {
      const api = import.meta.env.VITE_ENGINEER_DEPARTMENT_URL + "filter-data/";
      const response = await axios.post<FilterData>(api, params);
      return response.data;
    },
    select: (data) => {
      const generateOptions = (
        key: keyof FilterData["data"][number],
      ): OptionDictionary => {
        const options: Record<string, Option<string>> = {};
        data?.data.forEach((d) => {
          options[d.sn_num] = {
            text: d[key] || "",
            value: d[key] || "",
            id: d.sn_num,
          } as Option<string>;
        });
        return options;
      };

      const memoizedOptions = {
        snNumOptions: generateOptions("sn_num"),
        moldNumOptions: generateOptions("mold_num"),
        boardNameOptions: generateOptions("prod_name_board"),
      };

      const memoizedProcessedData = createDictionary(data.data);

      return {
        data: memoizedProcessedData,
        postFilterOptions: memoizedOptions,
      };
    },
  });

  return {
    sys,
    setSys,
    property,
    setProperty,
    site,
    setSite,
    data: data?.data,
    isPending,
    postFilterOptions: data?.postFilterOptions,
  };
}
