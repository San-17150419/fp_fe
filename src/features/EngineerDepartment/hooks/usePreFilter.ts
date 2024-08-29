import { useState, useEffect } from "react";
import { type Site, type FilterData, type FilterDataParams } from "../types";
import { createDictionary } from "../temp";
import axios, { CanceledError } from "axios";
import { v4 as uuidv4 } from "uuid";
// manage state in pre filter (sys, property, site)
// fetch filter data when state changes
// generate options for post filter
// generate dictionary for post filter
// TODO: Not sure yet. But I think I should ensure select in preFilter and combobox in postFilter are in sync. They should be rendered in the same time. So visually, they should appear in the same time. Not the first three is rendered first, then the rest show up.

type OptionDictionary = {
  [key: string]: { text: string; value: string; id: string };
};

export default function usePreFilter(sysDictionary: { [key: string]: string }) {
  const [sys, setSys] = useState("");
  const [property, setProperty] = useState("");
  const [site, setSite] = useState<Site | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [postFilterOptions, setPostFilterOptions] = useState<{
    snNumOptions: OptionDictionary;
    boardNameOptions: OptionDictionary;
    moldNumOptions: { text: string; value: string; id: string }[];
  }>({
    snNumOptions: {},
    boardNameOptions: {},
    moldNumOptions: [],
  });
  const [data, setData] = useState<{
    allData: {
      [key: string]: FilterData["data"][number];
    };
    moldNumToId: {
      [key: string]: Array<FilterData["data"][number]["sn_num"]>;
    };
    boardNameToId: {
      [key: string]: Array<FilterData["data"][number]["sn_num"]>;
    };
  }>({
    allData: {},
    moldNumToId: {},
    boardNameToId: {},
  });

  useEffect(() => {
    const api = import.meta.env.VITE_ENGINEER_DEPARTMENT_URL + "filter-data/";
    const params: FilterDataParams = {
      sys: sysDictionary[sys as keyof typeof sysDictionary] || "",
      property: property,
      site: site,
      mold_num: "",
      prod_name_board: "",
      sn_num: "",
    };
    const fetchFilterData = async (signal?: AbortSignal) => {
      setIsLoading(true);
      try {
        const response = await axios.post<FilterData>(api, params, {
          signal: signal,
        });

        const data = response.data.data;
        setData(createDictionary(data));

        const snNumOptions = (() => {
          const temp: {
            [key: string]: { text: string; value: string; id: string };
          } = {};
          data.forEach((d) => {
            if (!temp[d.sn_num]) {
              temp[d.sn_num] = {
                text: d.sn_num,
                value: d.sn_num,
                id: d.sn_num,
              };
            }
          });

          return temp;
        })();
        const boardNameOptions = (() => {
          const temp: {
            [key: string]: { text: string; value: string; id: string };
          } = {};
          data.forEach((d) => {
            if (!temp[d.sn_num]) {
              temp[d.sn_num] = {
                text: d.prod_name_board,
                value: d.prod_name_board,
                id: d.sn_num,
              };
            }
          });

          return temp;
        })();

        // The relationship between sn_num and bord_name is not 1 to 1. I might have two boards with the same name. (I will figure out how to deal with that.)
        // TODO：Fix this. A possible solution is create all three options at the same time. Instead of using sn_num to associate the options, use uuid to create a unique id that is shared by all three options. I am not sure this makes sense.
        const moldNumOptions = (() => {
          const temp = [
            ...new Set(
              data.map((d) => d.mold_num ?? "").filter((text) => text !== ""),
            ),
          ];
          //can't use sn_num as id here. It is not unique
          return temp.map((text) => ({
            text: text,
            value: text,
            id: uuidv4(),
          }));
        })();

        setPostFilterOptions({
          snNumOptions,
          boardNameOptions,
          moldNumOptions,
        });

        return response.data;
      } catch (error) {
        if (error instanceof CanceledError) {
          console.log("fetch aborted");

          return;
        }
      }
    };
    // Use setTimeout to introduce artificial delay
    // Use AbortController to cancel the request if needed
    // const control = new AbortController();
    // fetchFilterData(control.signal).then((response) => {
    //   console.log(response);
    //   setIsLoading(false);
    // });
    const control = new AbortController();
    fetchFilterData(control.signal).then(() => {
      setIsLoading(false);
    });
  }, [sys, property, site]);

  return { setSys, setProperty, setSite, data, isLoading, postFilterOptions };
}
