import React, { useEffect, useState, useRef } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import Highcharts3d from "highcharts/highcharts-3d";
import HC_more from "highcharts/highcharts-more";
import BrokenAxis from "highcharts/modules/broken-axis";
import { FactoryEventReponse } from "../FactoryLogDataType";

Highcharts3d(Highcharts);
HC_more(Highcharts);
BrokenAxis(Highcharts);
// Highcharts.setOptions({
//   colors: Highcharts.getOptions().colors.map(function (color) {
//     return {
//       radialGradient: {
//         cx: 0.4,
//         cy: 0.3,
//         r: 0.5,
//       },
//       stops: [
//         [0, color],
//         [1, Highcharts.color(color).brighten(-0.2).get("rgb")],
//       ],
//     };
//   }),
// });

// Set up the
// https://www.highcharts.com/docs/extending-highcharts/extending-highcharts
// https://blacklabel.github.io/projections/
// https://github.com/highcharts/highcharts-react/issues/163

type ScatterChart3DProps = {
  eventData: FactoryEventReponse;
};

type Options3d = Highcharts.Options & Highcharts.Chart3dOptions;
export default function ScatterChart3D({ eventData }: ScatterChart3DProps) {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  function generateScatterData(): [number, number, number][] {
    const scatterData: [number, number, number][] = [];
    eventData.data.forEach((event) => {
      scatterData.push([event["ar"] * 100, event["pamt"], event["wt"]]);
    });
    console.dir(scatterData);
    return scatterData;
  }

  const scatterData = generateScatterData();
  const xAxisMin = Math.min(...scatterData.map((d) => d[0]));
  const options: Highcharts.Options = {
    chart: {
      // renderTo: "container1",
      margin: 100,
      type: "scatter3d",
      animation: false,
      options3d: {
        enabled: true,
        alpha: 10,
        beta: 20,
        depth: 250,
        viewDistance: 5,
        fitToPlot: false,
        frame: {
          bottom: { size: 1, color: "rgba(0,0,0,0.02)" },
          back: { size: 1, color: "rgba(0,0,0,0.04)" },
          front: { size: 1, color: "rgba(0,0,0,0.06)" },
        },
      },
    },
    title: {
      text: "Draggable box",
    },
    // subtitle: {
    //   text: "Click and drag the plot area to rotate in space",
    // },
    // plotOptions: {
    //   scatter: {},
    // },
    yAxis: {
      type: "logarithmic",
      // TODO:It seems like 3d scatter chart cannot add plotlines
    },
    xAxis: {
      // type: "logarithmic",
      min: xAxisMin - 10,
      gridLineWidth: 1,
      breaks: [
        {
          from: 110,
          to: 180,
          breakSize: 10,
        },
      ],
    },
    zAxis: {
      showFirstLabel: false,
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        type: "scatter3d",
        name: "Data",
        accessibility: {
          exposeAsGroupOnly: true,
        },

        data: generateScatterData(),
      },
    ],
  };

  // const chart = new Highcharts.Chart("container1", options);

  // (function (H) {
  //   function startDrag(eventStart: MouseEvent | TouchEvent) {
  //     const eStart = chart.pointer.normalize(eventStart);
  //     const posX = eStart.chartX;
  //     const posY = eStart.chartY;
  //     const alpha = chart.options?.chart?.options3d?.alpha;
  //     const beta = chart.options?.chart?.options3d?.beta;
  //     const sensitibility = 5;
  //     const eventHandlers: Function[] = [];
  //     function drag(eventStart: MouseEvent | TouchEvent) {
  //       eventStart = chart.pointer.normalize(eventStart);
  //       if (alpha === undefined || beta === undefined) {
  //         return;
  //       }
  //       chart.update(
  //         {
  //           chart: {
  //             options3d: {
  //               alpha: alpha + (eStart.chartY - posY) / sensitibility,
  //               beta: beta + (posX - eStart.chartX) / sensitibility,
  //             },
  //           },
  //         },
  //         undefined,
  //         undefined,
  //         false,
  //       );
  //     }

  //     function unbindAll() {
  //       eventHandlers.forEach(function (fn) {
  //         if (fn) {
  //           fn();
  //         }
  //       });
  //       eventHandlers.length = 0;
  //     }

  //     eventHandlers.push(H.addEvent(document, "mousemove", drag));
  //     eventHandlers.push(H.addEvent(document, "touchmove", drag));
  //     eventHandlers.push(H.addEvent(document, "mouseup", unbindAll));
  //     eventHandlers.push(H.addEvent(document, "touchend", unbindAll));
  //   }

  //   H.addEvent(chart.container, "mouseDown", startDrag);

  //   H.addEvent(chart.container, "touchStart", startDrag);
  // })(Highcharts);
  function chartCallback(chart: Highcharts.Chart) {
    function startDrag(eventStart: MouseEvent | TouchEvent) {
      const eStart = chart.pointer.normalize(eventStart);
      const posX = eStart.chartX;
      const posY = eStart.chartY;
      const alpha = chart.options.chart?.options3d?.alpha;
      const beta = chart.options.chart?.options3d?.beta;
      const sensitivity = 5;
      const eventHandlers: Function[] = [];

      function drag(eventMove: MouseEvent | TouchEvent) {
        const eMove = chart.pointer.normalize(eventMove);
        if (alpha === undefined || beta === undefined) {
          return;
        }
        chart.update({
          chart: {
            options3d: {
              alpha: alpha + (eMove.chartY - posY) / sensitivity,
              beta: beta + (posX - eMove.chartX) / sensitivity,
            },
          },
        }, false, false, false);
      }

      function unbindAll() {
        eventHandlers.forEach(fn => fn());
        eventHandlers.length = 0;
      }

      eventHandlers.push(Highcharts.addEvent(document, 'mousemove', drag));
      eventHandlers.push(Highcharts.addEvent(document, 'touchmove', drag));
      eventHandlers.push(Highcharts.addEvent(document, 'mouseup', unbindAll));
      eventHandlers.push(Highcharts.addEvent(document, 'touchend', unbindAll));
    }

    Highcharts.addEvent(chart.container, 'mousedown', startDrag);
    Highcharts.addEvent(chart.container, 'touchstart', startDrag);
  }

  return (
    <div id="container1">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        callback={chartCallback}
        ref={chartComponentRef}
      />
    </div>
  );
}
