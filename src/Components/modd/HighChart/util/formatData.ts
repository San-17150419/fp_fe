import {
  getYear,
  isValid,
  format,
  startOfMonth,
  startOfWeek,
  addWeeks,
  getWeek,
} from "date-fns";

type DataWithDefaultKey = { unix_stamp?: number } & Record<string, any>;
type DataWithUnixStamp = DataWithDefaultKey & { unix_stamp: number };

// Group the data by year and ensure that each item has a unix_stamp property
export const groupByYear = <T extends DataWithDefaultKey>(
  data: T[],
  key: keyof T = "unix_stamp",
): { [year: string]: DataWithUnixStamp[] } => {
  // Check if the key exists in the first item
  if (data.length > 0 && !(key in data[0])) {
    throw new Error(`Key "${String(key)}" does not exist in the data objects.`);
  }

  return data.reduce(
    (acc, item) => {
      // Check if the key exists in the item
      if (!(key in item)) {
        throw new Error(
          `Key "${String(key)}" does not exist in an item: ${JSON.stringify(item)}`,
        );
      }

      const timestamp = item[key] as number;
      if (isNaN(timestamp) || !isValid(new Date(timestamp))) {
        throw new Error(`Invalid timestamp: ${item[key]}`);
      }

      const year = getYear(new Date(timestamp)).toString();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push({ ...item, unix_stamp: timestamp } as DataWithUnixStamp);
      return acc;
    },
    {} as { [year: string]: DataWithUnixStamp[] },
  );
};

const aggregateData = <T extends DataWithUnixStamp>(
  data: T[],
  interval: "weekly" | "biweekly" | "monthly",
  yProperty: keyof T,
) => {
  const aggregatedData: { [key: string]: T[] } = {};

  data.forEach((item) => {
    let start: string;
    const date = new Date(item.unix_stamp);
    if (interval === "monthly") {
      start = format(startOfMonth(date), "yyyy-MM");
    } else if (interval === "weekly") {
      start = format(startOfWeek(date), "yyyy-'W'w");
    } else if (interval === "biweekly") {
      const biweeklyStart = startOfWeek(addWeeks(date, getWeek(date) % 2));
      start = format(biweeklyStart, "yyyy-'W'w");
    } else {
      throw new Error(`Invalid interval: ${interval}`);
    }

    if (!aggregatedData[start]) {
      aggregatedData[start] = [];
    }
    aggregatedData[start].push(item);
  });

  return Object.keys(aggregatedData).map((key) => {
    const group = aggregatedData[key];
    const sum = (prop: keyof T) =>
      group.reduce((acc, item) => acc + item[prop], 0);
    const avg = (prop: keyof T) => sum(prop) / group.length;

    const representativeItem = group[0];
    const unix_stamp = new Date(representativeItem.unix_stamp).getTime();

    return {
      unix_stamp,
      [yProperty]: avg(yProperty),
    } as T & { unix_stamp: number };
  });
};

// Convert the data to [x, y] format for HighCharts to use
const transformData = <T extends DataWithUnixStamp>(
  data: T[],
  year: number | null,
  yProperty: keyof T,
) => {
  return data.map((item) => {
    const date = new Date(item.unix_stamp);
    if (year !== null) {
      date.setFullYear(year);
    }
    return [date.getTime(), item[yProperty]] as [number, number];
  });
};

export const processData = <T extends DataWithDefaultKey>(
  rawData: T[],
  interval: "weekly" | "biweekly" | "monthly",
  yProperty: keyof T,
  changeYearTo?: number,
) => {
  const groupedByYear = groupByYear(rawData);
  const result: {
    name: string;
    data: [number, number][];
    type: string;
    color?: string;
  }[] = [];

  Object.keys(groupedByYear).forEach((year) => {
    const yearStr = year as string; // Explicitly cast to string
    const yearData = groupedByYear[yearStr];
    const aggregatedData = aggregateData(
      yearData,
      interval,
      yProperty as string,
    );
    const transformedData = transformData(
      aggregatedData,
      changeYearTo || null,
      yProperty as string,
    );
    result.push({
      name: yearStr,
      data: transformedData,
      type: "line",
      color:
        yearStr === new Date().getFullYear().toString()
          ? "#b38f2d"
          : "lightgray",
    });
  });

  return result;
};
