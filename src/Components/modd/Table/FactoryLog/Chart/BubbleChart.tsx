import HighchartsReact from "highcharts-react-official";
import Highcharts, {
  SeriesBubbleOptions,
  type Series,
  type SeriesOptionsType,
} from "highcharts";
import HC_more from "highcharts/highcharts-more";
import { FactoryEventReponse } from "../FactoryLogDataType";
import BrokenAxis from "highcharts/modules/broken-axis";
import { stringify } from "flatted";
import useWindowDimensions from "../../../../../hooks/useWindowDimensions";
import Gradient from "./test";
import { useEffect, useState } from "react";
import {
  findAverage,
  findMedian,
  formatMoldDataForBubbleChart,
  separateByZValue,
  generateColors,
} from "../../../../../util/bubbleChartUtils";

// TODO: Add some type of something to indicate certain data is abnormal. Such as ar or cpamt is null when they should be a number. I am not sure how to deal with this using typescript. In theory, those data should not be null. If I want to enhance type safety, I should use union type to include null and undefined. But if I do this, I will need to add a lot of null and undefined check in the code.
// TODO:https://jsfiddle.net/menXU/1/ label collision

type BubbleChartProps = {
  eventData: FactoryEventReponse;
};

HC_more(Highcharts);
BrokenAxis(Highcharts);
export default function BubbleChart({ eventData }: BubbleChartProps) {
  const { width } = useWindowDimensions();
  const [series, setSeries] = useState<
    [x: number, y: number, z: number, name?: string, color?: string][]
  >([]);

  const bubbleData = formatMoldDataForBubbleChart({
    data_mold: eventData.data_mold,
    xKey: "ar",
    yKey: "pamt",
    zKey: "count_repaired",
    nameKey: "sn_num",
  });

  const { dataByZValue: separateData, maxZValue } =
    separateByZValue(bubbleData);
  const yArray = eventData.data_mold.map((event) => event["pamt"]);
  // const yAverage = findAverage(yArray);
  const yMedian = findMedian(yArray);
  const colorsArray = generateColors("#fca5a5", "#991b1b", maxZValue + 1);
  const xMin =
    Math.min(...eventData.data_mold.map((event) => event["ar"])) * 100;

  const xMax =
    Math.max(...eventData.data_mold.map((event) => event["ar"])) * 100;

  const generateSeries = () => {
    const series: SeriesBubbleOptions[] = [
      // An invisible series for maintaining visual consistency. In bubble charts, the size of the bubble is relative to the z value. Bubbles that have the lowsest z value have the smallest size which is `minSize`. If in chart A, the lowest z value is 2, then bubbles with z values of 2 will be the smallest. In chart B, the lowest z value is 0, then bubbles with z values of 0 will be the smallest. If you caompare chart A and chart B, it will looks like bubbles with z values of 2 in chart A have the same size as bubbles with z values of 0 in chart B. Visually, it can be misleading. By adding an invisible series that garantees the lowest z value is always 0, it maintains the visual consistency across charts.
    ];
    // Have to cast the default config as SeriesBubbleOptions. Otherwise, when mapping through the `separateData` object, typescript will throw an error.
    const defaultConfig: SeriesBubbleOptions = {
      type: "bubble",

      maxSize: maxZValue * 10 + 10,

      minSize: 10,

      sizeBy: "width",

      dataGrouping: {
        enabled: false,
      },

      jitter: {
        x: 0.5,
      },

      dataLabels: {
        align: "center",

        verticalAlign: "top",

        enabled: true,

        allowOverlap: true,

        y: -15,

        style: {
          color: "black",

          textOutline: "none",

          fontWeight: "bold",

          fontSize: "0.5rem",
        },
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
      });
    });
    // Object.values(separateData).map((data, index) => {
    //   series.push({
    //     ...defaultConfig,
    //     data: data as Highcharts.PointOptionsObject[],
    //     color: colorsArray[index],
    //     legendIndex: index,
    //     name: `維修次數: ${index}`,
    //   });
    // });
    series.push({
      type: "bubble",
      maxSize: maxZValue * 10 + 10,

      minSize: 10,

      sizeBy: "width",
      data: [
        [999, 9999999999999, 0],
        [999, 9999999999999, 1],
      ],
      legendIndex: 999,
      visible: false,
      showInLegend: false,
    });

    return series;
  };

  const options: Highcharts.Options = {
    chart: {
      type: "bubble",
      plotBorderWidth: 1,
      height: 650,
      width: width * 0.67,
      zooming: {
        type: "xy",
      },
      // TODO: Handle null values
      events: {
        load: function () {
          this.series.forEach((series) => {
            staggerDataLabels(series);
          });
          // staggerDataLabels(this.series[0]);
        },
        redraw: function () {
          const series = this.series[0];
          setTimeout(() => {
            staggerDataLabels(series);
          }, 1000);
        },
      },
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: true,
    },
    title: {
      text: "達成率/總模次/維修次數",
    },
    xAxis: {
      title: {
        text: "達成率",
      },
      max: xMax + 5,
      min: xMin - 5,
      labels: {
        format: "{value} %",
      },
      plotLines: [
        {
          color: "black",
          width: 2,
          value: 85,
          label: {
            rotation: 0,
            y: 15,
            style: {
              fontStyle: "italic",
            },
            text: "標準產能 (85%)",
          },
          zIndex: 3,
        },
      ],
    },
    yAxis: {
      type: "logarithmic",
      startOnTick: false,
      endOnTick: false,
      title: {
        style: {
          fontSize: "1.25rem",
          fontWeight: "bold",
        },
        text: "總模次",
        margin: 40,
        rotation: 0,
      },
      labels: {
        style: {
          fontSize: "0.75rem",
        },
      },
      maxPadding: 0.1,
      plotLines: [
        {
          color: "black",
          width: 2,
          value: yMedian,
          label: {
            rotation: 0,
            style: {
              fontStyle: "italic",
            },
            text: "中間值",
            // text: "平均值",
          },
          zIndex: 3,
        },
      ],
    },

    tooltip: {
      useHTML: true,
      headerFormat: "<table>",
      // https://github.com/highcharts/highcharts/issues/20778
      // the type definition of formatter doesn't include the z index
      formatter: function () {
        // console.log(this);
        return `唯一碼: ${this.point.name} <br> 達成率: ${this.point.x.toFixed(2)} % <br> 總模次: ${this.point.y?.toFixed(2)} <br> 維修次數: ${this.point.options.z} 次`;
      },
    },

    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: "{point.name}",
          allowOverlap: false,
        },
        marker: {
          fillOpacity: 0.9,
        },
      },
    },

    // series: generateSeries(),
    series: generateSeries(),
  };

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
}

function staggerDataLabels(series: Highcharts.Series) {
  if (series.points.length < 2) {
    return;
  }
  for (let i = 0; i < series.points.length - 1; i++) {
    const pointA = series.points[i];
    const pointB = series.points[i + 1];

    // if one of the points is undefined, skip the loop
    if (!pointA || !pointB) {
      return;
    }

    // Need to be careful after this. datalabels are type any. So there won't be any warning from typescript
    const dataLabelA = (pointA as any).dataLabel;
    const dataLabelB = (pointB as any).dataLabel;
    const diff = dataLabelB.y - dataLabelA.y;
    const h = dataLabelA.height + 2;

    if (!dataLabelA || !dataLabelB) {
      return;
    }

    if (isLabelOnLabel(pointA, pointB)) {
      if (diff < 0)
        dataLabelA.translate(
          dataLabelA.translateX,
          dataLabelA.translateY - (h + diff),
        );
      else
        dataLabelB.translate(
          dataLabelB.translateX,
          dataLabelB.translateY - (h - diff),
        );
    }
  }
}

type PartialDataLabel = {
  x: number;
  y: number;
  width: number;
  height: number;
};
function isLabelOnLabel(
  pointA: Highcharts.Point,
  pointB: Highcharts.Point,
): boolean {
  const dataLabelA: PartialDataLabel = (pointA as any).dataLabel;
  const dataLabelB: PartialDataLabel = (pointB as any).dataLabel;
  const al = dataLabelA.x - dataLabelA.width / 2;
  const ar = dataLabelA.x + dataLabelA.width / 2;
  const bl = dataLabelB.x - dataLabelB.width / 2;
  const br = dataLabelB.x + dataLabelB.width / 2;

  const at = dataLabelA.y;
  const ab = dataLabelA.y + dataLabelA.height;
  const bt = dataLabelB.y;
  const bb = dataLabelB.y + dataLabelB.height;

  if (bl > ar || br < al) {
    return false;
  } //overlap not possible
  if (bt > ab || bb < at) {
    return false;
  } //overlap not possible
  if (bl > al && bl < ar) {
    return true;
  }
  if (br > al && br < ar) {
    return true;
  }

  if (bt > at && bt < ab) {
    return true;
  }
  if (bb > at && bb < ab) {
    return true;
  }

  return false;
}
