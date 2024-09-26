import { useState, useMemo, memo, useCallback, useRef } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { type FilterData } from "./types";
import FilterForTable from "./FilterForTable";
import TableRow from "./TableRow";
import RenderIfVisible from "react-render-if-visible";

// TODO: Vitualized table. This component with 600 plus rows contributed over 15000 DOM Nodes.

type TableProps = {
  data: FilterData["data"];
  // data: { [key: string]: number | string | undefined }[];
  //  header props act as a key to the data. Allow you to decide the order of the table and what to show. If the header props is an object, the key of the object will be used as key of the data and the value of the object will be used as the header
  visibleList: string[];
};
const memoizedTable = memo(function Table({
  data,
  visibleList,
}: TableProps) {
  const header: Record<string, string>[] = [
    { sn_num: "唯一碼" },
    { sys: "系列" },
    { property: "財產歸屬" },
    { site: "位置" },
    { brand: "品牌" },
    { prod_name_board: "名板" },
    { pnb_state: "名板狀態" },
    { prod_name_nocolor: "定義品名" },
    { mold_num: "模號" },
    { hole_num: "模穴數" },
    { block_num: "塞穴數" },
    { dutydate_month: "開模日期" },
    { dutydate_last: "最後上機" },
    { maker: "廠商代號" },
    { state: "狀態" },
    { spare: "備註" },
    { id_ms: "資料表id" },
  ];
  const tableRef = useRef<HTMLTableElement>(null);
  const [visibleColumns, setVisibleColumns] = useState({
    sn_num: true,
    sys: true,
    property: true,
    site: true,
    brand: true,
    prod_name_board: true,
    pnb_state: true,
    prod_name_nocolor: true,
    mold_num: true,
    hole_num: true,
    block_num: true,
    dutydate_month: true,
    dutydate_last: true,
    maker: true,
    state: true,
    spare: true,
    id_ms: true,
  });

  const handleColumnToggle = useCallback((columnKey: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey as keyof typeof prev],
    }));
  }, []);

  const memoizedColumnsOrder = useMemo(
    () => header.map((h) => Object.keys(h)[0]),
    [header],
  );
  const { t } = useTranslation();

  const memoizedTableRows = useMemo(() => {
    const tableRows: Record<string, JSX.Element> = {};
    data.forEach((row) => {
      tableRows[row.sn_num] = (
        <tr>
          <TableRow
            data={row}
            key={row.id_ms}
            visibleColumns={visibleColumns}
          />
        </tr>
      );
    });
    return tableRows;
  }, [data, visibleColumns]);
  return (
    <>
      {/* {isLoading && <Loading  text="Table loading"/>} */}
      <FilterForTable
        visibleColumns={visibleColumns}
        onColumnToggle={handleColumnToggle}
        header={header}
      />
      <div className="h-[60vh] max-w-full overflow-auto">
        <table
          className="relative w-full table-auto border-separate border-spacing-0 text-nowrap text-center"
          style={{ willChange: "auto" }}
          ref={tableRef}
        >
          <thead className="sticky top-0 bg-gray-300">
            <tr>
              {memoizedColumnsOrder.map((key) => (
                <th
                  className={clsx(
                    "border border-gray-200 p-2",
                    visibleColumns[key as keyof typeof visibleColumns]
                      ? ""
                      : "hidden",
                    // getClassName(key),
                  )}
                  key={`header-${key}`}
                >
                  {t(key)}
                </th>
              ))}
            </tr>
          </thead>
          {/* <tbody>
            {visibleList?.length > 0 ? (
              visibleList.map(
                (key) =>
                  memoizedTableRows[key as keyof typeof memoizedTableRows],
              )
            ) : (
              <tr>
                <td colSpan={memoizedColumnsOrder.length}>{t("No Data")}</td>
              </tr>
            )}
          </tbody> */}
          <tbody>
            {data.map((row) => (
              <RenderIfVisible
                key={row.id_ms}
                defaultHeight={300}
                root={tableRef.current}
                rootElement="tr"
                placeholderElement="td"
              >
                <TableRow
                  data={row}
                  key={row.id_ms}
                  visibleColumns={visibleColumns}
                />
              </RenderIfVisible>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});

export default memoizedTable;

// function getClassName(key: string) {
//   switch (key) {
//     case "sn_num":
//       return "text-blue-400 w-[135px]";
//     case "sys":
//       return " w-[90px]";
//     case "property":
//       return " w-[85px]";
//     case "site":
//       return " w-[60px]";
//     case "brand":
//       return "w-[60px]";
//     case "prod_name_board":
//       return "text-red-400 w-[215px]";
//     case "pnb_state":
//       return "w-[90px]";
//     case "prod_name_nocolor":
//       return " w-[160px]";
//     case "mold_num":
//       return " w-[70px]";
//     case "hole_num":
//       return " w-[70px]";
//     case "block_num":
//       return " w-[60px]";
//     case "dutydate_month":
//       return "text-sm w-[130px]";
//     case "dutydate_last":
//       return "text-sm text-blue-400 w-[130px]";
//     case "maker":
//       return "text-sm w-[100px]";
//     case "state":
//       return "text-sm w-[100px]";
//     case "spare":
//       return "text-sm w-[100px]";
//     case "id_ms":
//       return "text-sm w-[100px]";
//     default:
//       return "";
//   }
// }
