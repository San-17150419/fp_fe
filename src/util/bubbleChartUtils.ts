import { type FactoryEventReponseMoldData } from "../Components/modd/Table/FactoryLog/FactoryLogDataType";

/**
 * Formats a number into a hexadecimal string with a leading zero if necessary.
 *
 * @param {number} number - The number to be formatted.
 * @return {string} The formatted hexadecimal string.
 */
const formatHex = (number: number): string => {
  const hexadecimal = number.toString(16);
  return hexadecimal.padStart(2, "0");
};

/**
 * Generates an array of colors interpolated between two input colors.
 *
 * @param {string} startColor - The starting color in hex format.
 * @param {string} endColor - The ending color in hex format.
 * @param {number} numberOfColors - The number of colors to generate.
 * @returns {string[]} An array of colors in hex format.
 * @throws {Error} If the input colors are not in hex format.
 */
function generateColors(
  startColor: string,
  endColor: string,
  numberOfColors: number,
): string[] {
  if (startColor[0] !== "#" || endColor[0] !== "#") {
    throw new Error("Colors must be in hex format");
  }

  const colors: string[] = [];

  const startRed = parseInt(startColor.substring(1, 3), 16);
  const startGreen = parseInt(startColor.substring(3, 5), 16);
  const startBlue = parseInt(startColor.substring(5, 7), 16);

  const endRed = parseInt(endColor.substring(1, 3), 16);
  const endGreen = parseInt(endColor.substring(3, 5), 16);
  const endBlue = parseInt(endColor.substring(5, 7), 16);

  if (numberOfColors <= 0) {
    throw new Error("numberOfColors must be greater than 0");
  }

  if (numberOfColors === 1) {
    colors.push(startColor);
    return colors;
  }

  if (numberOfColors === 2) {
    colors.push(startColor);
    colors.push(endColor);
    return colors;
  }

  for (let i = 0; i < numberOfColors; i++) {
    const ratio = i / (numberOfColors - 1);
    if (isNaN(ratio)) {
      throw new Error("Unexpected error, ratio is NaN");
    }
    const interpolatedRed = Math.round(startRed * (1 - ratio) + endRed * ratio);
    const interpolatedGreen = Math.round(
      startGreen * (1 - ratio) + endGreen * ratio,
    );
    const interpolatedBlue = Math.round(
      startBlue * (1 - ratio) + endBlue * ratio,
    );

    const interpolatedColor =
      "#" +
      formatHex(interpolatedRed) +
      formatHex(interpolatedGreen) +
      formatHex(interpolatedBlue);

    colors.push(interpolatedColor);
  }
  return colors;
}

type BubbleData = {
  x: number;
  y: number;
  z: number;
  name: string;
  color?: string;
};

type FormatsBubbleDataParams = {
  data_mold: FactoryEventReponseMoldData[];
  xKey: keyof FactoryEventReponseMoldData;
  yKey: keyof FactoryEventReponseMoldData;
  zKey: keyof FactoryEventReponseMoldData;
  //TODO:Not sure what this function is for. Currently, this should be a function that formats the name of the bubble. nameKey is optional. Because it might not need to use properties of the data. For example, generate generic names such as "Data 1", "Data 2", etc. But wether or not this function will use `FactoryEventReponseMoldData`, it will still be passed in as an argument because I don't want to deal with situations where `nameKey` is provided, but `FactoryEventReponseMoldData` is not.
  nameKey?: keyof FactoryEventReponseMoldData;
  generateName?: (
    event: FactoryEventReponseMoldData,
    index: number,
    keyName?: keyof FactoryEventReponseMoldData,
  ) => string;
};

/**
 * Generates bubble data from a list of FactoryEventReponseMoldData.
 * @param {FormatsBubbleDataParams} params - The parameters for the function.
 * @param {FactoryEventReponseMoldData} params.data_mold - The list of events to generate bubble data from.
 * @param {keyof FactoryEventReponseMoldData} params.xKey - The key of the x value in the event object.
 * @param {keyof FactoryEventReponseMoldData} params.yKey - The key of the y value in the event object.
 * @param {keyof FactoryEventReponseMoldData} params.zKey - The key of the z value in the event object.
 * @param {keyof FactoryEventReponseMoldData} params.[nameKey] - The key of the name value in the event object. Optional.
 * @param {(event: FactoryEventReponseMoldData, index: number, keyName?: keyof FactoryEventReponseMoldData) => string} [pramas.generateName] - A function that generates the name of the bubble.
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
    const xValue = event[xKey as keyof FactoryEventReponseMoldData] ?? 0;
    const yValue = event[yKey as keyof FactoryEventReponseMoldData] ?? 0;
    const zValue = event[zKey as keyof FactoryEventReponseMoldData] ?? 0;
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
      : event[nameKey as keyof FactoryEventReponseMoldData];

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
  const maxZValue = Math.max(...bubbleData.map((d) => d.z));
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

  // sorting the data first should help data label positioning. But I am not sure which order it should be sorted.
  // TODO: figure out the correct order.
  Object.keys(dataByZValue).forEach((key) => {
    const numericKey = Number(key);
    dataByZValue[numericKey] = dataByZValue[numericKey].sort(
      (a, b) => a.y - b.y,
    );
  });

  return { maxZValue, dataByZValue };
}

export {
  formatMoldDataForBubbleChart,
  findMedian,
  findAverage,
  separateByZValue,
  generateColors,
  formatHex,
};
