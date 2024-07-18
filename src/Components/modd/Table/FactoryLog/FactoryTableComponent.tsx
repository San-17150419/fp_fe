import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Table from "../TableTest/Table";
import StatusComponent from "./StatusComponent";
import * as XLSX from "xlsx";
import { useFactoryLogContext } from "./FactoryLogContext";
import Modal from "../../Modal/NonDialogModal";
import ColumnChart from "./Chart/ColumnChart";
import ProductChart from "./Chart/ProductChart";
import HiddenRowsToggle from "./ToggleHiddenRow";
import { GrDownload } from "react-icons/gr";
import { isToday } from "date-fns";

export default function FactoryTableComponent({
  department,
  sysData,
  dateRanges,
  point = "ar",
}: {
  department: string;
  sysData: any;
  dateRanges: { date_start: string; date_end: string }[];
  point?: "ar" | "pamt_p";
}) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [visibleRows, setVisibleRows] = useState<string[]>([]);
  const [rows, setRows] = useState<{ label: string; visible: boolean }[]>([]);
  const [allHiddenToggled, setAllHiddenToggled] = useState(false);
  const { duration } = useFactoryLogContext();

  const downloadExcel = (id: string) => {
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.table_to_sheet(document.getElementById(id));
    XLSX.utils.book_append_sheet(workbook, sheet, "Sheet1");
    XLSX.writeFile(workbook, `${id}.xlsx`);
  };

  useEffect(() => {
    const updatedVisibleRows = rows
      .filter((row) => row.visible)
      .map((row) => row.label);
    setVisibleRows(updatedVisibleRows);
  }, [rows]);

  useEffect(() => {
    const allRows = Object.keys(sysData);
    const generatedHiddenRows = () => {
      const currentHiddenRows: { label: string; visible: boolean }[] = [];
      Object.keys(sysData).forEach((system) => {
        if (sysData[system][point].includes(0)) {
          currentHiddenRows.push({
            label: system,
            visible: false,
          });
        } else {
          currentHiddenRows.push({
            label: system,
            visible: true,
          });
        }
      });
      return currentHiddenRows;
    };
    const hiddenRows = generatedHiddenRows();
    const visibleRows = allRows.filter(
      (row) => !hiddenRows.some((hiddenRow) => hiddenRow.label === row),
    );
    setVisibleRows(visibleRows);
    setRows(hiddenRows);
  }, [sysData, point]);

  const filteredData = () => {
    const filteredData = {} as { [key: string]: any };
    Object.keys(sysData).forEach((system) => {
      if (!sysData[system][point].includes(0)) {
        filteredData[system] = sysData[system];
      }
    });
    return filteredData;
  };

  const data = filteredData();

  return (
    <>
      <Modal onClose={() => setIsOpen(false)} openModal={isOpen}>
        <ColumnChart rawData={data} department={department} />
      </Modal>

      <Table id={department} className="mt-3 table-fixed text-center">
        <Table.TableCaption className="my-2 text-center text-2xl font-semibold">
          {t(department)} {t("達成率")}
          <div className="flex items-end justify-end">
            <HiddenRowsToggle
              hiddenRows={rows.filter(({ label }) =>
                !Object.keys(data).includes(label),
              )}
              setHiddenRows={setVisibleRows}
              setRows={setRows}
              allHiddenToggled={allHiddenToggled}
              setAllHiddenToggled={setAllHiddenToggled}
            />
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
          {/* {Object.keys(sysData).map((sysName: string, index: number) => ( */}

          {visibleRows.map((sysName: string, index: number) => (
            <Table.TableRow
              className={`${index % 2 !== 0 ? "bg-gray-300" : "bg-gray-100"} `}
              key={`row-${sysName}-${index}`}
            >
              {index === 0 && (
                <Table.TableCell
                  className="bg-lime-100"
                  rowspan={visibleRows.length}
                >
                  <button
                    onClick={() => setIsOpen(true)}
                    type="button"
                    className="text-xs hover:shadow-lg lg:text-sm desktop:text-xl"
                  >
                    {t(department)}
                  </button>
                </Table.TableCell>
              )}

              <Table.TableCell>
                <ProductChart title={sysName} department={department} />
              </Table.TableCell>
              {sysData[sysName][point].map((arValue: number, index: number) => (
                <Table.TableCell
                  className="w-2/12 border-gray-600 text-xs tabletL:text-xs tabletP:text-xs desktop:text-lg"
                  key={`${sysName}-${index}`}
                >
                  <span
                    className={`text-xs desktop:text-base ${arValue < 0.85 ? "text-red-500" : ""}`}
                  >
                    {arValue !== 0 ? `${(arValue * 100).toFixed(2)}%` : ""}
                  </span>
                </Table.TableCell>
              ))}
              <Table.TableCell colspan={2}>
                <StatusComponent value={sysData[sysName][point]} />
              </Table.TableCell>
            </Table.TableRow>
          ))}
        </Table.TableBody>
      </Table>
    </>
  );
}
