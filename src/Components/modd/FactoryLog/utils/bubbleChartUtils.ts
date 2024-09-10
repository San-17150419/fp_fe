import { generateColors } from "../../../../util/generateColors";

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

type FormatsBubbleDataParams = {
  data_mold: FactoryEventResponseMoldData[];
  xKey: keyof FactoryEventResponseMoldData;
  yKey: keyof FactoryEventResponseMoldData;
  zKey: keyof FactoryEventResponseMoldData | null;
  //TODO:Not sure what this function is for. Currently, this should be a function that formats the name of the bubble. nameKey is optional. Because it might not need to use properties of the data. For example, generate generic names such as "Data 1", "Data 2", etc. But wether or not this function will use `FactoryEventReponseMoldData`, it will still be passed in as an argument because I don't want to deal with situations where `nameKey` is provided, but `FactoryEventReponseMoldData` is not.
  nameKey?: keyof FactoryEventResponseMoldData;
  generateName?: (
    event: FactoryEventResponseMoldData,
    index: number,
    keyName?: keyof FactoryEventResponseMoldData,
  ) => string;
};

/**
 * Generates bubble data from a list of FactoryEventReponseMoldData.
 * @param {FormatsBubbleDataParams} params - The parameters for the function.
 * @param {FactoryEventResponseMoldData} params.data_mold - The list of events to generate bubble data from.
 * @param {keyof FactoryEventResponseMoldData} params.xKey - The key of the x value in the event object.
 * @param {keyof FactoryEventResponseMoldData} params.yKey - The key of the y value in the event object.
 * @param {keyof FactoryEventResponseMoldData} params.zKey - The key of the z value in the event object.
 * @param {keyof FactoryEventResponseMoldData} params.[nameKey] - The key of the name value in the event object. Optional.
 * @param {(event: FactoryEventResponseMoldData, index: number, keyName?: keyof FactoryEventResponseMoldData) => string} [pramas.generateName] - A function that generates the name of the bubble.
 * @returns {BubbleData[]} The generated bubble data.
 * @throws {Error} If the data_mold is not an array.
 * @throws {Error} If the xKey, yKey, or zKey is not a valid key in the event object.
 * @throws {Error} If the nameKey is not a valid key in the event object.
 */
function formatMoldDataForBubbleChart(
  params: FormatsBubbleDataParams,
): BubbleData[] {
  const bubbleData: BubbleData[] = [];
  const { data_mold, xKey, yKey, zKey, nameKey, generateName } = params;

  data_mold.forEach((event, index) => {
    // xValue, yValue, and zValue might be undefined here. So right now, if they are, set them to 0
    const xValue = event[xKey as keyof FactoryEventResponseMoldData] ?? 0;
    const yValue = event[yKey as keyof FactoryEventResponseMoldData] ?? 0;
    const zValue =
      zKey === null ? 1 : event[zKey as keyof FactoryEventResponseMoldData];
    console.log(zValue);
    // if xValue, yValue, or zValue is not a number, throw an error
    if (
      typeof xValue !== "number" ||
      typeof yValue !== "number" ||
      typeof zValue !== "number"
    ) {
      throw new Error("xValue, yValue, or zValue is not a number");
    }
    const name = generateName
      ? generateName(event, index, nameKey)
      : event[nameKey as keyof FactoryEventResponseMoldData];

    bubbleData.push({
      x: xValue * 100,
      y: yValue,
      z: zValue,
      name: name.toString(),
    });
  });
  return bubbleData;
}

function findMedian(arr: number[]) {
  const sortedArr = arr.sort((a, b) => a - b);
  const middle = Math.floor(sortedArr.length / 2);
  if (sortedArr.length % 2 === 0) {
    return (sortedArr[middle - 1] + sortedArr[middle]) / 2;
  } else {
    return sortedArr[middle];
  }
}

function findAverage(arr: number[]) {
  const sum = arr.reduce((a, b) => a + b, 0);
  return sum / arr.length;
}

function separateByZValue(bubbleData: BubbleData[]): {
  maxZValue: number;
  dataByZValue: { [key: number]: BubbleData[] };
} {
  const dataByZValue: { [key: number]: BubbleData[] } = {};
  console.log(bubbleData);
  console.log(bubbleData.map((d) => d.z));
  const maxZValue = Math.max(...bubbleData.map((d) => d.z));
  console.log(maxZValue);
  for (let zValue = 0; zValue <= maxZValue; zValue++) {
    const bubbleDataWithSameZ = bubbleData.filter((d) => d.z === zValue);
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
  console.log(dataByZValue);

  return { maxZValue, dataByZValue };
}

export {
  formatMoldDataForBubbleChart,
  findMedian,
  findAverage,
  separateByZValue,
  generateColors,
};

type ZKey = keyof FactoryEventResponseMoldData | null;
type YKey = keyof FactoryEventResponseMoldData | keyof FactoryEventResponseData;

export function generateBubbleChartConfig(
  data: FactoryEventResponseMoldData[] | FactoryEventResponseData[],
  xKey: string = "ar",
  yKey: YKey = "mamt",
  zKey?: string | null,
  // xKey: keyof FactoryEventReponseMoldData = "ar",
  // yKey: keyof FactoryEventReponseMoldData = "mamt",
  // zKey: keyof FactoryEventReponseMoldData = "count_repaired",
) {
  // Single source of truth. Because `eventData.data_mold` is used in multiple places. Always use this to manipulate the chart data. For example, filter out the data that is not null.
  const bubbleData = formatMoldDataForBubbleChart({
    data_mold: data,
    xKey: xKey as keyof FactoryEventResponseMoldData,
    yKey: yKey as keyof FactoryEventResponseMoldData,
    zKey: zKey as ZKey,
    nameKey: "sn_num",
  });

  const { dataByZValue: separateData, maxZValue } =
    separateByZValue(bubbleData);
  const yArray = data.map((event) => event[yKey]);
  const yMedian = findMedian(yArray);
  const colorsArray = generateColors("#fca5a5", "#991b1b", maxZValue + 1);
  const xMin = Math.min(...data.map((event) => event["ar"])) * 100;
  const xMax = Math.max(...data.map((event) => event["ar"])) * 100;

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
