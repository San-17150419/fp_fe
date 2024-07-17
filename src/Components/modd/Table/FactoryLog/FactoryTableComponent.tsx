import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Table from "../TableTest/Table";
import StatusComponent from "./StatusComponent";
import * as XLSX from "xlsx";
import { transformData, exportToExcel, findLastNonZero } from "./util/utils";
import { useFactoryLogContext } from "./FactoryLogContext";
import Modal from "../../Modal/NonDialogModal";
import ColumnChart from "./Chart/ColumnChart";
import ProductChart from "./Chart/ProductChart";
import HiddenRowsToggle from "./ToggleHiddenRow";
import { GrDownload } from "react-icons/gr";
import { isToday } from "date-fns";
import TempChart from "./Chart/TempChart";

export default function FactoryTableComponent({
  department,
  sysData,
  dateRanges,
  // The default point is set to ar.
  point = "ar",
}: {
  department: string;
  sysData: any;
  dateRanges: { date_start: string; date_end: string }[];
  point?: "ar" | "pamt_p";
}) {
  console.log(sysData);
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [visibleRows, setVisibleRows] = useState<string[]>([]);

  const { postData, duration } = useFactoryLogContext();
  const downloadExcel = (id: string) => {
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.table_to_sheet(document.getElementById(id));
    XLSX.utils.book_append_sheet(workbook, sheet, "Sheet1");
    XLSX.writeFile(workbook, `${id}.xlsx`);
  };

  const filteredData2 = () => {
    const currentVisibleRows: string[] = [];
    const currentHiddenRows: string[] = [];
    Object.keys(sysData).forEach((system) => {
      if (!sysData[system][point].includes(0)) {
        currentVisibleRows.push(system);
      } else {
        currentHiddenRows.push(system);
      }
    });
    return { currentVisibleRows, currentHiddenRows };
  };
  const filteredData = () => {
    const filteredData = {} as { [key: string]: any };
    const currenTvisibleRows: string[] = [];
    const currenThiddenRows: string[] = [];
    Object.keys(sysData).forEach((system) => {
      const arArray: number[] = sysData[system][point];
      if (!sysData[system][point].includes(0)) {
        filteredData[system] = sysData[system];
      }
    });

    return filteredData;
  };
  const data = filteredData();
  const { currentVisibleRows, currentHiddenRows } = filteredData2();
  return (
    <>
      <Modal onClose={() => setIsOpen(false)} openModal={isOpen}>
        <ColumnChart rawData={data} department={department} />
      </Modal>

      <Table id={department} className="mt-3 table-fixed text-center">
        <Table.TableCaption className="my-2 text-center text-2xl font-semibold">
          {t(department)} {t("達成率")}
          <div className="flex items-end justify-end">
            <HiddenRowsToggle hiddenRows={currentHiddenRows} />
            <button
              type="button"
              title="Download Excel"
              key={`download-${department}`}
              onClick={() => downloadExcel(department)}
              className="mx-2 block rounded-md border px-2 hover:border-sky-300 hover:bg-gray-500 hover:text-gray-100"
            >
              <GrDownload />
            </button>
          </div>
        </Table.TableCaption>
        <Table.TableHeader className="border-gray-600">
          <Table.TableRow>
            <Table.TableCell className="w-2/12 border-y border-gray-600 text-xs tabletL:text-xs tabletP:text-xs desktop:text-lg">
              {t("部門")}
            </Table.TableCell>
            <Table.TableCell className="w-2/12 border-y border-gray-600 text-base tabletL:text-sm tabletP:text-sm desktop:text-lg">
              {t("系列")}
            </Table.TableCell>
            {Array.from({ length: 3 }).map((_, index) => (
              <Table.TableCell
                className="tablet:text-base border-y border-gray-600 text-xs desktop:text-lg"
                key={`${department}-table-header-cell-${index}`}
              >
                {/* I think I need to extract this into a function */}
                <div className="flex flex-col gap-3">
                  {t("區間") + " " + (index + 1)}

                  <div className="flex flex-wrap justify-center gap-1 text-xs text-gray-600">
                    <span> {duration[3 - index].date_start || ""}</span>
                    <span>到</span>
                    <span>{duration[3 - index].date_end || ""}</span>
                  </div>
                </div>
              </Table.TableCell>
            ))}
            <Table.TableCell className="border-y border-gray-600">
              <div className="tablet:text-base flex flex-col gap-3 text-nowrap text-xs desktop:text-lg">
                {t("區間") + " " + 4}
                <span className="text-xs text-gray-600">
                  {isToday(duration[0].date_start)
                    ? t("至今")
                    : (duration[0].date_start || "") + "  到  " + "至今"}
                </span>
              </div>
            </Table.TableCell>
            <Table.TableCell
              colspan={2}
              className="border-y border-gray-600 text-base tabletL:text-base desktop:text-lg"
            >
              {t("比較其他季度")}
            </Table.TableCell>
          </Table.TableRow>
        </Table.TableHeader>
        <Table.TableBody>
          {Object.keys(data).map((sys, sysIndex) => (
            <Table.TableRow
              className={`${sysIndex % 2 !== 0 ? "bg-gray-300" : "bg-gray-100"}`}
              key={`${department}-${sys}table-row-${sysIndex}`}
            >
              {/* 部門名稱 multiple rows */}
              {sysIndex === 0 && (
                <Table.TableCell
                  className="bg-lime-100"
                  rowspan={Object.keys(data).length}
                >
                  <button
                    onClick={() => {
                      setIsOpen(true);
                    }}
                    type="button"
                    key={`sys-${sys}`}
                    className="text-xs hover:shadow-lg lg:text-sm desktop:text-xl"
                  >
                    {t(department)}
                  </button>
                </Table.TableCell>
              )}
              {/* 系列名稱 */}
              <Table.TableCell>
                <ProductChart title={sys} department={department} />
              </Table.TableCell>
              {data[sys][point].map((ar: number, arIndex: number) => (
                <Table.TableCell className="" key={arIndex}>
                  <span
                    className={`text-xs desktop:text-base ${ar < 0.85 ? "text-red-500" : ""}`}
                  >
                    {ar !== 0 ? `${(ar * 100).toFixed(2)}%` : ""}
                  </span>
                </Table.TableCell>
              ))}
              <Table.TableCell colspan={2}>
                <StatusComponent value={data[sys][point]} />
              </Table.TableCell>
            </Table.TableRow>
          ))}
        </Table.TableBody>
      </Table>
    </>
  );
}
