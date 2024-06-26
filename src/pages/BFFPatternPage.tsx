import React from "react";
import { getTableData } from "../Components/modd/Table/api";
import TableFetcher from "../Components/modd/Table/TableFetcher";

export default function BFFPatternPage() {
  return <TableFetcher fetchData={getTableData}></TableFetcher>;
}
