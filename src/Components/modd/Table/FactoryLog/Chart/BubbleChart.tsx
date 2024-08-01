import React, { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
// import Highcharts from "highcharts/highstock";
import HC_more from "highcharts/highcharts-more";
import { FactoryEventReponse } from "../FactoryLogDataType";
import BrokenAxis from "highcharts/modules/broken-axis";

HC_more(Highcharts);

BrokenAxis(Highcharts);
// TODO: y 軸改用總模次
// TODO: y軸橫線用最高+最低模次 除2
// TODO: group data by sn_num and prod_name
// TODO: Add some type of something to indicate certain data is abnormal. Such as ar or cpamt is null when they should be a number. I am not sure how to deal with this using typescript. In theory, those data should not be null. If I want to enhance type safety, I should use union type to include null and undefined. But if I do this, I will need to add a lot of null and undefined check in the code.
type BubbleChartProps = {
  eventData: FactoryEventReponse;
};
export default function BubbleChart({ eventData }: BubbleChartProps) {
  // useEffect(() => {
  //   function GroupDataBySnNum(data: FactoryEventReponse["data_mold"]) {
  //     const groupedData: {
  //       [key: string]: FactoryEventReponse["data_mold"][0];
  //     } = {};
  //     data.forEach((d) => {
  //       if (groupedData[d["sn_num"]] === undefined) {
  //         groupedData[d["sn_num"]] = d;
  //       } else {
  //         const { ar, cpamt } = groupedData[d["sn_num"]];
  //         groupedData[d["sn_num"]] = {
  //           ...groupedData[d["sn_num"]],
  //           ...d,
  //         };
  //       }
  //     });
  //     return groupedData;
  //   }

  //   const groupedData = GroupDataBySnNum(eventData.data_mold);
  // });
  function generateBubbleData(): {
    x: number;
    y: number;
    z: number;
    name: string;
  }[] {
    const bubbleData: { x: number; y: number; z: number; name: string }[] = [];
    const calculateZ = (z: number | undefined) => {
      const normalizedZ = z ?? 0;
      // return (normalizedZ + 1) * (normalizedZ + 1);
      return normalizedZ + 1;
    };

    eventData.data_mold.forEach((event) => {
      // if(event["sn_num"] === "04-001-04")
      // if (event["prod_name"] === "CE2")
      bubbleData.push({
        x: event["ar"] * 100,
        // y: event["pamt_h"],//機均產出
        y: event["mamt"], //總模次
        // y: event["pamt"] / event["mamt"], //總產量/總模次
        z: calculateZ(event["count_repaired"]),
        // name: event["prod_name"],
        name: event["sn_num"],
      });
    });

    // console.dir(bubbleData);
    return bubbleData;
  }

  function createProdNameObject(eventData: FactoryEventReponse) {
    const result: Record<string, number[]> = {};

    eventData.data_mold.forEach((d) => {
      if (!result[d["prod_name"]]) {
        result[d["prod_name"]] = [];
      }
      result[d["prod_name"]].push(Number((d["pamt"] / d["mamt"]).toFixed(2)));
    });

    return result;
  }

  const prodNameObject = createProdNameObject(eventData);
  console.dir(prodNameObject);
  const bubbleData = generateBubbleData();
  const xAxisMin = Math.min(...bubbleData.map((d) => d["x"]));
  const xAxisMax = Math.max(...bubbleData.map((d) => d["x"]));
  const yAxisMin = Math.min(...bubbleData.map((d) => d["y"]));
  const yAxisMax = Math.max(...bubbleData.map((d) => d["y"]));

  const options: Highcharts.Options = {
    chart: {
      type: "stock",
      plotBorderWidth: 1,
      height: 650,
      width: 1250,
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
      // type: "logarithmic",
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
    },

    tooltip: {
      useHTML: true,
      headerFormat: "<table>",
      // https://github.com/highcharts/highcharts/issues/20778
      // the type definition of formatter doesn't include the z index
      formatter: function () {
        console.log(this);
        return `產品: ${this.point.name} <br> 達成率: ${this.point.x.toFixed(2)} % <br> 產能: ${this.point.y?.toFixed(2)} <br> 工時: ${Math.sqrt(this.point.options.z!) - 1} hr`;
      },
    },

    plotOptions: {
      series: {
        dataGrouping: {
          enabled: true,
          approximation: "average",
        },
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
        maxSize: 30,
        minSize: 2,
        sizeByAbsoluteValue: true,
        dataGrouping: {
          enabled: false,
        },
        jitter: {
          x: 2.5,
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

        data: generateBubbleData(),
      },
    ],
  };
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      // constructorType="stockChart"
    />
  );
}
