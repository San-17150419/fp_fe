import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../Modal/NonDialogModal";
import StatusComponent from "../FactoryLog/StatusComponent";

const TableTest: React.FC<{ children: React.ReactNode }> & {
  TableHeader: typeof TableHeader;
  TableBody: typeof TableBody;
  TableRow: typeof TableRow;
  TableCell: typeof TableCell;
} = ({ children }) => {
  return (
    <table className="relative w-full table-auto border-separate border-spacing-0 align-middle">
      {children}
    </table>
  );
};

const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <thead className="sticky top-0 bg-gray-300">{children}</thead>;
};

const TableBody: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <tbody>{children}</tbody>;
};

const TableRow: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <tr className="border border-gray-400 p-2">{children}</tr>;
};

const TableCell: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <td className="border border-gray-400 p-2 text-center font-semibold">
      {children}
    </td>
  );
};

TableTest.TableHeader = TableHeader;
TableTest.TableBody = TableBody;
TableTest.TableRow = TableRow;
TableTest.TableCell = TableCell;

export default TableTest;

// type StatusComponentProps = {
//   value: number[];
// };

// const StatusComponent: React.FC<StatusComponentProps> = ({ value }) => {
//   const [isLowest, setIsLowest] = useState(false);
//   const [
//     isLowerThanStandardConsecutively,
//     setIsLowerThanStandardConsecutively,
//   ] = useState(false);
//   const [
//     numberOfConsecutiveLowerThanStandard,
//     setNumberOfConsecutiveLowerThanStandard,
//   ] = useState(0);

//   useEffect(() => {
//     const calculateStatus = (data: number[]) => {
//       const current = data[data.length - 1];
//       let consecutiveCount = 0;

//       // Check for consecutive values lower than standard (85)
//       for (let i = data.length - 1; i >= 0; i--) {
//         if (data[i] < 0.85) {
//           consecutiveCount++;
//         } else {
//           break;
//         }
//       }

//       setNumberOfConsecutiveLowerThanStandard(consecutiveCount);
//       setIsLowerThanStandardConsecutively(consecutiveCount > 1);

//       // Check if the current value is the lowest
//       const lowest = Math.min(...data);
//       setIsLowest(current === lowest);
//     };

//     calculateStatus(value);
//   }, [value]);

//   return (
//     <div className="flex gap-2">
//       {isLowest && (
//         <p
//           className={`${value[value.length - 1] < 0.85 ? "bg-amber-500" : "bg-green-500"} rounded-full p-2 px-4 text-white`}
//         >
//           最低達成率
//         </p>
//       )}
//       {isLowerThanStandardConsecutively && (
//         <p className="rounded-full bg-red-500 p-2 px-4 text-white">
//           連續低於標準
//           {numberOfConsecutiveLowerThanStandard > 1 &&
//             ` (${numberOfConsecutiveLowerThanStandard})`}
//         </p>
//       )}
//     </div>
//   );
// };

type TableComponentProps = {
  columns: string[];
  data: DataRow[];
};

type DataRow = {
  sys: string;
  [key: string]: any; // Use an index signature to allow dynamic keys
};

const TableComponent: React.FC<TableComponentProps> = ({ columns, data }) => {
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();

  if (data.length === 0) {
    return <div>{t("No data available")}</div>;
  }

  return (
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
  );
};

export { TableComponent };
