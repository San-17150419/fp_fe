import React, { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts, { type Series } from "highcharts";
// import Highcharts from "highcharts/highstock";
import HC_more from "highcharts/highcharts-more";
import { FactoryEventReponse } from "../FactoryLogDataType";
import BrokenAxis from "highcharts/modules/broken-axis";

HC_more(Highcharts);

// TODO:https://jsfiddle.net/menXU/1/ label collision
BrokenAxis(Highcharts);
// TODO: y 軸改用總模次
// TODO: y軸橫線用最高+最低模次 除2
// TODO: group data by sn_num and prod_name
// TODO: Add some type of something to indicate certain data is abnormal. Such as ar or cpamt is null when they should be a number. I am not sure how to deal with this using typescript. In theory, those data should not be null. If I want to enhance type safety, I should use union type to include null and undefined. But if I do this, I will need to add a lot of null and undefined check in the code.
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
      // return (normalizedZ + 1) * (normalizedZ + 1);
      return normalizedZ + 1;
    };

    eventData.data_mold.forEach((event) => {
      // if(event["sn_num"] === "04-001-04")
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
      // width: 1250,
      zooming: {
        type: "xy",
      },
      events: {
        redraw: function () {
          console.log("redraw");
          console.log(this.series[0].data);
          console.log(this.series[0].data[0].getLabelConfig().point.graphic);
          console.log(this.series[0].data[0].getLabelConfig());
          this.series[0].data.forEach((data) => {
            data.x = data.x + 30;
          });
          // TODO: Find relevant data and use it to draw data labels.
          // x, y is the value of the data
          // plotX, plotY is the position of the data on the chart
          // marker is the size of the bubble. Including the radius of the bubble, the height of the bubble, and the width of the bubble.
          // TODO: Maybe I can use `marker` to reposition the bubble. Currently, I use jitter in the series to make the bubble not overlap to a certain degree. But it is not consistent. Manually repositioning all the bubbles might be better.

          console.log(this.series.length);
          function staggerDataLabels(series: Highcharts.Series) {
            const length = series.data.length;
            // if there are less than 2 data points, do nothing.
            if (length < 2) return;
            for (let i = 0; i < length; i++) {
              const point1 = series.data[i];
              const point2 = series.data[i + 1];
            }
          }
        },
      },
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },

    title: {
      text: "達成率/總模次/維修次數",
    },

    xAxis: {
      title: {
        text: "達成率",
      },
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
      // breaks: [
      //   {
      //     from: 100,
      //     to: 180,
      //     breakSize: 10,
      //   },
      // ],
    },

    yAxis: {
      type: "logarithmic",
      startOnTick: false,
      endOnTick: false,
      title: {
        text: "總模次",
        rotation: 0,
      },

      maxPadding: 0.2,
    },

    tooltip: {
      useHTML: true,
      headerFormat: "<table>",
      // https://github.com/highcharts/highcharts/issues/20778
      // the type definition of formatter doesn't include the z index
      formatter: function () {
        console.log(this);
        return `唯一碼: ${this.point.name} <br> 達成率: ${this.point.x.toFixed(2)} % <br> 總模次: ${this.point.y?.toFixed(2)} <br> 維修次數: ${this.point.options.z! - 1} 次`;
      },
    },

    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: "{point.name}",
          allowOverlap: false,
        },
      },
    },

    series: [
      {
        type: "bubble",
        maxSize: 30,
        minSize: 2,
        sizeByAbsoluteValue: true,
        dataGrouping: {
          enabled: false,
        },
        jitter: {
          x: -1.5,
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

        data: generateBubbleData().slice(0, 2),
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

// detect if two lable is overlapping
