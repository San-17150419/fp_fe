import {
  Duration,
  Factory,
  type FactoryLogRawData,
} from "./types/factoryLogDataType";
type FormattedData = {
  [key: string]: any;
};
/**
 * Transforms the input data into a formatted data structure.
 *
 * @param {LogData[]} data - The array of LogData to be transformed
 * @return {FormattedData} The formatted data structure
 */
export const transformData = (
  rawData: FactoryLogRawData,
): { data: FormattedData; duration: Array<Duration>; factory: Factory } => {
  const data = rawData.data;
  const factory = rawData.post.factory;
  const duration = rawData.duration;
  const finalDataFormat: FormattedData = {};
  const totalIntervals = 4; // Assuming there are always 4 intervals
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

    sortedData.forEach((dateRange, index) => {
      const { raw } = dateRange;

      raw.forEach((entry) => {
        const { sys, pl, ...points } = entry;

        if (!finalDataFormat[dep][sys]) {
          finalDataFormat[dep][sys] = {};
        }

        Object.keys(points).forEach((point) => {
          if (!finalDataFormat[dep][sys][point]) {
            finalDataFormat[dep][sys][point] = new Array(totalIntervals).fill(
              0,
            );
          }

          // Place the value at the correct interval index
          finalDataFormat[dep][sys][point][index] = points[
            point as keyof typeof points
          ] as number;
        });
      });
    });
  });
  console.log(finalDataFormat);
  return { data: finalDataFormat, factory, duration };
};
