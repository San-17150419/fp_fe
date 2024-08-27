import { TableVirtuoso } from "react-virtuoso";
import { FilterData } from "./types";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import VirtualizedRow from "./VirtualizedRow";
import clsx from "clsx";

type TableProps = {
  data: FilterData["data"];
  header: Record<string, string>[];
  isLoading?: boolean;
};

export default function VirtualizedTable({
  data,
  header,
  isLoading,
}: TableProps) {
  const [displayedColumns, setDisplayedColumns] = useState(
    header.map((h) => Object.keys(h)[0]),
  );
  const memoizdHeaderDictionary = useMemo(() => {
    return header.reduce((acc, curr) => {
      return { ...acc, ...curr };
    });
  }, [header]);
  const memoizedColumnsOder = useMemo(() => {
    return header.map((h) => Object.keys(h)[0]);
  }, [header]);
  const { t } = useTranslation();

  return (
    <div className="w-full overflow-x-auto overflow-y-hidden">
      <TableVirtuoso
        style={{ height: "500px", width: "100%" }}
        data={data}
        fixedHeaderContent={() => {
          return (
            <tr>
              {memoizedColumnsOder.map((key) => (
                <th
                  key={key}
                  className={clsx(
                    "border-r border-gray-300 bg-gray-300 p-2 text-center",
                    key === "prod_name_board" ? "w-1/5" : "",
                  )}
                  style={{ minWidth: "150px" }} // Set a reasonable min-width for columns
                >
                  {t(memoizdHeaderDictionary[key])}
                </th>
              ))}
            </tr>
          );
        }}
        itemContent={(index, data) => {
          return (
            <VirtualizedRow
              key={data.id_ms}
              displayedColumns={displayedColumns}
              memoizedColumnsOder={memoizedColumnsOder}
              data={data}
            />
          );
        }}
        components={{
          Table: (props) => (
            <table
              {...props}
              style={{
                tableLayout: "fixed",
                minWidth: "1100px",
              }}
              className="table-auto border-collapse whitespace-nowrap text-nowrap text-center"
            />
          ),
        }}
      />
    </div>
  );
}
