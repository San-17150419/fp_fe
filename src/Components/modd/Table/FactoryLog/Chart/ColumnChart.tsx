import React, { useRef, useEffect, useState } from "react";
import { useFactoryLogContext } from "../FactoryLogContext";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
// import Highcharts from "highcharts/highstock";
import HighchartsExporting from "highcharts/modules/exporting";
import { useTranslation } from "react-i18next";
import highcharts3d from "highcharts/highcharts-3d";
import useWindowDimensions from "../../../../../hooks/useWindowDimensions";

type ColumnChartProps = {
  department: string;
};

HighchartsExporting(Highcharts);
highcharts3d(Highcharts);
export default function ColumnChart({ department }: ColumnChartProps) {
  const { postData } = useFactoryLogContext();
  const { t } = useTranslation();
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const [chartWidth, setChartWidth] = useState(1500);
  const { width } = useWindowDimensions();
  function generateColumnData() {
    const data: [string, number][] = [];
    const departmentData = postData[department];
    Object.keys(departmentData).forEach((system: string) => {
      data.push([
        t(system),
        Number((departmentData[system]["ar"][2] * 100).toFixed(2)),
      ]);
    });
    return data;
  }

  useEffect(() => {
    function calculateChartWidth() {
      const columnData = generateColumnData();
      const minColumnWidth = 50;
      const baseWidth = width / 6;
      return columnData.length * minColumnWidth + baseWidth;
    }
    const calculatedWidth = calculateChartWidth();
    setChartWidth(calculatedWidth);
  }, [postData, department, width]);
  // TODO: I need to make sure the datalabel is visible in the chart in every window size
  const columnData = generateColumnData();
  const options: Highcharts.Options = {
    chart: {
      type: "column",
      // The width of the chart in pixels. It is calculated based on the number of data points in the chart and current window size. The exact formula is not fully clear yet.
      // width: 1500,
      width: chartWidth,
      // When you set the height as percentage, it will be calculated based on the width.
      height: "50%",
      options3d: {
        enabled: true,
        alpha: 0,
        beta: 5,
        depth: 50,
        viewDistance: 25,
      },
      className: "highcharts-container",
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      column: {
        pointPadding: 0,
        borderWidth: 0,
        groupPadding: 0,
        depth: 50,
      },
    },
    // TODO: Add responsive feature. I am not sure how would I approach this yet. The callback function has access to the chart object. But I don't know what data is in the chart. I might refactor the calculateChartWidth function to dynamicly calculate maxPointWidth, minPointWidth and baseWidth based on the window size(Maybe more). But I haven't figured out the correct fomula yet.
    // responsive: {
    //   rules: [
    //     {
    //       condition: {
    //         callback: function () {
    //           if (width < 1200) return true;
    //           return false;
    //         },
    //       },
    //       chartOptions: {
    //         chart: {},
    //       },
    //     },
    //   ],
    // },
    title: {
      text: `${t(department)} 產品達成率`,
      style: {
        fontSize: "1.5rem",
        fontFamily: "Verdana, sans-serif",
        fontWeight: "bold",
        color: "#333",
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
        },
      },
    },
    yAxis: {
      labels: {
        autoRotation: [0, -45],

        format: "{value}%",
        style: {
          fontSize: "1rem",
          fontFamily: "Verdana, sans-serif",
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
          color: "#333",
        },
        rotation: 0,
        y: 50,
      },
      tickInterval: 20,
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        type: "column",
        name: "達成率",
        maxPointWidth: 30,
        minPointLength: 10,
        colorByPoint: true,
        data: columnData,

        dataLabels: {
          format: "{y}%",
          enabled: true,
          color: "#FFFFFF",
          inside: true,
          verticalAlign: "top",
          y: 20,
          style: {
            fontSize: "0.65rem",
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
