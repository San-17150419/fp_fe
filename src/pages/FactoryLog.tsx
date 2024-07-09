import React from "react";
import Table from "../Components/modd/Table/Table";
import TableContainer from "../Components/modd/Table/TableContainer";
import Department2 from "../Components/Department2";
import Department from "../Components/Department";
type RawEntry = {
  pl: string;
  sys: string;
  pamt: number;
  wt: number;
  cpamt: number;
  pamt_h: number;
  ar: number;
};

type DateRange = {
  date_start: string;
  date_end: string;
  raw: RawEntry[];
};

type DepartmentData = {
  dep: string;
  data: DateRange[];
};

type FormattedRow = {
  sys: string;
  [key: string]: any;
};

type FormattedData = {
  [key: string]: FormattedRow[];
};


const formatDataForTable = (rawData: DepartmentData[]): FormattedData[] => {
  const tableData: FormattedData[] = [];

  rawData.forEach((item) => {
    const { dep, data } = item;
    const depData: FormattedRow[] = [];

    data.forEach((dateRange) => {
      const { date_start, raw } = dateRange;

      raw.forEach((entry) => {
        const { sys, ar } = entry;

        let row = depData.find((r) => r.sys === sys);

        if (!row) {
          row = { sys };
          depData.push(row);
        }

        row[date_start] = ar;
      });
    });

    tableData.push({ [dep]: depData });
  });

  return tableData;
};

const data = formatDataForTable(dummyData);
console.log(data);
export default function FactoryLog() {
  return (
    <div className="flex w-full flex-col gap-4 border border-black">
      <section className="min-h-[100px] border border-black">
        {/* <Department data={[]} title="test" /> */}
      </section>
      <section className="min-h-[100px] border border-black"></section>
      <TableContainer>
        {data.map((d, i) => (
          <div className="flex flex-col gap-4 border border-black" key={i}>
            {Object.values(d).map((d) => {
              return <Table data={d} key={JSON.stringify(d)} />;
            })}
          </div>
        ))}
      </TableContainer>
    </div>
  );
}
