import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Table from "../Table/TableTest/Table";
import Modal from "../Modal/NonDialogModal";
import StatusComponent from "./StatusComponent";
import ColumnChart from "./Chart/ColumnChart";
import ProductChart from "./Chart/FactoryProductCharts";
import HiddenRowsToggle from "./ToggleHiddenRow";
import { isToday } from "date-fns";
import { type Factory, type Department } from "./types/factoryLogDataType";
import { useTheme } from "../../../stores/ThemeContext";
import clsx from "clsx";
const colors100 = [
  "bg-[#fee2e2]",
  "bg-[#fef9c3]",
  "bg-[#dcfce7]",
  "bg-[#e0f2fe]",
  "bg-[#f3e8ff]",
];

export default function FactoryTableComponent({
  factory,
  department,
  sysData,
  duration,
  point = "ar",
  index: tableNumber = 0,
}: {
  factory: Factory;
  department: Department<Factory>;
  sysData: any;
  duration: { date_start: string; date_end: string }[];
  point?: "ar" | "pamt_p";
  index: number;
}) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [visibleRows, setVisibleRows] = useState<string[]>([]);
  const [incompleteRows, setIncompleteRows] = useState<string[]>([]);
  const [allHiddenToggled, setAllHiddenToggled] = useState(false);
  const { isSemiBold, isTextBase } = useTheme();
  useEffect(() => {
    const updatedIncompleteRows = Object.keys(sysData).filter((system) =>
      sysData[system][point].includes(0),
    );
    const updatedVisibleRows = Object.keys(sysData).filter(
      (system) => !sysData[system][point].includes(0),
    );

    setIncompleteRows(updatedIncompleteRows);
    setVisibleRows(updatedVisibleRows);
  }, [sysData, point]);

  const handleToggleVisibility = (label: string) => {
    setVisibleRows((prevRows) =>
      prevRows.includes(label)
        ? prevRows.filter((row) => row !== label)
        : [...prevRows, label],
    );
  };

  const handleToggleAllVisibility = () => {
    setAllHiddenToggled((prev) => !prev);
    if (!allHiddenToggled) {
      setVisibleRows((prevRows) => [
        ...prevRows,
        ...incompleteRows.filter((row) => !prevRows.includes(row)),
      ]);
    } else {
      setVisibleRows((prevRows) =>
        prevRows.filter((row) => !incompleteRows.includes(row)),
      );
    }
  };

  return (
    <div className="rounded-md bg-white shadow shadow-gray-500">
      <Modal onClose={() => setIsOpen(false)} isOpen={isOpen}>
        <ColumnChart
          allData={sysData}
          visibleRows={visibleRows}
          title={department}
        />
      </Modal>

      <Table id={department} className="mb-20 mt-12 table-fixed text-center">
        <Table.TableCaption
          className={clsx(
            "my-10",
            isTextBase ? "text-xl" : "text-lg",
            isSemiBold ? "font-semibold" : "font-normal",
          )}
        >
          <div className="relative flex flex-col justify-center">
            <span className="absolute left-1/2 -translate-x-1/2 text-slate-700 drop-shadow-lg">
              {t(department)} {t("達成率")}
            </span>
          </div>

          <div className="mr-4 flex justify-end">
            <HiddenRowsToggle
              hiddenRows={incompleteRows}
              visibleRows={visibleRows}
              toggleVisibility={handleToggleVisibility}
              allHiddenToggled={allHiddenToggled}
              toggleAllVisibility={handleToggleAllVisibility}
            />
            {/* <button
              type="button"
              title="Download Excel"
              key={`download-${department}`}
              onClick={() => downloadExcel(department)}
              className="mx-2 block aspect-square rounded-md border px-2 hover:bg-gray-500 hover:text-gray-100"
            >
              <GrDownload />
            </button> */}
          </div>
        </Table.TableCaption>
        <Table.TableHeader>
          <Table.TableRow className="bg-white">
            <Table.TableCell
              className={clsx(
                "w-[12%] border-y border-black",
                isSemiBold ? "font-semibold" : "font-normal",
                isTextBase ? "text-base" : "text-sm",
              )}
            >
              {/* <Table.TableCell className="w-2/12 text-xs tabletL:text-xs tabletP:text-xs desktop:text-2xl"> */}
              {t("部門")}
            </Table.TableCell>
            {/* <Table.TableCell className="w-2/12 text-base tabletL:text-sm tabletP:text-sm desktop:text-2xl"> */}
            <Table.TableCell
              className={clsx(
                "w-2/12 text-center border-y border-black",
                isSemiBold ? "font-semibold" : "font-normal",
                isTextBase ? "text-base" : "text-sm",
              )}
            >
              {t("系列")}
            </Table.TableCell>

            {duration
              .toReversed()
              .map((date: { date_start: string; date_end: string }, index) => (
                <Table.TableCell
                  className={clsx(
                    "border-y border-black",
                    isSemiBold ? "font-semibold" : "font-normal",
                    isTextBase ? "text-base" : "text-sm",
                  )}
                  key={`${department}-table-header-cell-${index}`}
                >
                  {t("區間") + " " + (index + 1)}
                  <div className="mt-3 flex flex-wrap justify-center gap-1 text-xs text-gray-700">
                    {date.date_start || ""}
                    <span className="whitespace-pre-wrap">到</span>
                    {isToday(date.date_end) ? t("今天") : date.date_end || ""}
                  </div>
                </Table.TableCell>
              ))}
            {/* {Array.from({ length: 3 }).map((_, index) => (
              <Table.TableCell
                className="border-y border-black text-xs"
                // className="tablet:text-base text-xs desktop:text-lg"
                key={`${department}-table-header-cell-${index}`}
              >
                {t("區間") + " " + (index + 1)}
                <div className="mt-3 flex flex-wrap justify-center gap-1 text-xs text-gray-700">
                  {duration[3 - index].date_start || ""}
                  <span className="whitespace-pre-wrap">到</span>
                  {duration[3 - index].date_end || ""}
                </div>
              </Table.TableCell>
            ))} */}

            {/* <Table.TableCell className="border-y border-black text-xs">
              <span>{t("區間") + " " + 4}</span>
              <div className="mt-3 flex flex-wrap justify-center gap-1 text-xs text-gray-700">
                {duration[0].date_start}
                <span className="whitespace-pre-wrap">到</span>
                <span className="whitespace-pre">至今</span>
              </div>
            </Table.TableCell> */}
            <Table.TableCell
              colspan={2}
              className={clsx(
                "w-[18%] border-y border-black text-base",
                isSemiBold ? "font-semibold" : "font-normal",
                isTextBase ? "text-base" : "text-sm",
              )}
            >
              {t("比較其他區間")}
            </Table.TableCell>
          </Table.TableRow>
        </Table.TableHeader>
        <Table.TableBody>
          {visibleRows.map((sysName: string, index: number) => (
            <Table.TableRow
              className={`${
                index % 2 !== 0
                  ? "bg-gray-200 hover:bg-gray-300"
                  : "bg-gray-100 hover:bg-gray-300"
              }`}
              key={`row-${sysName}-${index}`}
            >
              {index === 0 && (
                <Table.TableCell
                  className={clsx(
                    `${colors100[tableNumber % colors100.length]}`,
                    isSemiBold ? "font-semibold" : "font-normal",
                    isTextBase ? "text-base" : "text-sm",
                  )}
                  rowspan={visibleRows.length}
                >
                  <button
                    onClick={() => setIsOpen(true)}
                    type="button"
                    className="text-wrap rounded-md p-1 hover:opacity-90"
                    // className="hover rounded-md p-1 text-xs hover:shadow-lg lg:text-sm desktop:text-xl"
                  >
                    {t(department)}
                  </button>
                </Table.TableCell>
              )}

              <Table.TableCell>
                {/* <Table.TableCell className="focus-within:bg-sky-100"> */}
                <ProductChart
                  title={sysName}
                  department={department}
                  postData={sysData}
                  factory={factory}
                  duration={duration}
                />
              </Table.TableCell>
              {sysData[sysName][point].map((arValue: number, index: number) => (
                <Table.TableCell
                  className={clsx(
                    "w-2/12 border-gray-600 text-base",
                    isSemiBold ? "font-semibold" : "font-normal",
                    isTextBase ? "text-base" : "text-sm",
                  )}
                  // className="w-2/12 border-gray-600 text-xs tabletL:text-xs tabletP:text-xs desktop:text-lg"
                  key={`${sysName}-${index}`}
                >
                  <span
                    className={clsx(
                      ` ${arValue < 0.85 ? "text-red-400" : ""}`,
                      isSemiBold ? "font-semibold" : "font-normal",
                      isTextBase ? "text-base" : "text-sm",
                    )}
                    // className={`text-xs desktop:text-base ${arValue < 0.85 ? "text-red-500" : ""}`}
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
    </div>
  );
}
