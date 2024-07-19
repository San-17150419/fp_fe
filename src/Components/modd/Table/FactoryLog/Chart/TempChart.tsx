import React, { useRef, useEffect, useState } from "react";
import { useFactoryLogContext } from "../FactoryLogContext";
import HighchartsReact from "highcharts-react-official";

import Highcharts from "highcharts";
// import Highcharts from "highcharts/highstock";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsFullScreen from "highcharts/modules/full-screen";
import { useTranslation } from "react-i18next";
import highcharts3d from "highcharts/highcharts-3d";
import useWindowDimensions from "../../../../../hooks/useWindowDimensions";
import Select from "../../../Select/Select";
import { testData } from "./testData";

type ColumnChartProps = {
  department: string;
  //TODO: Add type for rawData
  rawData: typeof testData;
};

function formatData(d: typeof testData) {
  const data = d.data.map((item) => {
    if (item.ar)
      return [item.prod_name, Number((item.ar * 100).toFixed(2))] as [
        string,
        number,
      ];
  });

  data.sort((a, b) => {
    if (a && b) {
      return a[1] - b[1];
    }
    // handle the case when a or b is undefined
    return 0;
  });
  return data;
}


HighchartsExporting(Highcharts);
// highcharts3d(Highcharts);
HighchartsFullScreen(Highcharts);
export default function TempChart({ department, rawData }: ColumnChartProps) {
  const sampleData = formatData(rawData);
  const { postData } = useFactoryLogContext();
  const { t } = useTranslation();
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const [chartWidth, setChartWidth] = useState(1500);
  const { width } = useWindowDimensions();
  function generateColumnData(rawData: { [key: string]: any }) {
    const data: [string, number][] = [];
    // const departmentData = rawData[department];
    Object.keys(rawData).forEach((system: string) => {
      data.push([t(system), Number((rawData[system]["ar"] * 100).toFixed(2))]);
    });
    data.sort((a, b) => a[1] - b[1]);
    return data;
  }

  useEffect(() => {
    function calculateChartWidth() {
      const columnData = generateColumnData(rawData);
      const minColumnWidth = 50;
      const baseWidth = width / 3;
      return columnData.length * minColumnWidth + baseWidth;
    }
    const calculatedWidth = calculateChartWidth();
    setChartWidth(calculatedWidth);
  }, [width, rawData]);
  // TODO: I need to make sure the datalabel is visible in the chart in every window size
  const columnData = generateColumnData(rawData);
  const options: Highcharts.Options = {
    chart: {
      type: "column",
      // The width of the chart in pixels. It is calculated based on the number of data points in the chart and current window size. The exact formula is not fully clear yet.
      // width: 1500,
      // width: chartWidth,
      // When you set the height as percentage, it will be calculated based on the width.
      width: width * 0.8,
      plotBackgroundColor: "#EBEBEB",
      style: {
        color: "#000000",
        fontFamily: "Arial, sans-serif",
      },
      height: 600,

      // options3d: {
      //   enabled: true,
      //   alpha: -2,
      //   beta: 2,
      //   depth: 80,
      //   viewDistance: 35,
      // },
      scrollablePlotArea: {
        // This will make the chart scrollable. If the plot area is smaller than 500px,
        minWidth: 800,
        scrollPositionX: 1,
      },
      borderWidth: 2,
      borderColor: "#000",
      marginTop: 100,
      // Change the position of the title
      spacingTop: 50,
    },
    colors: ["#595959", "#F8766D", "#A3A500", "#00BF7D", "#00B0F6", "#E76BF3"],
    credits: {
      enabled: false,
    },
    // plotOptions: {
    //   column: {
    //     pointPadding: 0,
    //     borderWidth: 0,
    //     groupPadding: 0,
    //     depth: 50,
    //   },
    // },
    // TODO: Add responsive feature. I am not sure how would I approach this yet. The callback function has access to the chart object. But I don't know what data is in the chart. I might refactor the calculateChartWidth function to dynamicly calculate maxPointWidth, minPointWidth and baseWidth based on the window size(Maybe more). But I haven't figured out the correct fomula yet.

    title: {
      text: `${t(department)} 產品達成率`,
      style: {
        fontSize: "1.5rem",
        fontFamily: "Verdana, sans-serif",
        fontWeight: "bold",
        color: "#000000",
      },
      margin: 30,
    },
    xAxis: {
      type: "category",
      labels: {
        autoRotation: [0, -45],
        rotation: -45,
        // label under the x axis
        style: {
          fontSize: "1rem",
          fontFamily: "Verdana, sans-serif",
          color: "#666666",
        },
      },
      startOnTick: false,
      endOnTick: false,
      gridLineColor: "#FFFFFF",
      gridLineWidth: 1.5,
      tickWidth: 1.5,
      tickLength: 5,
      tickColor: "#666666",
      minorTickInterval: 0,
      minorGridLineColor: "#FFFFFF",
      minorGridLineWidth: 0.5,
    },

    yAxis: {
      labels: {
        autoRotation: [0, -45],

        format: "{value}%",
        style: {
          fontSize: "1rem",
          fontFamily: "Verdana, sans-serif",
          color: "#666666",
        },
      },
      min: 0,
      // label on the y axis
      title: {
        align: "high",
        text: "達成率",
        margin: 40,
        style: {
          fontSize: "1.2rem",
          fontWeight: "bold",
          color: "#000000",
        },
        rotation: 0,
        y: 50,
      },
      tickInterval: 20,
      startOnTick: false,
      endOnTick: false,
      gridLineColor: "#FFFFFF",
      gridLineWidth: 1.5,
      tickWidth: 1.5,
      tickLength: 5,
      tickColor: "#666666",
      minorTickInterval: 0,
      minorGridLineColor: "#FFFFFF",
      minorGridLineWidth: 0.5,
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        type: "column",
        name: "達成率",
        maxPointWidth: width < 1200 ? 10 : 20,
        minPointLength: 10,
        colorByPoint: true,
        data: sampleData as [string, number][],

        dataLabels: {
          format: "{y}%",
          enabled: true,
          color: "#FFFFFF",
          inside: true,
          verticalAlign: "top",
          y: 20,
          style: {
            fontSize: width < 1200 ? "0.5rem" : "0.65rem",
            fontFamily: "Verdana, sans-serif",
          },
        },
      },
    ],
  };

  return (
    <HighchartsReact
      ref={chartRef}
      highcharts={Highcharts}
      constructorType="chart"
      options={options}
    />
  );
}