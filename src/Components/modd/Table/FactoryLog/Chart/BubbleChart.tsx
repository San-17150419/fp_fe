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
    const calculateZ = (z: number | undefined) => {
      const normalizedZ = z ?? 0;
      // return normalizedZ + 1;
      return (normalizedZ + 1) * (normalizedZ + 1);
    };
    let arNullCountInfo: [number, string][] = [];
    eventData.data_mold.forEach((event) => {
      if (event["ar"] === null) {
        arNullCountInfo.push([event["ar"], event["prod_name"]]);
      }
      bubbleData.push({
        x: event["ar"] * 100,
        y: event["pamt"],
        z: calculateZ(event["count_repaired"]),
        name: event["prod_name"],
      });
    });

    console.log("arNullCountInfo", arNullCountInfo);
    // console.dir(bubbleData);
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
      height: 650,
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
      title: {
        text: "產能",
        rotation: 0,
      },
      // labels: {
      //   format: "{value} gr",
      // },
      maxPadding: 0.2,
      plotLines: [
        {
          color: "black",
          width: 2,
          value: 50,
          label: {
            align: "right",
            style: {
              fontStyle: "italic",
            },
            text: "Safe sugar intake 50g/day",
            x: -10,
          },
          zIndex: 3,
        },
      ],
      accessibility: {
        rangeDescription: "Range: 0 to 160 grams.",
      },
    },

    tooltip: {
      useHTML: true,
      headerFormat: "<table>",
      pointFormat:
        "<tr><th>產品:</th><td>{point.name} </td></tr>" +
        "<tr><th>達成率:</th><td>{point.x} %</td></tr>" +
        "<tr><th>產能:</th><td>{point.y}</td></tr>" +
        "<tr><th>工時:</th><td>{point.z} hr</td></tr>",
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
        // minSize: 2,
        maxSize: 50,
        minSize: 2,
        sizeByAbsoluteValue: true,
        dataGrouping: {
          enabled: false,
        },
        jitter: {
          x: 1.5,
        },
        dataLabels: {
          align: "left",
          verticalAlign: "top",
          enabled: true,
          allowOverlap: true,
          style: {
            color: "black",
            textOutline: "none",
            fontWeight: "bold",

            fontSize: "0.6rem",
          },
        },
        gapUnit: "relative",
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
      },
    ],
  };
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
