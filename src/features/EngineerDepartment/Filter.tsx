import { useState, useEffect } from "react";
import axios, { CanceledError } from "axios";
import Select from "../../Components/modd/Select/Select";
import {
  ENGDepartmentPreData,
  ENGDepartmentFilterData,
} from "./EngineerDepartmentTypes";
import Loading from "../../Components/Loading";
import Table from "./Table";
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
  // { spare: "備註" },
  // { id_ms: "資料表id" },
];
type FilterProps = {
  preData: ENGDepartmentPreData["preData"];
  sysDictionary: Record<string, string>;
};
export default function Filter({ preData, sysDictionary }: FilterProps) {
  const seriesOptions = Object.keys(preData.series).map((key) => ({
    value: key,
    text: preData.series[key as keyof typeof preData.series],
  }));

  const siteOptions = preData.site.map((key) => ({
    value: key,
    text: key,
  }));

  const factoryOptions = Object.keys(preData.factory).map((key) => ({
    value: key,
    text: preData.factory[key as keyof typeof preData.factory],
  }));

  const [sys, setSys] = useState("");
  const [sn_num, setSn_num] = useState("");
  const [prod_name_board, setProd_name_board] = useState("");
  const [mold_num, setMold_num] = useState("");
  const [property, setProperty] = useState("");
  const [site, setSite] = useState("");
  const [data, setData] = useState<
    { [key: string]: number | string | undefined }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const api = import.meta.env.VITE_ENGINEER_DEPARTMENT_URL + "filter-data/";
    const params = {
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
        const response = await axios.post<ENGDepartmentFilterData>(
          api,
          params,
          {
            signal: signal,
          },
        );
        setData(response.data.data);
        // setIsLoading(false);
      } catch (error) {
        if (error instanceof CanceledError) {
          console.log("fetch aborted");
          //   setIsLoading(false);

          return;
        }
      }
    };
    // Use setTimeout to introduce artificial delay
    //
    const timer = setTimeout(() => {
      const control = new AbortController();
      fetchFilterData(control.signal).then(() => {
        setIsLoading(false);
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [sys, sn_num, prod_name_board, mold_num, property, site]);
  if (!preData) return <Loading />;
  return (
    <>
      <form action="" className="flex gap-2">
        <div className="flex grow items-center gap-2">
          <div className="grow basis-1">
            <Select
              options={seriesOptions}
              name="series"
              onSelect={setSys}
              placeholder="全部系列"
            />
          </div>
          <div className="grow basis-1">
            <input
              className="h-9 w-full rounded-md border border-gray-300 pl-3 shadow shadow-gray-300"
              type="text"
              placeholder="模具唯一碼"
              onChange={(e) => setSn_num(e.target.value)}
            />
          </div>
          <div className="grow basis-1">
            <input
              className="h-9 w-full rounded-md border border-gray-300 pl-3 shadow shadow-gray-300"
              type="text"
              placeholder="名版"
              onChange={(e) => setProd_name_board(e.target.value)}
            />
          </div>
          <div className="grow basis-1">
            <input
              className="h-9 w-full rounded-md border border-gray-300 pl-3 shadow shadow-gray-300"
              type="text"
              placeholder="模號"
              onChange={(e) => setMold_num(e.target.value)}
            />
          </div>
          <div className="grow basis-1">
            <Select
              options={factoryOptions}
              name="factory"
              onSelect={setProperty}
              placeholder="財產歸屬"
            />
          </div>
          <div className="grow basis-1">
            <Select
              options={siteOptions}
              name="site"
              onSelect={setSite}
              placeholder="位置"
            />
          </div>
        </div>
      </form>
      {data ? (
        <Table data={data} header={header} isLoading={isLoading} />
      ) : (
        <Loading />
      )}
    </>
  );
}
