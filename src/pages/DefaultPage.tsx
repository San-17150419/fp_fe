import React from "react";
import Input from "../Components/modd/Input/Input";
import Table from "../Components/modd/Table/TableFetcher";
import { getTableData } from "../Components/modd/Table/api";

import Select from "../Components/modd/Select/Select";
export default function DefaultPage() {
  return (
    <>
      <section className="flex w-full">
        <Select options={["資料庫檢索及更新", "新增模具"]} />
        <Select options={["資料庫檢索及更新", "新增模具"]} />
      </section>
      <section className="flex w-full flex-wrap">
        <Select
          width="180"
          options={[
            "全部系列",
            "P系列",
            "PA系列",
            "PC系列",
            "CE系列",
            "特殊系列",
            "雙色系列",
            "配件",
            "臨時模具",
          ]}
        />
        <Input name="名版" width="180" placeholder="名版" />
        <Input name="模號" width="180" placeholder="模號" />
        <Select options={["財產歸屬", "國登場", "斗六場", "金筆場"]} />
        <Select options={["GD", "HP", "DL", "D08", "停用"]} />
      </section>
      <section className="w-full overflow-hidden">
        <Table fetchData={getTableData} />
      </section>
    </>
  );
}
