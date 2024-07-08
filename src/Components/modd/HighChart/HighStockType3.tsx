import React, { useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Annotations from "highcharts/modules/annotations";
import { Type3ChartData } from "./highChartTypes"; // Ensure correct path

Annotations(Highcharts);

const getEvenMonthTicks = () => {
  const ticks = [];
  const startDate = new Date(Date.UTC(2000, 0, 1)); // start from January 1, 2000
  for (let i = 1; i <= 12; i += 2) {
    ticks.push(Date.UTC(startDate.getUTCFullYear(), i, 1));
  }
  return ticks;
};

type HighStockTestProps = {
  data: Type3ChartData[];
};

const HighStockType3: React.FC<HighStockTestProps> = ({ data }) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  Highcharts.setOptions({
    lang: {
      months: [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月",
      ],
      shortMonths: [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月",
      ],
      weekdays: [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ],
    },
  });

  const options: Highcharts.Options = {
    chart: {
      type: "spline",
      height: 500,
      width: 1600,
      plotBorderWidth: 1,
      plotBorderColor: "black",
    },
    title: {
      text: "",
    },
    yAxis: {
      title: {
        text: "",
      },
      gridLineWidth: 0,
    },
    xAxis: {
      type: "datetime",
      tickPositions: getEvenMonthTicks(),
      dateTimeLabelFormats: {
        millisecond: "%b ",
        second: "%b ",
        minute: "%b ",
        hour: "%b ",
        day: "%b ",
        week: "%b ",
        month: "%b ",
        year: "%B ",
      },
      tickAmount: 12,
      tickInterval: 1000 * 60 * 60 * 24 * 30,
      title: {
        text: "月份",
      },
    },
    series: data.map((item) => ({
      name: item.name,
      data: item.data,
      type: "spline",
      color: item.color,
    })),
    time: {
      useUTC: true,
    },
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={chartRef}
      constructorType={"chart"}
    />
  );
};

export default HighStockType3;
