import clsx from "clsx";
import Update from "./Update";
import MemoCell from "./MemoCell";
import Event from "./Event";
import { useTranslation } from "react-i18next";

import { type FilterData, type Site } from "./types";
type RowProps = {
  displayedColumns: string[];
  memoizedColumnsOder: string[];
  data: FilterData["data"][number];
};

export default function VirtualizedRow({
  displayedColumns,
  memoizedColumnsOder,
  data,
}: RowProps) {
  const { t } = useTranslation();
  return (
    <>
      {memoizedColumnsOder.map((key) => (
        <td
          className={clsx(
            "border border-gray-200 p-2 whitespace-nowrap",
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
                clsx(data[key as keyof typeof data] as string) === "incomplete"
                  ? "text-red-600"
                  : "text-blue-600"
              }
              key={data.id_ms}
            >
              {t(data[key as keyof typeof data] as string)}
            </span>
          ) : key === "dutydate_last" ? (
            <Event
              sn_num={data.sn_num as string}
              site={data.site as Site}
              dutydate_last={data.dutydate_last as string}
            />
          ) : key === "spare" ? (
            <MemoCell message={data[key] as string}></MemoCell>
          ) : key === "id_ms" ? (
            <Update id_ms={data.id_ms}></Update>
          ) : (
            <span className="p-1">{data[key as keyof typeof data]}</span>
          )}
        </td>
      ))}
    </>
  );
}
