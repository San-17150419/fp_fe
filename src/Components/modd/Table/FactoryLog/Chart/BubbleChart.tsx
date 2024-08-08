import HighchartsReact from "highcharts-react-official";
import Highcharts, { SeriesBubbleOptions } from "highcharts";
import HC_more from "highcharts/highcharts-more";
import { FactoryEventReponse } from "../FactoryLogDataType";
import BrokenAxis from "highcharts/modules/broken-axis";
import useWindowDimensions from "../../../../../hooks/useWindowDimensions";
import { useState } from "react";
import {
  findMedian,
  formatMoldDataForBubbleChart,
  separateByZValue,
  generateColors,
  findAverage,
} from "../../../../../util/bubbleChartUtils";

// TODO: Add some type of something to indicate certain data is abnormal. Such as ar or cpamt is null when they should be a number. I am not sure how to deal with this using typescript. In theory, those data should not be null. If I want to enhance type safety, I should use union type to include null and undefined. But if I do this, I will need to add a lot of null and undefined check in the code.
// TODO:https://jsfiddle.net/menXU/1/ label collision
// TODO: Make it easier to identify which data label belongs to which bubble. Maybe increase the font size according to the z value?

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
  console.dir(eventData);

  const bubbleData = formatMoldDataForBubbleChart({
    data_mold: eventData.data_mold,
    xKey: "ar",
    yKey: "pamt",
    zKey: "count_repaired",
    nameKey: "sn_num",
  });

  const sysName = eventData.post.sys;
  const { dataByZValue: separateData, maxZValue } =
    separateByZValue(bubbleData);
  const yArray = eventData.data_mold.map((event) => event["pamt"]);
  const yAverage = findAverage(yArray);
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
    };
    Object.keys(separateData).map((key, index) => {
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
          // zIndex: 9 + index,

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
        // load: function () {
        //   this.series.forEach((series) => {
        //     staggerDataLabels(series);
        //   });
        // },
        // redraw: function () {
        //   const series = this.series[0];
        //   this.series.forEach((series) => {
        //     series.points.forEach((point) => {
        //       console.log(point);
        //     });
        //   });
        //   setTimeout(() => {
        //     staggerDataLabels(series);
        //   }, 1000);
        // },
      },
    },
    subtitle: {
      text: `${eventData.post.date_start} ~ ${eventData.post.date_end}`,
      style: {
        color: "#666666",
        padding: "15px",
        margin: "15px",

        top: "10px",
      },
      align: "center",
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: true,
    },
    title: {
      text: `${sysName} (達成率/總模次/維修次數) `,
    },
    xAxis: {
      title: {
        text: "達成率",
      },
      max: xMax + 5 <= 100 ? 100 : xMax + 5,
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
          zIndex: 8,
        },
      ],
    },
    yAxis: {
      type: "logarithmic",
      startOnTick: false,
      endOnTick: false,
      title: {
        style: {
          fontSize: "0.8rem",
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
          zIndex: 8,
        },
        {
          color: "black",
          width: 2,
          value: yAverage,
          label: {
            rotation: 0,
            style: {
              fontStyle: "italic",
            },
            // text: "中間值",
            text: "平均值",
          },
          zIndex: 8,
        },
      ],
    },

    tooltip: {
      borderWidth: 0,
      padding: 0,
      useHTML: true,
      headerFormat: "<table>",
      // For me, enable followPointer is not a good experience. It feels like you're lagging.
      // followPointer: true,
      // https://github.com/highcharts/highcharts/issues/20778
      // the type definition of formatter doesn't include the z index
      formatter: function () {
        // The
        //
        return `<div style="text-align:left; padding: 0.5rem; background-color: #FFFFFF";  display: flex; flex-direction: column; > <p>● 唯一碼: ${this.point.name}</p> <br> <p>● 達成率: ${this.point.x.toFixed(2)} % </p><br> <p>● 總模次: ${this.point.y?.toFixed(2)} </p><br> <p>● 維修次數: ${this.point.options.z} 次</p></div>`;
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
          fillOpacity: 1,
        },
      },
    },
    series: generateSeries(),
  };

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
}
