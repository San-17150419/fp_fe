import { useState, useMemo, memo, useCallback } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import Loading from "../../Components/Loading";
import { type FilterData } from "./types";
import FilterForTable from "./FilterForTable";
import TableRow from "./TableRow";
type TableProps = {
  data: FilterData["data"];
  // data: { [key: string]: number | string | undefined }[];
  //  header props act as a key to the data. Allow you to decide the order of the table and what to show. If the header props is an object, the key of the object will be used as key of the data and the value of the object will be used as the header
  isLoading?: boolean;
  visibleList: string[];
};
// Memoized Table Component
const memoizedTable = memo(function Table({
  data,
  isLoading,
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
        <TableRow data={row} key={row.id_ms} visibleColumns={visibleColumns} />
      );
    });
    return tableRows;
  }, [data, visibleColumns]);
  return (
    <>
      {isLoading && <Loading />}
      <FilterForTable
        visibleColumns={visibleColumns}
        onColumnToggle={handleColumnToggle}
        header={header}
      />
      <div className="h-[600px] max-w-full overflow-auto">
        <table className="relative w-full table-auto border-separate border-spacing-0 text-nowrap text-center">
          <thead className="sticky top-0 bg-gray-300">
            <tr>
              {memoizedColumnsOrder.map((key) => (
                <th
                  className={clsx(
                    "border border-gray-200 p-2",
                    visibleColumns[key as keyof typeof visibleColumns]
                      ? ""
                      : "hidden",
                  )}
                  key={`header-${key}`}
                >
                  {t(key)}
                  {/* <td>{t(key)}</td> */}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
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
            {/* {data.map((row) => (
              <TableRow
                key={row.sn_num}
                data={row}
                visibleColumns={visibleColumns}
              />
            ))} */}
          </tbody>
        </table>
      </div>
    </>
  );
});

export default memoizedTable;
