import { useState, useMemo, memo, useCallback, useRef, Fragment } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { type FilterData } from "./types";
import FilterForTable from "./FilterForTable";
import TableRow from "./TableRow";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

type TableProps = {
  dataRecord: Record<string, FilterData["data"][number]>;
  //  header props act as a key to the data. Allow you to decide the order of the table and what to show. If the header props is an object, the key of the object will be used as key of the data and the value of the object will be used as the header
  visibleList: string[];
};

const chunkArray = <T,>(array: T[], size: number) => {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size));
  }
  return chunkedArr;
};

const memoizedTable = memo(function Table({
  dataRecord,
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

  const paginatedList = useMemo(
    () => chunkArray(visibleList, 100),
    [visibleList],
  );

  return (
    <>
      <FilterForTable
        visibleColumns={visibleColumns}
        onColumnToggle={handleColumnToggle}
        header={header}
      />
      <TabGroup>
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
                    )}
                    key={`header-${key}`}
                  >
                    {t(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <TabPanels as={Fragment}>
              {paginatedList.map((page, pageIndex) => (
                <TabPanel key={`page-${pageIndex}`} as="tbody">
                  {page.length > 0 ? (
                    page.map((key) => (
                      <TableRow
                        data={dataRecord[key]}
                        key={key}
                        visibleColumns={visibleColumns}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={memoizedColumnsOrder.length}>
                        {t("No Data")}
                      </td>
                    </tr>
                  )}
                </TabPanel>
              ))}
            </TabPanels>
          </table>
        </div>
        <TabList className="mt-6 flex justify-end gap-2">
          {paginatedList.map((_, pageIndex) => (
            <Tab
              className="m-0 aspect-square w-6 border bg-white p-0 caret-transparent shadow-md outline-none"
              key={`tab-${pageIndex}`}
            >
              {({ selected }) => (
                <div
                  className={`block outline-none ${selected ? "bg-blue-500" : ""}`}
                >
                  {pageIndex + 1}
                </div>
              )}
            </Tab>
          ))}
        </TabList>
      </TabGroup>
    </>
  );
});

export default memoizedTable;
