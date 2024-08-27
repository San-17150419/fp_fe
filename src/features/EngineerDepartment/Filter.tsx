import { useState, useEffect, useMemo } from "react";
import axios, { CanceledError } from "axios";
import Select from "../../Components/modd/Select/Select";
import ComboBox from "./ComboBox";
import { PreData, FilterData, FilterDataParams, Site } from "./types";
import Loading from "../../Components/Loading";
import Table from "./Table";
import { v4 as uuidv4 } from "uuid";
import VirtualizedTable from "./VirtualizedTable";
import VirtualizedTable2 from "./VirtualizedTable2";
const header: Record<string, string>[] = [
  { sn_num: "唯一碼" },
  { sys: "系列" },
  { property: "財產歸屬" },
  { site: "位置" },
  { brand: "品牌" },
  { prod_name_board: "名板" },
  { pnb_state: "名板狀態" },
  { prod_name_nocolor: "定義品名" },
  { mold_num: "模號" },
  { hole_num: "模穴數" },
  { block_num: "塞穴數" },
  { dutydate_month: "開模日期" },
  { dutydate_last: "最後上機" },
  { maker: "廠商代號" },
  { state: "狀態" },
  { spare: "備註" },
  { id_ms: "資料表id" },
];
type FilterProps = {
  preData: PreData["preData"];
  sysDictionary: Record<string, string>;
};
// TODO: Fix performance issues. Either memoize them or see if setTimeout is the culprit
export default function Filter({ preData, sysDictionary }: FilterProps) {
  const memoizedSeriesOptions = useMemo(() => {
    return Object.keys(preData.series).map((key) => ({
      value: key,
      text: preData.series[key as keyof typeof preData.series],
    }));
  }, [preData.series]);

  const memoizedSiteOptions = useMemo(() => {
    return preData.site.map((key) => ({
      value: key,
      text: key,
    }));
  }, [preData.site]);

  const memoizedFactoryOptions = useMemo(() => {
    return Object.keys(preData.factory).map((key) => ({
      value: key,
      text: preData.factory[key as keyof typeof preData.factory],
    }));
  }, [preData.factory]);

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
    const timer = setTimeout(() => {
      const control = new AbortController();
      fetchFilterData(control.signal).then(() => {
        setIsLoading(false);
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [sys, sn_num, prod_name_board, mold_num, property, site]);
  if (!preData) return <Loading />;
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
  return (
    <>
      <form action="" className="mb-8 flex gap-2 border-b border-black pb-12">
        <div className="flex grow items-center gap-2">
          <div className="grow basis-1">
            <Select
              options={memoizedSeriesOptions}
              name="series"
              onSelect={setSys}
              placeholder="全部系列"
            />
          </div>
          <div className="grow basis-1">
            <ComboBox<String>
              options={memoizedSn_numOptions}
              onChange={(value) => setSn_num(value.text)}
              name="模具唯一碼"
            />
          </div>
          <div className="grow basis-1">
            <ComboBox<String>
              options={memoizedResult}
              onChange={(value) => setProd_name_board(value.text)}
              name="名版"
            />
          </div>
          <div className="grow basis-1">
            <ComboBox<String>
              options={memoizedMold_numOptions}
              onChange={(value) => setMold_num(value.text)}
              name="模號"
            />
          </div>
          <div className="grow basis-1">
            <Select
              options={memoizedFactoryOptions}
              name="factory"
              onSelect={setProperty}
              placeholder="財產歸屬"
            />
          </div>
          <div className="grow basis-1">
            <Select
              options={memoizedSiteOptions}
              name="site"
              onSelect={(option: string) => setSite(option as Site)}
              placeholder="位置"
            />
          </div>
        </div>
      </form>
      <div className="flex w-full flex-col gap-12">
        {data ? (
          <Table data={data} header={header} isLoading={isLoading} />
        ) : (
          <Loading />
        )}
        {data ? (
          <div className="w-full overflow-auto">
            <VirtualizedTable
              data={data}
              header={header}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <Loading />
        )}
        {data ? (
          <VirtualizedTable2
            data={data}
            header={header}
            isLoading={isLoading}
          />
        ) : (
          <Loading />
        )}
      </div>
    </>
  );
}
