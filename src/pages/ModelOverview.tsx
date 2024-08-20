import { useEffect, useState } from "react";
import axios from "axios";
import Table from "../features/EngineerDepartment/Table";
export default function ModelOverview() {
  // TODO: Refactor FactoryLogFilter to make it reusable. I should consider using compound component pattern. In that way, you don't need to pre-define the number of select or input. May I need a small context
  //   TODO:Autocomplete input https://www.w3schools.com/howto/howto_js_autocomplete.asp (Do not use datalist. It is not supported in many browsers. )
  const [states, setStates] = useState(null);
  const [data, setData] = useState(null);
  useEffect(() => {
    const api = import.meta.env.VITE_ENGINEER_DEPARTMENT_URL + "pre-data";
    try {
      const response = axios.get(api).then((response) => {
        console.log(response);
        const data = response.data.preData;
        console.log(typeof data);
        console.log(response.data.preData);
        setStates(data);
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }, []);
  const header: { [key: string]: string }[] = [
    { sn_num: "模具唯一碼" },
    { sys: "系列" },
    { property: "財產歸屬" },
    { site: "模具位置" },
    { brand: "品牌" },
    { prod_name_board: "名板" },
    { state: "模具狀態" },
    { prod_name_nocolor: "定義品名" },
    { mold_num: "模號" },
    { hole_num: "模穴數" },
    { block_num: "塞穴數" },
    { dutydate_month: "開模日期" },
    { dutydate_last: "最後上機" },
    { maker: "製造商" },
    { pnb_state: "名板狀態" },
    // { spare: "備註" },
    { id_ms: "資料表id" },
  ];
  useEffect(() => {
    const api = import.meta.env.VITE_ENGINEER_DEPARTMENT_URL + "filter-data/";
    const testParams = {
      sys: "",
      sn_num: "",
      prod_name_board: "",
      mold_num: "",
      property: "",
      site: "",
    };

    try {
      const response = axios
        .post(api, testParams)
        .then((response) => {
          console.log(response);
          const data = response.data.data;
          console.log(typeof data);
          console.log(response.data.preData);
          setData(data);
          console.log(data);
        })
        .catch((error) => {
          console.log(error.response.data);
          console.error(error);
        });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <div>
      {/* {data && <Table data={data} header={Object.keys(data[0])} />} */}
      {data && states && <Table data={data} header={header} />}
    </div>
  );
}
