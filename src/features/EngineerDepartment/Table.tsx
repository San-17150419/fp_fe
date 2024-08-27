import { useState, useMemo, memo } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import Loading from "../../Components/Loading";
import Event from "./Event";
import { type Site, type FilterData } from "./types";
import MemoCell from "./MemoCell";
import Update from "./Update";
import FilterForTable from "./FilterForTable";
// This is a temporary component for testing

type TableProps = {
  data: FilterData["data"];
  // data: { [key: string]: number | string | undefined }[];
  //  header props act as a key to the data. Allow you to decide the order of the table and what to show. If the header props is an object, the key of the object will be used as key of the data and the value of the object will be used as the header
  header: Record<string, string>[];
  isLoading?: boolean;
};

// TODO: Fix performance issues. I think a possible problem is using index as part of the key. So when the displayedColumns is changed, all columns are re-rendered since the key is changed (Just a thought, I haven't looked at it yet, but the performance issues are definitely there). Another guess is there are too much stuffs that are calculated on the fly. Either memoize them or find a way to do it in a more efficient way
const memoizedTable = memo(function Table({
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
    <>
      {isLoading ? <Loading /> : ""}
      <div className="relative max-w-full overflow-hidden text-nowrap">
        {/* TODO: Extract this to a component */}
        {/* TODO: Add autocomplete to input based on preData */}
        {/* TODO: Can't maintain the order of the header */}
        {/* TODO: The */}

        <FilterForTable
          displayedColumns={displayedColumns}
          header={header}
          setDisplayedColumns={setDisplayedColumns}
        />
        <div className="relative h-[600px] max-w-full overflow-auto">
          <table className="relative m-2 w-full table-auto border-separate border-spacing-0 text-center">
            <thead className="sticky top-0 bg-gray-300">
              <tr>
                {memoizedColumnsOder.map((key) => (
                  <th
                    className={clsx(
                      "border border-gray-200 p-2",
                      displayedColumns.includes(key) ? "" : "hidden",
                    )}
                    key={key.slice(0, 5 + key.length)}
                  >
                    {t(memoizdHeaderDictionary[key])}
                  </th>
                ))}
              </tr>
            </thead>
            {data.length === 0 && (
              <tbody>
                <tr>
                  <td
                    className="border border-gray-200 p-1"
                    colSpan={header.length}
                  >
                    {t("無資料")}
                  </td>
                </tr>
              </tbody>
            )}
            <tbody>
              {data.map((item) => (
                <tr key={`${item.id_ms}-tr`}>
                  {memoizedColumnsOder.map((key) => (
                    <td
                      className={clsx(
                        "border border-gray-200 p-1",
                        key === "sn_num" ? "text-blue-600" : "",
                        key === "prod_name_board" ? "text-red-600" : "",
                        key === "dutydate_last" ? "text-blue-600" : "",
                        displayedColumns.includes(key) ? "" : "hidden",
                      )}
                      key={key.slice(0, 5 + key.length)}
                    >
                      {key === "pnb_state" ? (
                        <span
                          className={
                            clsx(item[key as keyof typeof item] as string) ===
                            "incomplete"
                              ? "text-red-600"
                              : "text-blue-600"
                          }
                          key={item.id_ms}
                        >
                          {t(item[key as keyof typeof item] as string)}
                        </span>
                      ) : key === "dutydate_last" ? (
                        <Event
                          sn_num={item.sn_num as string}
                          site={item.site as Site}
                          dutydate_last={item.dutydate_last as string}
                        />
                      ) : key === "spare" ? (
                        <MemoCell message={item[key] as string}></MemoCell>
                      ) : key === "id_ms" ? (
                        <Update id_ms={item.id_ms}></Update>
                      ) : (
                        <span className="p-1">
                          {item[key as keyof typeof item]}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
});

export default memoizedTable;
