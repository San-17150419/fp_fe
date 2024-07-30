import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Table from "../TableTest/Table";
import StatusComponent from "./StatusComponent";
import { useFactoryLogContext } from "./FactoryLogContext";
import Modal from "../../Modal/NonDialogModal";
import ColumnChart from "./Chart/ColumnChart";
import ProductChart from "./Chart/ProductChart";
import HiddenRowsToggle from "./ToggleHiddenRow";

const colors100 = [
  "bg-[#fee2e2]",
  "bg-[#fef9c3]",
  "bg-[#dcfce7]",
  "bg-[#e0f2fe]",
  "bg-[#f3e8ff]",
];

export default function FactoryTableComponent({
  department,
  sysData,
  dateRanges,
  point = "ar",
  index: tableNumber = 0,
}: {
  department: string;
  sysData: any;
  dateRanges: { date_start: string; date_end: string }[];
  point?: "ar" | "pamt_p";
  index: number;
}) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [visibleRows, setVisibleRows] = useState<string[]>([]);
  const [incompleteRows, setIncompleteRows] = useState<string[]>([]);
  const [allHiddenToggled, setAllHiddenToggled] = useState(false);
  const { duration } = useFactoryLogContext();

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
        <Table.TableCaption className="my-10 font-semibold">
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
        <Table.TableHeader className="">
          <Table.TableRow className="bg-white">
            <Table.TableCell className="w-[13%] border-y border-black text-xs">
              {/* <Table.TableCell className="w-2/12 text-xs tabletL:text-xs tabletP:text-xs desktop:text-2xl"> */}
              {t("部門")}
            </Table.TableCell>
            {/* <Table.TableCell className="w-2/12 text-base tabletL:text-sm tabletP:text-sm desktop:text-2xl"> */}
            <Table.TableCell className="w-2/12 border-y border-black text-xs">
              {t("系列")}
            </Table.TableCell>
            {Array.from({ length: 3 }).map((_, index) => (
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
            ))}
            <Table.TableCell className="border-y border-black text-xs">
              {/* <Table.TableCell className="tablet:text-base border-gray-600 text-xs desktop:text-lg"> */}
              <span>{t("區間") + " " + 4}</span>
              <div className="mt-3 flex flex-wrap justify-center gap-1 text-xs text-gray-700">
                {duration[0].date_start}
                <span className="whitespace-pre-wrap">到</span>
                <span className="whitespace-pre">至今</span>
              </div>
            </Table.TableCell>
            <Table.TableCell
              colspan={2}
              className="border-y border-black text-xs"
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
                  className={`text-xs ${colors100[tableNumber % colors100.length]}`}
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
                <ProductChart title={sysName} department={department} />
              </Table.TableCell>
              {sysData[sysName][point].map((arValue: number, index: number) => (
                <Table.TableCell
                  className="w-2/12 border-gray-600 text-xs"
                  // className="w-2/12 border-gray-600 text-xs tabletL:text-xs tabletP:text-xs desktop:text-lg"
                  key={`${sysName}-${index}`}
                >
                  <span
                    className={`text-xs ${arValue < 0.85 ? "text-red-400" : ""}`}
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
