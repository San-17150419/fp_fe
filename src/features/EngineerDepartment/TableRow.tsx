import { memo, type PropsWithRef, forwardRef } from "react";
import { type FilterData } from "./types";
import Update from "./Update";
import MemoCell from "./MemoCell";
import LogData from "./LogData";
import cn from "../../util/cn";
import withPreData from "./WithPreData";
type TableRowProps = {
  data: FilterData["data"][number];
  visibleColumns: Record<string, boolean>;
} & PropsWithRef<JSX.IntrinsicElements["tr"]>;

const UpdateWithPreData = withPreData(Update);
const TableRow = memo(
  forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow({
    data,
    visibleColumns,
    ref,
  }: TableRowProps) {
    console.log(ref);
    const order = [
      "sn_num",
      "sys",
      "property",
      "site",
      "brand",
      "prod_name_board",
      "pnb_state",
      "prod_name_nocolor",
      "mold_num",
      "hole_num",
      "block_num",
      "dutydate_month",
      "dutydate_last",
      "maker",
      "state",
      "spare",
      "id_ms",
    ];

    return (
      <tr>
        {order.map((key) => {
          if (!visibleColumns[key]) {
            return null;
          }
          const cellContent = renderCellContent(key, data);
          return (
            <TableCell
              key={`${key}-${data.id_ms}`}
              className={getClassName(key)}
            >
              {cellContent}
            </TableCell>
          );
        })}
      </tr>
    );
  }),
);

function TableCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={cn("border p-2", className)}>{children}</td>;
}

function renderCellContent(key: string, data: FilterData["data"][number]) {
  switch (key) {
    case "sn_num":
      return data.sn_num;
    case "sys":
      return data.sys;
    case "property":
      return data.property;
    case "site":
      return data.site;
    case "brand":
      return data.brand;
    case "prod_name_board":
      return data.prod_name_board;
    case "pnb_state":
      return data.pnb_state === "incomplete" ? (
        <span className="text-red-600">未完成</span>
      ) : (
        <span className="text-blue-600">完成</span>
      );
    case "prod_name_nocolor":
      return data.prod_name_nocolor;
    case "mold_num":
      return data.mold_num;
    case "hole_num":
      return data.hole_num;
    case "block_num":
      return data.block_num;
    case "dutydate_month":
      return data.dutydate_month;
    case "dutydate_last":
      return data.dutydate_last ? (
        <LogData
          dutydate_last={data.dutydate_last}
          site={data.site}
          sn_num={data.sn_num}
        />
      ) : null;
    case "maker":
      return data.maker;
    case "state":
      return data.state;
    case "spare":
      return <MemoCell currentMoldData={data} />;
    case "id_ms":
      return <UpdateWithPreData currentMoldData={data} />;
    default:
      return null;
  }
}

function getClassName(key: string) {
  switch (key) {
    case "sn_num":
      return "min-w-[130px] text-blue-400 ";
    case "prod_name_board":
      return "min-w-[185px] text-red-400 ";

    case "dutydate_last":
      return " text-blue-400 ";
    default:
      return "";
  }
}

export default TableRow;
