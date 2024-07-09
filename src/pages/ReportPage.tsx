import React from "react";
import PreDataFilter from "../Components/modd/FactoryLog/PreDataFilter";
import RawDataFilter from "../Components/modd/FactoryLog/RawDataFilter";
import TableContainer from "../Components/modd/Table/TableContainer";
import { fetchData, formatData } from "../Components/modd/FactoryLog/test";
import { useFactoryLogDataContext } from "../Components/modd/FactoryLog/FactoryLogContext";
import FactoryLogTable from "../Components/modd/Table/FactoryLogTable";


export default function ReportPage() {
  const data = formatData(fetchData);
  const { rawData } = useFactoryLogDataContext();
  return (
    <div className="flex w-full flex-col border border-black">
      <section>
        <PreDataFilter />
      </section>
      <section className="grid grid-cols-4 gap-5">
        <RawDataFilter />
      </section>
      {/* <TableContainer>
        {Object.entries(data.GD.INJ.ar).map(([key, value]) => {
          return (
            <div key={key} className="grid grid-cols-4">
              {value.map((v, i) => (
                <div key={i}>{v}</div>
              ))}
            </div>
          );
        })}
      </TableContainer> */}
      <TableContainer>
        <FactoryLogTable />
      </TableContainer>
    </div>
  );
}
