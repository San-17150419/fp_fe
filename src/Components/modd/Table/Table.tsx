import { useEffect, useState } from "react";
import useRenderCount from "../../../hooks/useRenderCount";
import { SimpleObject, TableData } from "./type";
import Td from "./TableTd";
import Loading from "../../../pages/Loading";

const Th = ({ children }: { key?: string; children?: React.ReactNode }) => (
  // css="border border-gray-400 p-2 not working. Need to in
  // <th key={key} css={[tw`border border-gray-400 p-2`]}>
  <th className="border border-gray-400 p-2">{children}</th>
);

type TableProps = {
  data: TableData;
  children?: React.ReactNode;
  height: string;
  width: string;
  header?: string[];
  onRowClick?: (data: TableData) => void;
  onRowDoubleClick?: (data: TableData) => void;
};

function DataTable({ data, header }: TableProps) {
  useRenderCount();
  const [tableData, setTableData] = useState<TableData>(data);

  useEffect(() => {
    if (Array.isArray(data)) {
      setTableData(data);
    }
  }, [data]);

  if (!Array.isArray(tableData) || tableData.length === 0) {
    return <Loading />;
  }

  const titles = header || Object.keys(tableData[0]);

  return (
    <div className="h-[700px] w-[250px] overflow-hidden rounded-lg border border-gray-300 shadow-lg md:w-full">
      <div className="h-full overflow-auto">
        <table className="relative w-full border-collapse">
          <thead className="sticky top-0 bg-gray-300">
            <tr className="border border-gray-400 p-2">
              <Th>#</Th>
              {titles.map((title) => (
                <Th key={title}>{title}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((item: SimpleObject, rowIndex: number) => (
              <tr key={`row-${rowIndex}`}>
                <Td>{rowIndex + 1}</Td>

                {Object.keys(item).map((key, columnIndex) => (
                  <Td key={`row-${rowIndex}-${columnIndex}`}>
                    {item[key as keyof SimpleObject]}
                  </Td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
