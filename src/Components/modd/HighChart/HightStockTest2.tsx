import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import React, { useState, useEffect, useMemo } from "react";

export default function HighStockTest2() {
  const n = 60,
    s = 100,
    pointStart = Date.UTC(2017, 0, 1),
    pointInterval = 24 * 36e5;

  function getData(n: number) {
    const arr = [];
    let a = 0,
      b = 0,
      c = 0,
      spike;
    for (let i = 0; i < n; i = i + 1) {
      if (i % 100 === 0) {
        a = 2 * Math.random();
      }
      if (i % 1000 === 0) {
        b = 2 * Math.random();
      }
      if (i % 10000 === 0) {
        c = 2 * Math.random();
      }
      if (i % 50000 === 0) {
        spike = 0;
      } else {
        spike = 0;
      }
      arr.push([
        pointStart + i * pointInterval,
        2 * Math.sin(i / 100) + a + b + c + spike + Math.random(),
      ]);
    }
    return arr;
  }

  function getSeries(n: number, s: number): Highcharts.SeriesOptionsType[] {
    const r: Highcharts.SeriesOptionsType[] = [];

    for (let i = 0; i < s; i++) {
      r.push({
        type: "line",
        data: getData(n),
        dataGrouping: {
          enabled: false,
        },
        lineWidth: 2,
        boostThreshold: 1,
        showInNavigator: true,
      });
    }

    return r;
  }

  const memoizedSeries = useMemo(() => getSeries(n, s), [n, s]);
  const options: Highcharts.Options = {
    chart: {
      zooming: {
        type: "x",
      },
    },

    title: {
      text: "Highcharts drawing " + n * s + " points across " + s + " series",
    },

    navigator: {
      xAxis: {
        ordinal: false,
        min: pointStart,
        max: pointStart + n * pointInterval,
      },
      yAxis: {
        min: 0,
        max: 10,
      },
    },

    scrollbar: {
      liveRedraw: false,
    },

    legend: {
      enabled: false,
    },

    xAxis: {
      min: pointStart,
      max: pointStart + n * pointInterval,
      ordinal: false,
    },

    yAxis: {
      min: 0,
      max: 8,
    },

    subtitle: {
      text: "Using the Boost module",
    },

    tooltip: {
      valueDecimals: 2,
      split: false,
    },

    series: memoizedSeries,
  };

  console.time("line");

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={options}
      />
    </div>
  );
}

// console.timeEnd('line');
