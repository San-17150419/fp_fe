import { useRef } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
// import Highcharts from "highcharts/highstock";
import HighchartsExporting from "highcharts/modules/exporting";
import { useTranslation } from "react-i18next";
import highcharts3d from "highcharts/highcharts-3d";
import useWindowDimensions from "../../../../hooks/useWindowDimensions";
type ColumnChartProps = {
  title: string;
  allData: { [key: string]: any };
  visibleRows?: string[];
};

HighchartsExporting(Highcharts);
highcharts3d(Highcharts);
export default function ColumnChart({
  title,
  allData,
  visibleRows,
}: ColumnChartProps) {
  const { t } = useTranslation();
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const { width } = useWindowDimensions();

  function generateColumnData(rawData: { [key: string]: any }) {
    const data: [string, number][] = [];
    const keysToUse = visibleRows || Object.keys(rawData);
    keysToUse.forEach((system: string) => {
      data.push([
        t(system),
        Number((rawData[system]["ar"][3] * 100).toFixed(2)),
      ]);
    });
    data.sort((a, b) => a[1] - b[1]);
    return data;
  }

  const columnData = generateColumnData(allData);
  const options: Highcharts.Options = {
    exporting: {
      buttons: {
        contextButton: {
          menuItems: ["downloadPNG"],
        },
      },
    },
    chart: {
      type: "column",
      // The width of the chart in pixels. It is calculated based on the number of data points in the chart and current window size. The exact formula is not fully clear yet.
      // width: 1500,
      // width: chartWidth,
      // When you set the height as percentage, it will be calculated based on the width.
      width: width * 0.65,
      height: 600,
      options3d: {
        enabled: true,
        alpha: -2,
        beta: 2,
        depth: 80,
        viewDistance: 35,
      },
      scrollablePlotArea: {
        // This will make the chart scrollable. If the plot area is smaller than 500px,
        minWidth: 700,
        scrollPositionX: 1,
      },
      borderWidth: 1,
      borderColor: "#e5e7eb",
      marginTop: 100,
      // Change the position of the title
      spacingTop: 50,
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
    title: {
      text: `${t(title)} (${t("產品達成率")})`,
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
        text: t("達成率"),
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
        name: t("達成率"),
        maxPointWidth: width < 1200 ? 30 : 50,
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
            fontSize: width < 1200 ? "0.5rem" : "0.65rem",
            fontFamily: "Verdana, sans-serif",
          },
        },
      },
    ],
  };

  return (
    <div className="relative isolate flex justify-center">
      <HighchartsReact
        ref={chartRef}
        highcharts={Highcharts}
        constructorType="chart"
        options={options}
      />
    </div>
  );
}
