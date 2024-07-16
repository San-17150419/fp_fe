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
import ColumnChart from "./Chart/ColumnChart";
import { GrDownload } from "react-icons/gr";

export default function FactoryLogTable() {
  const { postData, duration, isRequestMade, isTableDataReady } =
    useFactoryLogContext();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState("");
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
    const intervals = 4;

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

  // TODO: Add key to table. React is complaining. I need to check where did I forget to add key
  const dateRangeHeaders = getDateRangeHeaders();
  if (!isRequestMade) return null;
  if (!isTableDataReady) return <Loading />;
  return (
    <div>
      <Modal onClose={() => setIsOpen(false)} openModal={isOpen}>
        {/* TODO: The animation is a bit disjoint. There is a weird jump when the chart is fully rendered. My guess is since the width of the column chart is calculated on the fly, so before the chart is rendered, the modal does not know the width of the chart. So the initial size of the modal is 50% of the window width and height. After the chart is rendered, the modal is resized, which causes the jump. */}
        <ColumnChart department={currentDepartment} />
        <hr />
        {/* <ColumnChart department={currentDepartment} />
        <hr />
        <ColumnChart department={currentDepartment} /> */}
      </Modal>
      {postData &&
        Object.keys(postData).map((department) => (
          <>
            <Table
              id={department}
              key={`${department}-table`}
              className="mt-10 table-auto"
            >
              <Table.TableCaption className="my-2 text-center text-lg">
                {t(department)} {t("達成率")}
                <button
                  type="button"
                  title="Download Excel"
                  key={`download-${department}`}
                  onClick={() => downloadExcel(department)}
                  className="m-2 rounded-md border p-2 hover:border-sky-300 hover:bg-gray-500 hover:text-gray-100"
                >
                  <GrDownload />
                </button>
              </Table.TableCaption>
              <Table.TableHeader className="border-gray-600">
                <Table.TableRow className="hover:bg-gray-300">
                  <Table.TableCell
                    key="department"
                    className="tablet:text-lg w-1/12 border-y border-gray-600 text-base desktop:text-xl"
                  >
                    {t("部門")}
                  </Table.TableCell>
                  <Table.TableCell className="tablet:text-lg w-2/12 border-y border-gray-600 text-xs desktop:text-xl">
                    {t("系列")}
                  </Table.TableCell>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Table.TableCell
                      className="tablet:text-lg border-y border-gray-600 text-xs desktop:text-xl"
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
                    className="tablet:text-base border-y border-gray-600 text-xs desktop:text-lg"
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
                    {/* 部門名稱 multiple rows */}
                    {sysIndex === 0 && (
                      <Table.TableCell
                        className="bg-lime-300"
                        rowspan={Object.keys(postData[department]).length}
                      >
                        <button
                          onClick={() => {
                            setIsOpen(true);
                            setCurrentDepartment(department);
                          }}
                          type="button"
                          key={`sys-${sys}`}
                          className="text-base hover:shadow-lg desktop:text-xl"
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
                        <span
                          className={`text-xs desktop:text-base ${ar < 0.85 ? "text-red-500" : ""}`}
                        >
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
