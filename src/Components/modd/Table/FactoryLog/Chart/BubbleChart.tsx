import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import HC_more from "highcharts/highcharts-more";

HC_more(Highcharts);
const options: Highcharts.Options = {
  chart: {
    type: "bubble",
    plotBorderWidth: 1,
    zooming: {
      type: "xy",
    },
  },
  legend: {
    enabled: false,
  },
  title: {
    text: "bubble chart test 1",
  },
  xAxis: {
    title: {
      text: "產能",
    },
  },
  yAxis: {
    title: {
      text: "達成率",
    },
  },
  series: [
    {
      type: "bubble",
      data: [
        ["系列一", 10, 1],
        ["系列二", 20, 2],
        ["系列三", 30, 3],
      ],
    },
  ],
};
export default function BubbleChart() {
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
