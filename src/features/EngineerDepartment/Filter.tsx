import { useState, useEffect, useMemo } from "react";
import axios, { CanceledError } from "axios";
import Select from "../../Components/modd/Select/Select";
import ComboBox from "./ComboBox";
import { FilterData, FilterDataParams, Site } from "./types";
import Loading from "../../Components/Loading";
import Table from "./Table";
import { v4 as uuidv4 } from "uuid";
// import VirtualizedTable from "./VirtualizedTable";

// https://github.com/radix-ui/primitives/issues/1634
import { useENGDepartmentContext } from "./store/ENGDepartmentContext";
import Select2 from "../../Components/modd/Select/Select2";

// TODO: Fix performance issues. Either memoize them or see if setTimeout is the culprit
// TODO: Combobox enhancement: It doesn't make sense to use fetched data to populate the options in combobox.  1. Fetching new data upon change might not be the best UX. Maybe only select should fecth data on change. 2. The auto suggestion in combobox should use data from the first fetched data. Theen use that data to restrict the options based on value from other comboboxes or select.

// TODO: Discuss over wether the filter component should fetch new data. If it already fetched all data when it first mounted, would't  it make more sense to simply filter the data in the table? Right now, the route I want is to fetch data on mount and then filter the data in the table. At the same time, limit the upper limit of how much rows can be shown in the table. Depend on the user requirement, I can add pagination. Because too much rows will slow down the app. If users don't really need to see all rows at once, it make more sense to add pagination, and avoid rendering all rows at once.
export default function Filter() {
  const { states, seriesOptions, siteOptions, factoryOptions } =
    useENGDepartmentContext();
  const sysDictionary = states.preData.series;

  const [sys, setSys] = useState("");
  const [sn_num, setSn_num] = useState("");
  const [prod_name_board, setProd_name_board] = useState("");
  const [mold_num, setMold_num] = useState("");
  const [property, setProperty] = useState("");
  const [site, setSite] = useState<Site | "">("");
  const [data, setData] = useState<FilterData["data"]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const api = import.meta.env.VITE_ENGINEER_DEPARTMENT_URL + "filter-data/";
    const params: FilterDataParams = {
      sys: sysDictionary[sys as keyof typeof sysDictionary] || "",
      sn_num: sn_num,
      prod_name_board: prod_name_board,
      mold_num: mold_num,
      property: property,
      site: site,
    };
    const fetchFilterData = async (signal?: AbortSignal) => {
      setIsLoading(true);
      try {
        const response = await axios.post<FilterData>(api, params, {
          signal: signal,
        });
        setData(response.data.data);
        return response.data;
        // setData(response.data.data);
        // setIsLoading(false);
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
    const timer = setTimeout(() => {
      const control = new AbortController();
      fetchFilterData(control.signal).then((response) => {
        setIsLoading(false);
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [sys, sn_num, prod_name_board, mold_num, property, site]);
  if (!states) return <Loading />;
  function generateFilterNameBoardOptions() {
    const temp = [
      ...new Set(
        data.map((d) => d.prod_name_board ?? "").filter((text) => text !== ""),
      ),
    ];
    return temp.map((text) => ({
      id: uuidv4(),
      value: text,
      text: text,
    }));
  }

  function generateFilterSn_numOptions() {
    const temp = [
      ...new Set(data.map((d) => d.sn_num ?? "").filter((text) => text !== "")),
    ];
    return temp.map((text) => ({
      id: uuidv4(),
      value: text,
      text: text,
    }));
  }

  function generateFilterMold_numOptions() {
    const temp = [
      ...new Set(
        data.map((d) => d.mold_num ?? "").filter((text) => text !== ""),
      ),
    ];
    return temp.map((text) => ({
      id: uuidv4(),
      value: text,
      text: text,
    }));
  }

  const memoizedMold_numOptions = useMemo(() => {
    return generateFilterMold_numOptions();
  }, [data]);

  const memoizedSn_numOptions = useMemo(() => {
    return generateFilterSn_numOptions();
  }, [data]);

  const memoizedResult = useMemo(() => {
    return generateFilterNameBoardOptions();
  }, [data]);

  const memoizedResult2 = useMemo(() => {
    return seriesOptions;
  }, [data]);

  return (
    <>
      <form
        action=""
        className="mb-8 flex flex-wrap gap-2 border-b border-black pb-12"
      >
        <div className="flex flex-1 basis-[150px] items-center gap-4">
          <Select2 options={memoizedResult2} name="series" onSelect={setSys} />
        </div>
        <div className="flex flex-1 basis-[150px] items-center gap-4">
          <ComboBox<String>
            options={memoizedSn_numOptions}
            onChange={(value) => setSn_num(value.text)}
            name="模具唯一碼"
          />
        </div>
        <div className="flex flex-1 basis-[150px] items-center gap-4">
          <ComboBox<String>
            options={memoizedResult}
            onChange={(value) => setProd_name_board(value.text)}
            name="名版"
          />
        </div>
        <div className="flex flex-1 basis-[150px] items-center gap-4">
          <ComboBox<String>
            options={memoizedMold_numOptions}
            onChange={(value) => setMold_num(value.text)}
            name="模號"
          />
        </div>
        <div className="flex flex-1 basis-[150px] items-center gap-4">
          <Select
            options={factoryOptions}
            name="factory"
            onSelect={setProperty}
            placeholder="財產歸屬"
          />
        </div>
        <div className="flex flex-1 basis-[150px] items-center gap-4">
          <Select
            options={siteOptions}
            name="site"
            onSelect={(option: string) => setSite(option as Site)}
            placeholder="位置"
          />
        </div>
      </form>

      <div className="flex w-full flex-col gap-1">
        {data ? <Table data={data} isLoading={isLoading} /> : <Loading />}
      </div>
    </>
  );
}
