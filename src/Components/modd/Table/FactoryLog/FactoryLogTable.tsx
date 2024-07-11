import { useFactoryLogContext } from "./FactoryLogContext";
import { useTranslation } from "react-i18next";
import StatusComponent from "./StatusComponent";
import TableTest from "../TableTest/TableTest";

export default function FactoryLogTable() {
  const {
    postData,
    currentDepartment,
    rawData,
    isPreDataReady,
    isRawDataReady,
    isPostDataReady,
    isProcessedDataReady,
  } = useFactoryLogContext();

  const { t } = useTranslation();
  const point = "ar";

  // Check if rawData and necessary values are available
  if (
    !rawData ||
    !currentDepartment ||
    !postData ||
    !isPreDataReady ||
    !isRawDataReady ||
    !isPostDataReady ||
    !isProcessedDataReady
  ) {
    console.log("Missing necessary data");
    return <div>{t("Loading...")}</div>;
  }

  function formatDateToQuarter(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth(); // getMonth() returns 0-11
    const quarter = Math.floor(month / 3) + 1; // Calculate the quarter
    return `${year}-Q${quarter}`;
  }

  function getHeaders() {
    const header = ["系統"];
    if (rawData) {
      console.dir(rawData);
      rawData.duration.map(({ date_start }) => {
        header.push(formatDateToQuarter(new Date(date_start)));
      });
      header.push("比較其他季度");
    }

    return header;
  }

  // Example usage:
  const headers = getHeaders();
  const data = postData[currentDepartment][point];

  return (
    <TableTest>
      <TableTest.TableHeader className="border-b border-gray-600 bg-gray-200">
        <TableTest.TableRow>
          {headers &&
            headers.map((header) => (
              <TableTest.TableCell
                className="border-none border-gray-600 bg-gray-400"
                key={header}
              >
                {t(header)}
              </TableTest.TableCell>
            ))}
        </TableTest.TableRow>
      </TableTest.TableHeader>
      <TableTest.TableBody>
        {Object.entries(data).map(([key, valueArray], rowIndex) => {
          if (!Array.isArray(valueArray)) return null;

          // Fill the valueArray with empty strings to match the number of columns
          const filledValues = [...valueArray];
          while (filledValues.length < 4) {
            filledValues.push(null);
          }

          return (
            <TableTest.TableRow
              key={key}
              className={` ${rowIndex % 2 === 0 ? "" : "bg-gray-300"}`}
            >
              <TableTest.TableCell className="border-none">
                <div className="cursor-pointer underline underline-offset-[5px] hover:text-cyan-700">
                  {t(key)}
                </div>
              </TableTest.TableCell>
              {filledValues.map((value, index) => (
                <TableTest.TableCell className="border-none" key={index}>
                  <div className={`${value < 0.85 ? "text-red-500" : ""}`}>
                    {value !== null ? `${(value * 100).toFixed(2)}%` : ""}
                  </div>
                </TableTest.TableCell>
              ))}
              <TableTest.TableCell className="border-none">
                <StatusComponent value={valueArray} />
              </TableTest.TableCell>
            </TableTest.TableRow>
          );
        })}
      </TableTest.TableBody>
    </TableTest>
  );
}
