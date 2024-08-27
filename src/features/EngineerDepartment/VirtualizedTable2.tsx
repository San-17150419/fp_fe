import { useMemo } from "react";
import { Table, Column, AutoSizer } from "react-virtualized";
import "react-virtualized/styles.css";
import { type FilterData } from "./types";
import { useTranslation } from "react-i18next";
import Update from "./Update";
import Event from "./Event";
import MemoCell from "./MemoCell";

type TableProps = {
  data: FilterData["data"];
  header: Record<string, string>[];
  isLoading?: boolean;
};

function measureTextWidth(text: string, font = "16px Arial") {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (context) {
    context.font = font;
    return context.measureText(text).width;
  }
  return 0;
}
export default function VirtualizedTable2({
  data,
  header,
  isLoading,
}: TableProps) {
  // const [displayedColumns, setDisplayedColumns] = useState(
  //   header.map((h) => Object.keys(h)[0]),
  // );
  const memoizdHeaderDictionary = useMemo(() => {
    return header.reduce((acc, curr) => {
      return { ...acc, ...curr };
    });
  }, [header]);
  const memoizedColumnsOder = useMemo(() => {
    return header.map((h) => Object.keys(h)[0]);
  }, [header]);
  const { t } = useTranslation();

  // Calculate the width for each column based on its content

  const getColumnWidth = (key: string) => {
    if (key === "spare") {
      // Use the width of "備註" instead of the actual content
      return measureTextWidth("備註") + 20; // Adjust padding if needed
    }
    const headerWidth = measureTextWidth(t(memoizdHeaderDictionary[key])) + 20;
    const maxContentWidth = Math.max(
      ...data.map(
        (row) =>
          measureTextWidth(String(row[key as keyof typeof row] ?? "")) + 20,
      ),
    );
    return Math.max(headerWidth, maxContentWidth);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "700px",
        border: "1px solid #ccc",
      }}
      className="overflow-x-auto overflow-y-hidden whitespace-nowrap text-nowrap"
    >
      <AutoSizer>
        {({ height, width }) => (
          <Table
            width={width}
            height={height}
            headerHeight={40}
            className="brder-black border-separate border-spacing-0 text-nowrap border text-center"
            rowHeight={30}
            rowCount={data.length}
            rowGetter={({ index }) => data[index]}
            rowClassName={({ index }) =>
              index % 2 === 0 ? "even-row" : "odd-row"
            }
          >
            {memoizedColumnsOder.map((key, index) => (
              <Column
                key={key}
                label={t(memoizdHeaderDictionary[key])}
                dataKey={key}
                width={getColumnWidth(key)}
                cellRenderer={({ cellData, rowData }) => {
                  switch (key) {
                    case "pnb_state":
                      return (
                        <span
                          className={
                            String(rowData[key]) === "incomplete"
                              ? "text-red-600"
                              : "text-blue-600"
                          }
                        >
                          {t(String(rowData[key]))}
                        </span>
                      );
                    case "dutydate_last":
                      return (
                        <Event
                          sn_num={String(rowData.sn_num)}
                          site={rowData.site}
                          dutydate_last={String(rowData.dutydate_last)}
                        />
                      );
                    case "spare":
                      return <MemoCell message={String(rowData[key])} />;
                    case "id_ms":
                      return <Update id_ms={rowData.id_ms} />;
                    default:
                      return <span>{String(cellData)}</span>;
                  }
                }}
              />
            ))}
          </Table>
        )}
      </AutoSizer>
    </div>
  );
}
