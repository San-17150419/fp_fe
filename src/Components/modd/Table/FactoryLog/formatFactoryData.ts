import { FactoryLogRawData, LogData } from "./FactoryLogDataType";

type FormattedData = {
  [key: string]: any;
};

export const formatFactoryLogData = (
  rawData: FactoryLogRawData,
): FormattedData[] => {
  const tableData: FormattedData[] = [];
  rawData.data.forEach((item) => {
    const { dep, data } = item;
    const departmentData: FormattedData[] = [];
    // sort date ranges by date_start in ascending order
    const sortedData = data.sort((a, b) => {
      return (
        new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
      );
    });

    sortedData.forEach((dateRange) => {
      const { date_start, raw } = dateRange;
      raw.forEach((entry) => {
        const { sys, ar } = entry;
        let row = departmentData.find((r) => r.sys === sys);
        if (!row) {
          row = { sys };
          departmentData.push(row);
        }

        row[date_start] = ar;
      });
    });
    tableData.push({ [dep]: departmentData });
  });
  return tableData;
};

// function formatDateToQuarter(date: Date): string {
//       const year = date.getFullYear();
//       const month = date.getMonth(); // getMonth() returns 0-11
//       const quarter = Math.floor(month / 3) + 1; // Calculate the quarter
//       return `${year}-Q${quarter}`;
//     }

//     function getHeaders() {
//       const header = ["系統"];
//       if (rawData) {
//         console.dir(rawData);
//         rawData.duration.map(({ date_start }) => {
//           header.push(formatDateToQuarter(new Date(date_start)));
//         });
//         header.push("比較其他季度");
//       }

//       return header;
//     }
export const transformData = (data: LogData[]): FormattedData => {
  const finalDataFormat: FormattedData = {};
  data.forEach((item) => {
    const { dep, data: dateRanges } = item;

    if (!finalDataFormat[dep]) {
      finalDataFormat[dep] = {};
    }

    const sortedData = dateRanges.sort((a, b) => {
      return (
        new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
      );
    });

    sortedData.forEach((dateRange) => {
      const { raw } = dateRange;

      raw.forEach((entry) => {
        const { sys, pl, ...points } = entry;

        if (!finalDataFormat[dep][sys]) {
          finalDataFormat[dep][sys] = {};
        }

        Object.keys(points).forEach((point) => {
          if (!finalDataFormat[dep][sys][point]) {
            finalDataFormat[dep][sys][point] = [];
          }
          finalDataFormat[dep][sys][point].push(
            points[point as keyof typeof points] as number,
          );
        });
      });
    });
  });
  console.log(finalDataFormat);
  return finalDataFormat;
};
