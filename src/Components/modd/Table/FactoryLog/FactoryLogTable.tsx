import React from "react";
import { useFactoryLogContext } from "./FactoryLogContext";
import { useTranslation } from "react-i18next";
import StatusComponent from "./StatusComponent";
import TableTest from "../TableTest/TableTest";
import { TableComponent } from "../TableTest/TableTest";
import { formatFactoryLogData } from "../../../../util/formatDataForTable";

export default function FactoryLogTable() {
  const { rawData, isRawDataReady, currentDepartment } = useFactoryLogContext();
  const { t } = useTranslation();
  const columns = [
    "sys",
    "2023-01-01",
    "2023-07-01",
    "2024-01-01",
    "2024-07-01",
  ];
  type TableComponentProps = {
    columns: string[];
    data: DataRow[];
  };
  
  type DataRow = {
    sys: string;
    [key: string]: any; // Use an index signature to allow dynamic keys
  };
  
  const results = formatFactoryLogData(dummyData);
  const data: DataRow[] = results[0]["INJ"];
  return (
    <div>
      <div>{t(currentDepartment)}</div>
      <>
        <TableTest>
          <TableTest.TableHeader>
            <TableTest.TableRow>
              {columns.map((col) => (
                <TableTest.TableCell key={col}>{t(col)}</TableTest.TableCell>
              ))}
              <TableTest.TableCell>{t("Status")}</TableTest.TableCell>
            </TableTest.TableRow>
          </TableTest.TableHeader>
          <TableTest.TableBody>
            {data.map((row, rowIndex) => (
              // row is key/value pair. Such as sys: "CE系統"
              <TableTest.TableRow key={rowIndex}>
                <TableTest.TableCell>
                  <div className="cursor-pointer underline underline-offset-[5px] hover:text-cyan-700">
                    {t(row.sys)}
                  </div>
                </TableTest.TableCell>
                {columns.slice(1).map((col) => (
                  <TableTest.TableCell key={col}>
                    <div
                      className={`text-center ${typeof row[col] === "number" ? (row[col] < 0.85 ? "text-red-500" : "") : "underline"} `}
                    >
                      {typeof row[col] === "number"
                        ? `${(row[col] * 100).toFixed(2)}%`
                        : row[col]}
                    </div>
                  </TableTest.TableCell>
                ))}

                <TableTest.TableCell>
                  {/* <StatusComponent value={[0.85, 0.83, 0.8, 0.75]} /> */}
                  <StatusComponent
                    // The first value is 系列名稱, not the number we want
                    value={Object.values(row).slice(1) as number[]}
                  />
                </TableTest.TableCell>
              </TableTest.TableRow>
            ))}
          </TableTest.TableBody>
        </TableTest>
      </>
    </div>
  );
}
