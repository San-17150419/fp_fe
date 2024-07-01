import React, { useEffect, useRef } from "react";
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

const HighStockTest = ({ data }: { data: SeriesData[] }) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  console.log(data);
  // useEffect(() => {
  //   const chart = chartRef.current?.chart;
  //   if (!chart) return;

  //   // Find highest, lowest, and current points
  //   const allPoints = data.flatMap((series) => series.data);
  //   console.log(allPoints);
  //   const highestPoint = allPoints.reduce((prev, curr) =>
  //     prev.y > curr.y ? prev : curr,
  //   );
  //   const lowestPoint = allPoints.reduce((prev, curr) =>
  //     prev.y < curr.y ? prev : curr,
  //   );
  //   const currentPoint = allPoints[allPoints.length - 1];

  //   // Add annotations for highest, lowest, and current points
  //   chart.addAnnotation({
  //     labels: [
  //       {
  //         point: {
  //           xAxis: 0,
  //           yAxis: 0,
  //           x: highestPoint.x,
  //           y: highestPoint.y,
  //         },
  //         text: `最高價格: ¥${highestPoint.y}`,
  //         backgroundColor: "red",
  //         borderColor: "red",
  //         style: {
  //           color: "white",
  //         },
  //       },
  //     ],
  //   });

  //   chart.addAnnotation({
  //     labels: [
  //       {
  //         point: {
  //           xAxis: 0,
  //           yAxis: 0,
  //           x: lowestPoint.x,
  //           y: lowestPoint.y,
  //         },
  //         text: `最低價格: ¥${lowestPoint.y}`,
  //         backgroundColor: "green",
  //         borderColor: "green",
  //         style: {
  //           color: "white",
  //         },
  //       },
  //     ],
  //   });

  //   chart.addAnnotation({
  //     labels: [
  //       {
  //         point: {
  //           xAxis: 0,
  //           yAxis: 0,
  //           x: currentPoint.x,
  //           y: currentPoint.y,
  //         },
  //         text: `目前價格: ¥${currentPoint.y}`,
  //         backgroundColor: "blue",
  //         borderColor: "blue",
  //         style: {
  //           color: "white",
  //         },
  //       },
  //     ],
  //   });

  //   // Update annotations when the chart is updated
  //   const updateAnnotations = () => {
  //     chart.addAnnotation({
  //       labels: [
  //         {
  //           point: {
  //             xAxis: 0,
  //             yAxis: 0,
  //             x: highestPoint.x,
  //             y: highestPoint.y,
  //           },
  //           text: `最高價格: ¥${highestPoint.y}`,
  //           backgroundColor: "red",
  //           borderColor: "red",
  //           style: {
  //             color: "white",
  //           },
  //         },
  //       ],
  //     });

  //     chart.addAnnotation({
  //       labels: [
  //         {
  //           point: {
  //             xAxis: 0,
  //             yAxis: 0,
  //             x: lowestPoint.x,
  //             y: lowestPoint.y,
  //           },
  //           text: `最低價格: ¥${lowestPoint.y}`,
  //           backgroundColor: "green",
  //           borderColor: "green",
  //           style: {
  //             color: "white",
  //           },
  //         },
  //       ],
  //     });

  //     chart.addAnnotation({
  //       labels: [
  //         {
  //           point: {
  //             xAxis: 0,
  //             yAxis: 0,
  //             x: currentPoint.x,
  //             y: currentPoint.y,
  //           },
  //           text: `目前價格: ¥${currentPoint.y}`,
  //           backgroundColor: "blue",
  //           borderColor: "blue",
  //           style: {
  //             color: "white",
  //           },
  //         },
  //       ],
  //     });
  //   };

  //   chart.update(
  //     {
  //       xAxis: {
  //         events: {
  //           afterSetExtremes: updateAnnotations,
  //         },
  //       },
  //     },
  //     false,
  //     false,
  //     false,
  //   );
  // }, [data]);

  const options: Highcharts.Options = {
    chart: {
      type: "line",
      height: 600,
    },
    title: {
      text: "螺絲線材",
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
      min: 0,
      // minPadding: 0.2,
      // maxPadding: 0.2,
      title: {
        text: "週數",
      },
      labels: {
        allowOverlap: true,
      },
      tickInterval: 2,
      tickmarkPlacement: "between",
      tickPosition: "outside",
    },
    series: data.map((item) => ({
      name: item.name,
      data: item.data,
      type: "line",
      color: item.color,
    })),
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
