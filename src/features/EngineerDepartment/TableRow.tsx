import { useMemo } from "react";
import { type FilterData } from "./types";
import Update from "./Update";
import MemoCell from "./MemoCell";
import Event from "./Event";
import cn from "../../util/cn";
import withPreData from "./WithPreData";
type TableRowProps = {
  data: FilterData["data"][number];
  visibleColumns: Record<string, boolean>;
};

const UpdateWithPreData = withPreData(Update);

export default function TableRow({ data, visibleColumns }: TableRowProps) {
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

  const memoizedDictionary = useMemo(() => {
    const dictionary = {
      sn_num: (
        <TableCell key={`sn_num-${data.id_ms}`} className="text-blue-400">
          {data.sn_num}
        </TableCell>
      ),
      sys: <TableCell key={`sys-${data.id_ms}`}>{data.sys}</TableCell>,
      property: (
        <TableCell key={`property-${data.id_ms}`}>{data.property}</TableCell>
      ),
      site: <TableCell key={`site-${data.id_ms}`}>{data.site}</TableCell>,
      brand: <TableCell key={`brand-${data.id_ms}`}>{data.brand}</TableCell>,
      prod_name_board: (
        <TableCell
          key={`prod_name_board-${data.id_ms}`}
          className="text-red-400"
        >
          {data.prod_name_board}
        </TableCell>
      ),
      pnb_state: (
        <TableCell key={`pnb_state-${data.id_ms}`}>
          {data.pnb_state === "incomplete" ? (
            <span className="text-red-600">未完成</span>
          ) : (
            <span className="text-blue-600">完成</span>
          )}
        </TableCell>
      ),
      prod_name_nocolor: (
        <TableCell key={`prod_name_nocolor-${data.id_ms}`}>
          {data.prod_name_nocolor}
        </TableCell>
      ),
      mold_num: (
        <TableCell key={`mold_num-${data.id_ms}`}>{data.mold_num}</TableCell>
      ),
      hole_num: (
        <TableCell key={`hole_num-${data.id_ms}`}>{data.hole_num}</TableCell>
      ),
      block_num: (
        <TableCell key={`block_num-${data.id_ms}`}>{data.block_num}</TableCell>
      ),
      dutydate_month: (
        <TableCell key={`dutydate_month-${data.id_ms}`} className="text-sm">
          {data.dutydate_month}
        </TableCell>
      ),
      dutydate_last: (
        <TableCell
          key={`dutydate_last-${data.id_ms}`}
          className="text-sm text-blue-400"
        >
          {!data.dutydate_last ? null : (
            <Event
              dutydate_last={data.dutydate_last}
              site={data.site}
              sn_num={data.sn_num}
            />
          )}
        </TableCell>
      ),
      maker: <TableCell key={`maker-${data.id_ms}`}>{data.maker}</TableCell>,
      state: <TableCell key={`state-${data.id_ms}`}>{data.state}</TableCell>,
      spare: (
        <TableCell key={`spare-${data.id_ms}`}>
          <MemoCell data={data} />
        </TableCell>
      ),
      id_ms: (
        <TableCell key={`id_ms-${data.id_ms}`}>
          <UpdateWithPreData data={data} />
        </TableCell>
      ),
    };
    return dictionary;
  }, [data]);
  return (
    <tr>
      {order.map((key) =>
        visibleColumns[key]
          ? // visibleColumns[key as keyof typeof data] ? (
            memoizedDictionary[key as keyof typeof memoizedDictionary]
          : null,
      )}
    </tr>
  );
}

function TableCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={cn("border p-2", className)}>{children}</td>;
}
