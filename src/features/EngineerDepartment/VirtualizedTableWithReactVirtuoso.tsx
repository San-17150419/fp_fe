import { TableVirtuoso } from "react-virtuoso";
import { useTranslation } from "react-i18next";
import Event from "./Event";
import { data } from "./testData";
import { Site } from "./types";
import clsx from "clsx";

// I have to manually set the width of each cell. If I want to hide the column
// This is for testing which library I should use. It's using static data for now.
export default function VirtualizedTableWithGrid() {
  const { t } = useTranslation();
  return (
    <TableVirtuoso
      className="h-full w-[1756px] text-nowrap caret-transparent"
      data={data}
      style={{ height: "700px", scrollbarWidth: "thin" }}
      fixedHeaderContent={() => (
        <tr className="text-center caret-black">
          <th className="w-[155px] text-nowrap border bg-slate-300 p-2 text-center">
            {t("sn_num")}
          </th>
          <th className="w-[90px] text-nowrap border bg-slate-300 p-2 text-center">
            {t("sys")}
          </th>
          <th className="w-[85px] text-nowrap border bg-slate-300 p-2 text-center">
            {t("property")}
          </th>
          <th className="w-[60px] text-nowrap border bg-slate-300 p-2 text-center">
            {t("site")}
          </th>
          <th className="w-[60px] text-nowrap border bg-slate-300 p-2 text-center">
            {t("brand")}
          </th>
          <th className="w-[215px] text-nowrap border bg-slate-300 p-2 text-center">
            {t("prod_name_board")}
          </th>
          <th className="w-[90px] text-nowrap border bg-slate-300 p-2 text-center">
            {t("pnb_state")}
          </th>
          <th className="w-[160px] text-nowrap border bg-slate-300 p-2 text-center">
            {t("prod_name_nocolor")}
          </th>
          <th className="w-[70px] text-nowrap border bg-slate-300 p-2 text-center">
            {t("mold_num")}
          </th>
          <th className="w-[70px] text-nowrap border bg-slate-300 p-2 text-center">
            {t("block_num")}
          </th>
          <th className="w-[130px] text-nowrap border bg-slate-300 p-2 text-center">
            {t("dutydate_month")}
          </th>
          <th className="w-[130px] text-nowrap border bg-slate-300 p-2 text-center">
            {t("dutydate_last")}
          </th>
          <th className="w-[100px] text-nowrap border bg-slate-300 p-2 text-center">
            {t("maker")}
          </th>
          <th className="w-[90px] text-nowrap border bg-slate-300 p-2 text-center">
            {t("state")}
          </th>
          <th className="w-[85px] text-nowrap border bg-slate-300 p-2 text-center">
            {t("spare")}
          </th>
          <th className="w-[85px] text-nowrap border bg-slate-300 p-2 text-center">
            更新
            {/* {t("id_ms")} */}
          </th>
        </tr>
      )}
      itemContent={(index, data) => (
        <>
          <td className="border p-2 text-center text-blue-500">
            {data.sn_num}
          </td>
          <td className="border p-2 text-center caret-black">{data.sys}</td>
          <td className="border p-2 text-center caret-black">{data.property}</td>
          <td className="border p-2 text-center caret-black">{data.site}</td>
          <td className="border p-2 text-center caret-black">{data.brand}</td>
          <td className="border p-2 text-center caret-black text-red-500">
            {data.prod_name_board}
          </td>
          <td
            className={clsx(
              "border p-2 text-center",
              data.pnb_state === "done" ? "text-blue-500" : "text-red-500",
            )}
          >
            {t(data.pnb_state)}
          </td>
          <td className="border p-2 text-center caret-black">{data.prod_name_nocolor}</td>
          <td className="border p-2 text-center caret-black">{data.mold_num}</td>
          <td className="border p-2 text-center caret-black">{data.block_num}</td>
          <td className="border p-2 text-center caret-black">{data.dutydate_month}</td>
          <td className="border p-2 text-center caret-black">
            <Event
              dutydate_last={data.dutydate_last}
              site={data.site as Site}
              sn_num={data.sn_num}
            />
          </td>
          <td className="border p-2 text-center caret-black">{data.maker}</td>
          <td className="border p-2 text-center caret-black">{data.state}</td>
          <td className="border p-2 text-center caret-black">備註</td>
          {/* <td  className="text-center border p-2">{data.spare}</td> */}
          <td className="border p-2 text-center caret-black">更新</td>
        </>
      )}
    />
  );
}
