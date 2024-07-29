import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import HC_more from "highcharts/highcharts-more";
import { FactoryEventReponse } from "../FactoryLogDataType";
import BrokenAxis from "highcharts/modules/broken-axis";

HC_more(Highcharts);

BrokenAxis(Highcharts);

// const options: Highcharts.Options = {
//   chart: {
//     type: "bubble",
//     plotBorderWidth: 1,
//     zooming: {
//       type: "xy",
//     },
//   },
//   legend: {
//     enabled: false,
//   },
//   title: {
//     text: "bubble chart test 1",
//   },
//   xAxis: {
//     categories: [
//       "系列一",
//       "系列二",
//       "系列三",
//       "系列四",
//       "系列五",
//       "系列六",
//       "系列七",
//       "系列八",
//       "系列九",
//       "系列十",
//     ],
//     title: {
//       text: "產能",
//     },
//     plotLines: [
//       {
//         color: "black",
//         width: 2,
//         value: 65,
//         label: {
//           rotation: 0,
//           y: 15,
//           style: {
//             fontStyle: "italic",
//           },
//           text: "Safe fat intake 65g/day",
//         },
//       },
//     ],
//   },
//   yAxis: {
//     title: {
//       text: "達成率",
//     },
//   },
//   series: [
//     {
//       type: "bubble",
//       data: [
//         ["系列一", 10, 1],
//         ["系列二", 20, 2],
//         ["系列三", 30, 7],
//         ["系列四", 30, 1],
//         ["系列五", 40, 2],
//         ["系列六", 20, 6],
//         ["系列七", 70, 4],
//         ["系列八", 40, 2],
//       ],
//     },
//   ],
// };

type BubbleChartProps = {
  eventData: FactoryEventReponse;
};
export default function BubbleChart({ eventData }: BubbleChartProps) {
  function generateBubbleData(): {
    x: number;
    y: number;
    z: number;
    name: string;
  }[] {
    const bubbleData: { x: number; y: number; z: number; name: string }[] = [];
    eventData.data.forEach((event) => {
      bubbleData.push({
        x: event["ar"] * 100,
        y: event["pamt"],
        z: event["wt"],
        name: event["prod_name"],
      });
    });
    console.dir(bubbleData);
    return bubbleData;
  }

  const bubbleData = generateBubbleData();
  const xAxisMin = Math.min(...bubbleData.map((d) => d["x"]));
  const xAxisMax = Math.max(...bubbleData.map((d) => d["x"]));
  const yAxisMin = Math.min(...bubbleData.map((d) => d["y"]));
  const yAxisMax = Math.max(...bubbleData.map((d) => d["y"]));

  const options: Highcharts.Options = {
    chart: {
      type: "bubble",
      plotBorderWidth: 1,
      height: 700,
      zooming: {
        type: "xy",
      },
    },

    legend: {
      enabled: false,
    },

    title: {
      text: "產能與達成率",
    },

    // subtitle: {
    //   text: 'Source: <a href="http://www.euromonitor.com/">Euromonitor</a> and <a href="https://data.oecd.org/">OECD</a>',
    // },

    // accessibility: {
    //   point: {
    //     valueDescriptionFormat:
    //       "{index}. {point.name}, fat: {point.x}g, " +
    //       "sugar: {point.y}g, obesity: {point.z}%.",
    //   },
    // },

    xAxis: {
      title: {
        text: "達成率",
      },
      labels: {
        format: "{value} %",
      },
      min: xAxisMin >= 20 ? xAxisMin - 10 : xAxisMin,
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
      breaks: [
        {
          from: 100,
          to: 180,
          breakSize: 10,
        },
      ],
    },

    yAxis: {
      type: "logarithmic",
      startOnTick: false,
      endOnTick: false,
      // breaks: [{ from: 70000000, to: 100000000, breakSize: 1 }],
      title: {
        text: "產能",
      },
      // labels: {
      //   format: "{value} gr",
      // },
      maxPadding: 0.2,
      // plotLines: [
      //   {
      //     color: "black",
      //     width: 2,
      //     value: 50,
      //     label: {
      //       align: "right",
      //       style: {
      //         fontStyle: "italic",
      //       },
      //       text: "Safe sugar intake 50g/day",
      //       x: -10,
      //     },
      //     zIndex: 3,
      //   },
      // ],
      // accessibility: {
      //   rangeDescription: "Range: 0 to 160 grams.",
      // },
    },

    tooltip: {
      useHTML: true,
      headerFormat: "<table>",
      pointFormat:
        "<tr><th>達成率:</th><td>{point.x} %</td></tr>" +
        "<tr><th>產能:</th><td>{point.y}</td></tr>" +
        "<tr><th>工時:</th><td>{point.z} hr</td></tr>",
      footerFormat: "</table>",
      followPointer: true,
    },

    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: "{point.name}",
        },
      },
    },

    series: [
      {
        type: "bubble",
        maxSize: "10%",
        dataLabels: {
          align: "left",
          verticalAlign: "top",
          enabled: true,
          style: {
            color: "black",
            textOutline: "none",
            fontWeight: "bold",

            fontSize: "0.6rem",
          },
        },
        // gapUnit: "relative",
        point: {
          events: {
            click: function (event) {
              // console.log(event);

              alert(
                `產品:${event.point.name} \n 達成率:${event.point.x} \n 產能:${event.point.y} \n 工時:${event.point}`,
              );
            },
          },
        },
        stacking: "stream",
        // dataGrouping: { enabled: false, },
        gapSize: 10,

        data: generateBubbleData(),
        // data: [
        //   { x: 95, y: 95, z: 13.8, name: "BE" },
        //   { x: 86.5, y: 102.9, z: 14.7, name: "DE" },
        //   { x: 80.8, y: 91.5, z: 15.8, name: "FI" },
        //   { x: 80.4, y: 102.5, z: 12, name: "NL" },
        //   { x: 80.3, y: 86.1, z: 11.8, name: "SE" },
        //   { x: 78.4, y: 70.1, z: 16.6, name: "ES" },
        //   { x: 74.2, y: 68.5, z: 14.5, name: "FR" },
        //   { x: 73.5, y: 83.1, z: 10, name: "NO" },
        //   { x: 71, y: 93.2, z: 24.7, name: "UK" },
        //   { x: 69.2, y: 57.6, z: 10.4, name: "IT" },
        //   { x: 68.6, y: 20, z: 16, name: "RU" },
        //   {
        //     x: 65.5,
        //     y: 126.4,
        //     z: 35.3,
        //     name: "US",
        //   },
        //   { x: 65.4, y: 50.8, z: 28.5, name: "HU" },
        //   { x: 63.4, y: 51.8, z: 15.4, name: "PT" },
        //   { x: 64, y: 82.9, z: 31.3, name: "NZ" },
        // ],
      },
    ],
  };
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
