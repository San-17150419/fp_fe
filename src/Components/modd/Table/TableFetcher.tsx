import { useState, useEffect, Suspense } from "react";
import { TableData } from "./type";
import translateHeader from "../../../util/translateHeader";
import Table from "./Table";

type TableFetcherProps = {
  fetchData: () => Promise<{ data: TableData | null; error: string | null }>;
  processData?: (data: TableData) => TableData;
};

export default function TableFetcher({
  fetchData,
  processData,
}: TableFetcherProps) {
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      const result = await fetchData();
      if (result.error) {
        setError(result.error);
        setTableData(null);
      } else {
        const processedData = processData
          ? processData(result.data as TableData)
          : result.data;
        setTableData(processedData);
      }
    };

    fetchAndProcessData();
  }, [fetchData, processData]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <Table data={tableData as TableData} header={translateHeader()} />;
}
