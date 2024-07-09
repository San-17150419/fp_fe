import { useEffect, useRef, useState } from "react";
import Td from "./TableTd";
import Loading from "../../../pages/Loading";
import { dummyData, formatDataForTable } from "../FactoryLog/format";
import { SimpleObject } from "./type";
const Th = ({ children }: { key?: string; children?: React.ReactNode }) => (
  <th className="text-nowrap border border-gray-400 p-3">{children}</th>
);

type TableProps = {
  children?: React.ReactNode;
};

const data = formatDataForTable(dummyData);

function FactoryLogTable() {
  const [tableData, setTableData] = useState(data);
  const target = useRef(null);

  useEffect(() => {
    if (Array.isArray(data)) {
      setTableData(data);
    }
  }, [data]);

  if (!Array.isArray(tableData) || tableData.length === 0) {
    return <Loading />;
  }

  return (
    <table
      ref={target}
      className="relative w-full table-auto border-separate border-spacing-0 align-middle"
    >
      <thead className="sticky top-0 bg-gray-300">
        <tr className="border border-gray-400 p-2">
          <Th>#</Th>
          {Object.keys(tableData[0]).map((key) => (
            <Th key={key}>{key}</Th>
          ))}
        </tr>
      </thead>
      <tbody>
        {/* {tableData.map((item: SimpleObject, rowIndex: number) => (
          <tr key={`row-${rowIndex}`}>
            <Td>{rowIndex + 1}</Td>

            {Object.keys(item).map((key, columnIndex) => (
              <Td key={`row-${rowIndex}-${columnIndex}`}>
                {item[key as keyof SimpleObject]}
              </Td>
            ))}
          </tr>
        ))} */}
      </tbody>
    </table>
  );
}

export default FactoryLogTable;
