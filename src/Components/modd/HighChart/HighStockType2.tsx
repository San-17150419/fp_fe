import { useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Annotations from "highcharts/modules/annotations";

Annotations(Highcharts);

type DataPoint = {
  x: number;
  y: number;
};

type SeriesData = {
  name: string;
  data: DataPoint[];
  color: string;
};

const getEvenWeekTicks = () => {
  const ticks = [];
  const startDate = new Date(Date.UTC(2000, 0, 1)); // start from January 1, 2000
  for (let i = 1; i <= 52; i += 2) {
    ticks.push(Date.UTC(startDate.getUTCFullYear(), 0, i * 7));
  }
  return ticks;
};

function getWeekNumber(d: Date) {
  // Get the first day of the year
  const start = new Date(d.getFullYear(), 0, 1);
  const diff = d.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.floor(diff / oneWeek) + 1;
}
const HighStockTest = ({
  data,
  title,
}: {
  data: SeriesData[];
  title: string;
}) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  const options: Highcharts.Options = {
    legend: {
      enabled: true,

      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      itemStyle: {
        fontWeight: "bolder",
      },
    },
    chart: {
      type: "line",
      height: 600,
    },
    title: {
      text: title,
    },
    yAxis: {
      title: {
        text: "RMB/MT",
      },
      minPadding: 0.2,
      maxPadding: 0.2,
    },
    xAxis: {
      type: "category",

      tickPositions: [
        0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36,
        38, 40, 42, 44, 46, 48, 50, 52,
      ],
      // min: 0,
      title: {
        text: "週數",
      },
      // labels: {
      //   allowOverlap: true,
      // },
      // tickAmount: 20,
      tickInterval: 1000 * 60 * 60 * 24 * 14,
    },
    series: data.map((item) => ({
      name: item.name,
      data: item.data,
      type: "line",
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

export default HighStockTest;
