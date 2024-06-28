import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import HighchartsAnnotations from "highcharts/modules/annotations";

type HighStockTestProps = {
  processedData: [number, number][];
};

HighchartsAnnotations(Highcharts);

const HighStockTest: React.FC<HighStockTestProps> = ({ processedData }) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  useEffect(() => {
    const chart = chartComponentRef.current?.chart;
    if (!chart) return;

    const updateAnnotations = () => {
      const xAxis = chart.xAxis[0];
      const seriesData = chart.series[0].points;

      const visiblePoints = seriesData.filter((point) => {
        return point.x >= xAxis.min! && point.x <= xAxis.max!;
      });

      let highest = visiblePoints[0];
      let lowest = visiblePoints[0];

      visiblePoints.forEach((point) => {
        if (
          point.y !== undefined &&
          highest.y !== undefined &&
          lowest.y !== undefined
        ) {
          if (point.y > highest.y) {
            highest = point;
          }
          if (point.y < lowest.y) {
            lowest = point;
          }
        }
      });

      if (
        !highest ||
        !lowest ||
        !highest.plotX ||
        !highest.plotY ||
        !lowest.plotX ||
        !lowest.plotY ||
        !highest.y ||
        !lowest.y
      ) {
        return;
      }
      chart.removeAnnotation("highest");
      chart.removeAnnotation("lowest");
      chart.addAnnotation({
        labels: [
          {
            point: { x: highest.x, y: highest.y, xAxis: 0, yAxis: 0 },
            text: `最高點: ${highest.y}`,
          },
        ],
        labelOptions: {
          backgroundColor: "red",
          borderColor: "red",
          style: {
            color: "white",
          },
          verticalAlign: "top",
          y: -30,
        },
      });

      chart.addAnnotation({
        labels: [
          {
            point: { x: lowest.x, y: lowest.y, xAxis: 0, yAxis: 0 },
            text: `最低點: ${lowest.y}`,
          },
        ],
        labelOptions: {
          backgroundColor: "green",
          borderColor: "green",
          style: {
            color: "white",
          },
          verticalAlign: "bottom",
          y: 10,
        },
      });
    };

    const originalSetExtremes = chart.xAxis[0].setExtremes.bind(chart.xAxis[0]);
    chart.xAxis[0].setExtremes = function (
      min,
      max,
      redraw,
      animation,
      eventArguments,
    ) {
      originalSetExtremes(min, max, redraw, animation, eventArguments);
      updateAnnotations();
    };

    updateAnnotations();
  }, [processedData]);

  const options: Highcharts.Options = {
    chart: {
      backgroundColor: "#ededeb",
      type: "stock",
    },
    time: {
      timezone: "Asia/Taipei",
    },
    rangeSelector: {
      selected: 1,
      buttons: [
        { type: "month", count: 6, text: "半年" },
        { type: "year", count: 1, text: "一年" },
        { type: "year", count: 2, text: "兩年" },
        { type: "year", count: 3, text: "三年" },
        { type: "all", text: "全部" },
      ],
      inputDateFormat: "%B %e, %Y",
      inputEditDateFormat: "%B %e, %Y",
      inputStyle: {
        color: "#2f56a3",
        fontWeight: "bolder",
      },
    },
    title: {
      text: "PP Price History",
    },
    xAxis: {
      events: {
        afterSetExtremes: function () {
          const chart = this.chart;
          const seriesData = chart.series[0].points;
          const visiblePoints = seriesData.filter(
            (point) => point.x >= this.min! && point.x <= this.max!,
          );

          let highest = visiblePoints[0];
          let lowest = visiblePoints[0];

          visiblePoints.forEach((point) => {
            if (
              point.y !== undefined &&
              highest.y !== undefined &&
              lowest.y !== undefined
            ) {
              if (point.y > highest.y) {
                highest = point;
              }
              if (point.y < lowest.y) {
                lowest = point;
              }
            }
          });

          if (
            !highest ||
            !lowest ||
            !highest.plotX ||
            !highest.plotY ||
            !lowest.plotX ||
            !lowest.plotY ||
            !highest.y ||
            !lowest.y
          ) {
            return;
          }

          chart.addAnnotation({
            labels: [
              {
                point: { x: highest.x, y: highest.y, xAxis: 0, yAxis: 0 },
                text: `三年內最高點: ${highest.y}`,
              },
            ],
            labelOptions: {
              backgroundColor: "red",
              borderColor: "red",
              style: {
                color: "white",
              },
              verticalAlign: "top",
              y: -30,
            },
          });

          chart.addAnnotation({
            labels: [
              {
                point: { x: lowest.x, y: lowest.y, xAxis: 0, yAxis: 0 },
                text: `三年內最低點: ${lowest.y}`,
              },
            ],
            labelOptions: {
              backgroundColor: "green",
              borderColor: "green",
              style: {
                color: "white",
              },
              verticalAlign: "bottom",
              y: 10,
            },
          });
        },
      },
      dateTimeLabelFormats: {
        millisecond: "%y 年 %b ",
        second: "%y 年 %b ",
        minute: "%y 年 %b ",
        hour: "%y 年 %b ",
        day: "%y 年 %b ",
        week: "%y 年 %b ",
        month: "%y 年 %b ",
        year: "%y 年 %b ",
      },
      width: "100%",
    },
    yAxis: [
      {
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: "RMB/MT",
          style: {
            fontWeight: "bolder",
          },
        },
        height: "100%",
        lineWidth: 4,
        resize: {
          enabled: true,
        },
        lineColor: "transparent",
      },
    ],
    tooltip: {
      split: true,
      dateTimeLabelFormats: {
        millisecond: "%b %e, %Y",
        second: "%b %e, %Y",
        minute: "%b %e, %Y",
        hour: "%b %e, %Y",
        day: "%b %e, %Y",
        week: "%b %e, %Y",
        month: "%b %e, %Y",
        year: "%b %e, %Y",
      },
    },
    series: [
      {
        type: "line",
        name: "PP Price",
        color: "#e67784",
        data: processedData,
        tooltip: {
          valueDecimals: 2,
        },
      },
    ],
  };

  return (
    <div className="bg-gray-300">
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={options}
        ref={chartComponentRef}
      />
    </div>
  );
};

export default HighStockTest;


// import React, { useEffect, useRef, useState } from "react";
// import Highcharts from "highcharts/highstock";
// import HighchartsReact from "highcharts-react-official";
// import HighchartsAnnotations from "highcharts/modules/annotations";

// type HighStockTestProps = {
//   processedData: [number, number][];
// };

// HighchartsAnnotations(Highcharts);

// const HighStockTest: React.FC<HighStockTestProps> = ({ processedData }) => {
//   const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
//   const [highestAnnotationId, setHighestAnnotationId] = useState<string | null>(null);
//   const [lowestAnnotationId, setLowestAnnotationId] = useState<string | null>(null);

//   useEffect(() => {
//     const chart = chartComponentRef.current?.chart;
//     if (!chart) return;

//     const updateAnnotations = () => {
//       const xAxis = chart.xAxis[0];
//       const seriesData = chart.series[0].points;

//       const visiblePoints = seriesData.filter((point) => {
//         return point.x >= xAxis.min! && point.x <= xAxis.max!;
//       });

//       let highest = visiblePoints[0];
//       let lowest = visiblePoints[0];

//       visiblePoints.forEach((point) => {
//         if (
//           point.y !== undefined &&
//           highest.y !== undefined &&
//           lowest.y !== undefined
//         ) {
//           if (point.y > highest.y) {
//             highest = point;
//           }
//           if (point.y < lowest.y) {
//             lowest = point;
//           }
//         }
//       });

//       // Remove existing annotations
//       if (highestAnnotationId) {
//         chart.removeAnnotation(highestAnnotationId);
//       }
//       if (lowestAnnotationId) {
//         chart.removeAnnotation(lowestAnnotationId);
//       }

//       if (!highest || !lowest || !highest.plotX || !highest.plotY || !lowest.plotX || !lowest.plotY ||!highest.y || !lowest.y) {
//         return;
//       }

//       const highestAnnotation = chart.addAnnotation({
//         labels: [{
//           point: { x: highest.x, y: highest.y, xAxis: 0, yAxis: 0 },
//           text: `最高點: ${highest.y}`
//         }],
//         labelOptions: {
//           backgroundColor: 'red',
//           borderColor: 'red',
//           style: {
//             color: 'white'
//           },
//           verticalAlign: 'top',
//           y: -30
//         }
//       });

//       const lowestAnnotation = chart.addAnnotation({
//         labels: [{
//           point: { x: lowest.x, y: lowest.y, xAxis: 0, yAxis: 0 },
//           text: `最低點: ${lowest.y}`
//         }],
//         labelOptions: {
//           backgroundColor: 'green',
//           borderColor: 'green',
//           style: {
//             color: 'white'
//           },
//           verticalAlign: 'bottom',
//           y: 10
//         }
//       });

//       // Update state with annotation IDs
//       setHighestAnnotationId(highestAnnotation.id);
//       setLowestAnnotationId(lowestAnnotation.id);
//     };

//     // Ensure updateAnnotations is called on initial load and whenever setExtremes is called
//     chart.xAxis[0].update({ events: { afterSetExtremes: updateAnnotations } });

//     updateAnnotations();
//   }, [processedData, highestAnnotationId, lowestAnnotationId]);

//   const options: Highcharts.Options = {
//     chart: {
//       backgroundColor: "#ededeb",
//       type: "stock",
//     },
//     time: {
//       timezone: "Asia/Taipei",
//     },
//     rangeSelector: {
//       selected: 1,
//       buttons: [
//         { type: "month", count: 6, text: "半年" },
//         { type: "year", count: 1, text: "一年" },
//         { type: "year", count: 2, text: "兩年" },
//         { type: "year", count: 3, text: "三年" },
//         { type: "all", text: "全部" },
//       ],
//       inputDateFormat: "%B %e, %Y",
//       inputEditDateFormat: "%B %e, %Y",
//       inputStyle: {
//         color: "#2f56a3",
//         fontWeight: "bolder",
//       },
//     },
//     title: {
//       text: "PP Price History",
//     },
//     xAxis: {
//       events: {
//         afterSetExtremes: function () {
//           const chart = this.chart;
//           const seriesData = chart.series[0].points;
//           const visiblePoints = seriesData.filter(
//             (point) => point.x >= this.min! && point.x <= this.max!,
//           );

//           let highest = visiblePoints[0];
//           let lowest = visiblePoints[0];

//           visiblePoints.forEach((point) => {
//             if (point.y! > highest.y!) {
//               highest = point;
//             }
//             if (point.y! < lowest.y!) {
//               lowest = point;
//             }
//           });

//           // Remove existing annotations
//           if (highestAnnotationId) {
//             chart.removeAnnotation(highestAnnotationId);
//           }
//           if (lowestAnnotationId) {
//             chart.removeAnnotation(lowestAnnotationId);
//           }

//           if (!highest || !lowest || !highest.plotX || !highest.plotY || !lowest.plotX || !lowest.plotY) {
//             return;
//           }

//           const highestAnnotation = chart.addAnnotation({
//             labels: [{
//               point: { x: highest.x, y: highest.y, xAxis: 0, yAxis: 0 },
//               text: `三年內最高點: ${highest.y}`
//             }],
//             labelOptions: {
//               backgroundColor: 'red',
//               borderColor: 'red',
//               style: {
//                 color: 'white'
//               },
//               verticalAlign: 'top',
//               y: -30
//             }
//           });

//           const lowestAnnotation = chart.addAnnotation({
//             labels: [{
//               point: { x: lowest.x, y: lowest.y!, xAxis: 0, yAxis: 0 },
//               text: `三年內最低點: ${lowest.y}`
//             }],
//             labelOptions: {
//               backgroundColor: 'green',
//               borderColor: 'green',
//               style: {
//                 color: 'white'
//               },
//               verticalAlign: 'bottom',
//               y: 10
//             }
//           });

//           // Update state with annotation IDs
//           setHighestAnnotationId(highestAnnotation.id);
//           setLowestAnnotationId(lowestAnnotation.id);
//         },
//       },
//       dateTimeLabelFormats: {
//         millisecond: "%y 年 %b ",
//         second: "%y 年 %b ",
//         minute: "%y 年 %b ",
//         hour: "%y 年 %b ",
//         day: "%y 年 %b ",
//         week: "%y 年 %b ",
//         month: "%y 年 %b ",
//         year: "%y 年 %b ",
//       },
//       width: "100%",
//     },
//     yAxis: [
//       {
//         labels: {
//           align: "right",
//           x: -3,
//         },
//         title: {
//           text: "RMB/MT",
//           style: {
//             fontWeight: "bolder",
//           },
//         },
//         height: "100%",
//         lineWidth: 4,
//         resize: {
//           enabled: true,
//         },
//         lineColor: "transparent",
//       },
//     ],
//     tooltip: {
//       split: true,
//       dateTimeLabelFormats: {
//         millisecond: "%b %e, %Y",
//         second: "%b %e, %Y",
//         minute: "%b %e, %Y",
//         hour: "%b %e, %Y",
//         day: "%b %e, %Y",
//         week: "%b %e, %Y",
//         month: "%b %e, %Y",
//         year: "%b %e, %Y",
//       },
//     },
//     series: [
//       {
//         type: "line",
//         name: "PP Price",
//         color: "#e67784",
//         data: processedData,
//         tooltip: {
//           valueDecimals: 2,
//         },
//       },
//     ],
//   };

//   return (
//     <div className="bg-gray-300">
//       <HighchartsReact
//         highcharts={Highcharts}
//         constructorType={"stockChart"}
//         options={options}
//         ref={chartComponentRef}
//       />
//     </div>
//   );
// };

// export default HighStockTest;

