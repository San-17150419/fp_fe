import { generateColors } from "../../../../util/generateColors";
import { findMedian, findAverage } from "./numberUtils";
//bubbleChartUtils.ts
import {
  FactoryEventResponseData,
  type FactoryEventResponseMoldData,
} from "../types";
import Highcharts, { type SeriesBubbleOptions } from "highcharts";
// TODO: A total rework is needed. This version is too interconnected with types.

type BubbleData = {
  x: number;
  y: number;
  z: number;
  name: string;
  color?: string;
};

type FormatsBubbleDataParams<T> = {
  data_mold: T[];
  xKey: keyof T;
  yKey: keyof T;
  zKey?: keyof T;
  //TODO:Not sure what this function is for. Currently, this should be a function that formats the name of the bubble. nameKey is optional. Because it might not need to use properties of the data. For example, generate generic names such as "Data 1", "Data 2", etc. But wether or not this function will use `FactoryEventReponseMoldData`, it will still be passed in as an argument because I don't want to deal with situations where `nameKey` is provided, but `FactoryEventReponseMoldData` is not.
  nameKey?: keyof T;
  generateName?: (event: T, index: number, keyName?: keyof T) => string;
};

function formatMoldDataForBubbleChart<FactoryEventReponseMoldData>(
  params: FormatsBubbleDataParams<FactoryEventReponseMoldData>,
): BubbleData[] {
  const bubbleData: BubbleData[] = [];
  const { data_mold, xKey, yKey, zKey, nameKey, generateName } = params;

  data_mold.forEach((event, index) => {
    // xValue, yValue, and zValue might be undefined here. So right now, if they are, set them to 0
    const xValue = event[xKey] ?? 0;
    const yValue = event[yKey] ?? 0;
    if (!zKey) {
      throw new Error("zKey is not defined");
    }
    const zValue = event[zKey] ?? 0;

    // if xValue, yValue, or zValue is not a number, throw an error
    if (
      typeof xValue !== "number" ||
      typeof yValue !== "number" ||
      typeof zValue !== "number"
    ) {
      throw new Error("xValue, yValue, or zValue is not a number");
    }
    if (!nameKey) {
      throw new Error("nameKey is not defined");
    }
    const name = generateName
      ? generateName(event, index, nameKey)
      : event[nameKey];

    bubbleData.push({
      x: xValue * 100,
      y: yValue,
      z: zValue,
      name: (name as string).toString(),
    });
  });
  return bubbleData;
}

interface GroupAndSortBubbleDataByZ {
  (data: BubbleData[]): {
    zArray: number[];
    dataByZValue: { [key: number]: BubbleData[] };
  };
}

const groupAndSortBubbleDataByZ: GroupAndSortBubbleDataByZ = function (
  bubbleData,
) {
  const dataByZValue: { [key: number]: BubbleData[] } = {};
  const maxZValue = Math.max(...bubbleData.map((d) => d.z));
  for (let zValue = 0; zValue <= maxZValue; zValue++) {
    const bubbleDataWithSameZ = bubbleData.filter((d) => d.z === zValue);
    // TODO: I think this dummy data is not needed.
    if (bubbleDataWithSameZ.length !== 0) {
      // this dummy data is to make the ratio of the bubble size consistent.
      bubbleDataWithSameZ.push({
        x: 1000,
        y: 99999999,
        z: 0,
        name: "This is not supposed to be shown in the chart. If it is, something is wrong. Please report it.",
      });
      dataByZValue[zValue] = bubbleDataWithSameZ;
    }
  }

  Object.keys(dataByZValue).forEach((key) => {
    const numericKey = Number(key);
    dataByZValue[numericKey] = dataByZValue[numericKey].sort(
      (a, b) => a.y - b.y,
    );
  });

  return { dataByZValue, zArray: Object.keys(dataByZValue).map(Number) };
};

// TODO: This shouldn't depend on the type of the `FactoryEventResponseMoldData`.
export function generateBubbleChartConfig(
  moldData: FactoryEventResponseMoldData[],
  xKey: keyof FactoryEventResponseMoldData = "ar",
  yKey: keyof FactoryEventResponseMoldData = "mamt",
  zKey: keyof FactoryEventResponseMoldData = "count_repaired",
) {
  // Single source of truth. Because `eventData.data_mold` is used in multiple places. Always use this to manipulate the chart data. For example, filter out the data that is not null.
  const bubbleData = formatMoldDataForBubbleChart({
    data_mold: moldData,
    xKey: xKey as keyof FactoryEventResponseMoldData,
    yKey: yKey as keyof FactoryEventResponseMoldData,
    zKey: zKey as keyof FactoryEventResponseMoldData,
    nameKey: "sn_num",
  });

  const { dataByZValue: separateData, zArray } =
    groupAndSortBubbleDataByZ(bubbleData);
  const yArray = moldData.map((event) => event[yKey]);
  function isNumberArray(arr: unknown[]): arr is number[] {
    return arr.every((item) => typeof item === "number");
  }
  // This is a temporary fix.
  if (!isNumberArray(yArray)) {
    throw new Error("yArray is not a number array");
  }
  // zArray is already sorted
  // TODO: Check if z array is sorted
  const maxZValue = zArray[zArray.length - 1];
  const yMedian = findMedian(yArray);
  const colorsArray = generateColors(
    "#fca5a5",
    "#991b1b",
    zArray[zArray.length - 1] + 1,
  );
  const xMin = Math.min(...moldData.map((event) => event["ar"])) * 100;
  const xMax = Math.max(...moldData.map((event) => event["ar"])) * 100;

  const generateSeries = () => {
    const series: SeriesBubbleOptions[] = [];
    const defaultConfig: SeriesBubbleOptions = {
      type: "bubble",
      maxSize: maxZValue * 10 + 10,
      minSize: 10,
      sizeBy: "width",
      dataGrouping: { enabled: false },
      jitter: { x: 0.5 },
      accessibility: {
        enabled: false,
      },
    };

    Object.keys(separateData).map((key) => {
      const numericKey = Number(key);
      series.push({
        ...defaultConfig,
        data: separateData[numericKey] as Highcharts.PointOptionsObject[],
        color: colorsArray[numericKey],
        legendIndex: numericKey,
        name: `維修次數: ${numericKey}`,
        dataLabels: {
          align: "center",
          verticalAlign: "top",
          enabled: true,
          allowOverlap: false,
          y: -15,
          zIndex: 9,
          style: {
            color: "black",
            fontWeight: "bold",
            fontSize: "0.5rem",
          },
        },
      });
    });
    return series;
  };

  return {
    xMin,
    xMax,
    yMedian,
    generateSeries,
  };
}
export function generateBubbleChartConfigFromData(
  moldData: FactoryEventResponseData[],
  xKey: keyof FactoryEventResponseData = "ar",
  yKey: keyof FactoryEventResponseData = "pamt",
) {
  // Single source of truth. Because `eventData.data_mold` is used in multiple places. Always use this to manipulate the chart data. For example, filter out the data that is not null.
  const bubbleData = formatDataForBubbleChart<FactoryEventResponseData>({
    data_mold: moldData,
    xKey: xKey,
    yKey: yKey,
    nameKey: "prod_name",
  });

  const { dataByZValue: separateData, zArray } =
    groupAndSortBubbleDataByZ(bubbleData);
  const yArray = moldData.map((event) => event[yKey]);
  function isNumberArray(arr: unknown[]): arr is number[] {
    return arr.every((item) => typeof item === "number");
  }
  // This is a temporary fix.
  if (!isNumberArray(yArray)) {
    throw new Error("yArray is not a number array");
  }
  // zArray is already sorted
  // TODO: Check if z array is sorted
  const maxZValue = zArray[zArray.length - 1];
  const yMedian = findMedian(yArray);
  const colorsArray = generateColors(
    "#fca5a5",
    "#991b1b",
    zArray[zArray.length - 1] + 1,
  );
  const xMin = Math.min(...moldData.map((event) => event["ar"])) * 100;
  const xMax = Math.max(...moldData.map((event) => event["ar"])) * 100;

  const generateSeries = () => {
    const series: SeriesBubbleOptions[] = [];
    const defaultConfig: SeriesBubbleOptions = {
      type: "bubble",
      maxSize: maxZValue * 10 + 10,
      minSize: 10,
      sizeBy: "width",
      dataGrouping: { enabled: false },
      jitter: { x: 0.5 },
      accessibility: {
        enabled: false,
      },
    };
    series.push({
      ...defaultConfig,
      color: colorsArray[0],
      data: separateData[1],
    });
    return series;
  };

  return {
    xMin,
    xMax,
    yMedian,
    generateSeries,
  };
}

export {
  formatMoldDataForBubbleChart,
  findMedian,
  findAverage,
  groupAndSortBubbleDataByZ as separateByZValue,
  generateColors,
};

export function formatDataForBubbleChart<FactoryEventResponseData>(
  params: FormatsBubbleDataParams<FactoryEventResponseData>,
): BubbleData[] {
  const bubbleData: BubbleData[] = [];
  const { data_mold, xKey, yKey, nameKey, generateName } = params;

  data_mold.forEach((event, index) => {
    // xValue, yValue, and zValue might be undefined here. So right now, if they are, set them to 0
    const xValue = event[xKey] ?? 0;
    const yValue = event[yKey] ?? 0;
    const zValue = 1;

    // if xValue, yValue, or zValue is not a number, throw an error
    if (
      typeof xValue !== "number" ||
      typeof yValue !== "number" ||
      typeof zValue !== "number"
    ) {
      throw new Error("xValue, yValue, or zValue is not a number");
    }

    if (!nameKey) {
      throw new Error("nameKey is not defined");
    }
    const name = generateName
      ? generateName(event, index, nameKey)
      : event[nameKey];

    bubbleData.push({
      x: xValue * 100,
      y: yValue,
      z: zValue,
      name: (name as string).toString(),
    });
  });
  return bubbleData;
}
