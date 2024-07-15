import React, { useState } from "react";
import { useFactoryLogContext } from "./FactoryLogContext";
import { useTranslation } from "react-i18next";
import StatusComponent from "./StatusComponent";
import Table from "../TableTest/Table";
import { isToday } from "date-fns";
import Loading from "../../../Loading";
import ProductChart from "../FactoryLog/Chart/ProductChart";
import Modal from "../../Modal/NonDialogModal";
import * as XLSX from "xlsx";

export default function FactoryLogTable() {
  const { postData, duration, isRequestMade, isTableDataReady } =
    useFactoryLogContext();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  if (!postData) return null;

  const fillValues = (values: number[], maxLength: number) => {
    const filledValues = [...values];
    while (filledValues.length < maxLength) {
      filledValues.push(0);
    }
    return filledValues;
  };

  const formatDateToQuarter = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth(); // getMonth() returns 0-11
    const quarter = Math.floor(month / 3) + 1; // Calculate the quarter
    return `${year}-Q${quarter}`;
  };

  const getDateRangeHeaders = () => {
    const dateRanges = [];
    const startDate = new Date("2023-01-01");
    const endDate = new Date("2023-12-31");
    const intervals = 4; // Example: 4 intervals

    for (let i = 0; i < intervals; i++) {
      const intervalStart = new Date(startDate);
      intervalStart.setMonth(startDate.getMonth() + i * 3);
      const intervalEnd = new Date(intervalStart);
      intervalEnd.setMonth(intervalStart.getMonth() + 2);
      dateRanges.push(
        `${formatDateToQuarter(intervalStart)} - ${formatDateToQuarter(
          intervalEnd,
        )}`,
      );
    }

    return dateRanges;
  };
  const downloadExcel = (id: string) => {
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.table_to_sheet(document.getElementById(id));
    XLSX.utils.book_append_sheet(workbook, sheet, "Sheet1");
    XLSX.writeFile(workbook, `${id}.xlsx`);
  };

  const dateRangeHeaders = getDateRangeHeaders();
  if (!isRequestMade) return null;
  if (!isTableDataReady) return <Loading />;
  return (
    <div>
      <Modal onClose={() => setIsOpen(false)} openModal={isOpen}>
        123
      </Modal>
      {postData &&
        Object.keys(postData).map((department) => (
          <>
            <button
              type="button"
              key={`download-${department}`}
              onClick={() => downloadExcel(department)}
              className="m-2 rounded-md border border-sky-300 p-2 hover:bg-gray-500 hover:text-gray-100"
            >
              Download
            </button>
            <Table
              id={department}
              key={`${department}-table`}
              className="mt-10 table-fixed"
            >
              <Table.TableCaption className="my-2 text-center text-lg">
                {t(department)} {t("達成率")}
              </Table.TableCaption>
              <Table.TableHeader className="border-gray-600">
                <Table.TableRow className="hover:bg-gray-300">
                  <Table.TableCell className="w-1/12 border-y border-gray-600">
                    {t("部門")}
                  </Table.TableCell>
                  <Table.TableCell className="w-2/12 border-y border-gray-600">
                    {t("系列")}
                  </Table.TableCell>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Table.TableCell
                      className="border-y border-gray-600"
                      key={index}
                    >
                      {/* I think I need to extract this into a function */}
                      <div className="flex flex-col gap-3 text-wrap">
                        {t("區間") + " " + (index + 1)}

                        <span className="text-xs text-gray-600">
                          {(duration[3 - index].date_start || "") +
                            "  到  " +
                            (duration[3 - index].date_end || "")}
                        </span>
                      </div>
                    </Table.TableCell>
                  ))}
                  <Table.TableCell className="border-y border-gray-600">
                    <div className="flex flex-col gap-3 text-nowrap">
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
                    className="border-y border-gray-600"
                  >
                    {t("比較其他季度")}
                  </Table.TableCell>
                </Table.TableRow>
              </Table.TableHeader>
              {/* This is the table body */}
              <Table.TableBody>
                {Object.keys(postData[department]).map((sys, sysIndex) => (
                  <Table.TableRow
                    className={`${sysIndex % 2 !== 0 ? "bg-gray-300" : "bg-gray-100"}`}
                    key={sysIndex}
                  >
                    {sysIndex === 0 && (
                      <Table.TableCell
                        className="bg-lime-300"
                        rowspan={Object.keys(postData[department]).length}
                      >
                        <button
                          onClick={() => setIsOpen(true)}
                          className="hover:shadow-lg"
                        >
                          {t(department)}
                        </button>
                      </Table.TableCell>
                    )}
                    {/* 系列名稱 */}
                    <Table.TableCell>
                      <ProductChart title={sys} department={department} />
                    </Table.TableCell>
                    {fillValues(
                      postData[department][sys]["ar"],
                      dateRangeHeaders.length,
                    ).map((ar, arIndex) => (
                      <Table.TableCell className="" key={arIndex}>
                        <span className={` ${ar < 0.85 ? "text-red-500" : ""}`}>
                          {ar !== 0 ? `${(ar * 100).toFixed(2)}%` : ""}
                        </span>
                      </Table.TableCell>
                    ))}
                    <Table.TableCell colspan={2}>
                      <StatusComponent
                        value={postData[department][sys]["ar"]}
                      />
                    </Table.TableCell>
                  </Table.TableRow>
                ))}
              </Table.TableBody>
            </Table>
          </>
        ))}
    </div>
  );
}
