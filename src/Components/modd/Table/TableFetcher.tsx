import { useState, useEffect } from "react";
import { TableData } from "./type";
import translateHeader from "../../../util/translateHeader";
import Table from "./Table";
import Loading from "../../Loading";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      const result = await fetchData();
      if (result.error) {
        setError(result.error);
        setTableData(null);
        setIsLoading(false);
      } else {
        const processedData = processData
          ? processData(result.data as TableData)
          : result.data;
        setTableData(processedData);
        setIsLoading(false);
      }
    };

    fetchAndProcessData();
  }, [fetchData, processData]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return isLoading ? (
    <Loading />
  ) : (
    <Table data={tableData as TableData} header={translateHeader()} />
  );
}
