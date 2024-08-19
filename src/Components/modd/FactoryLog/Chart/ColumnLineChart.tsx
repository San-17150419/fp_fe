import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import useWindowDimensions from "../../../../hooks/useWindowDimensions";
import { useTranslation } from "react-i18next";
import { type Duration } from "../types";

type ColumnLineChartProps = {
  duration: Duration[];
  postData: Record<string, any>;
  title: string;
};

export default function ColumnLineChart({
  duration,
  postData,
  title,
}: ColumnLineChartProps) {
  console.log(title);
  const { t } = useTranslation();
  const data = postData[title];
  function setCategories() {
    const dateRange = duration.toReversed();
    const categories: string[] = [];
    dateRange.forEach((date: { date_start: string; date_end: string }) => {
      if (date.date_end === "9999-12-31") {
        categories.push(date.date_start + " 至 " + "現在");
      }
      categories.push(date.date_start + " 至 " + date.date_end);
    });
    return categories;
  }
  const { width } = useWindowDimensions();
  Highcharts.setOptions({
    lang: {
      thousandsSep: ",",
    },
  });
  const options: Highcharts.Options = {
    exporting: {
      buttons: {
        contextButton: {
          menuItems: ["downloadPNG"],
        },
      },
    },
    credits: {
      enabled: false,
    },
    chart: {
      height: 600,
      width: width * 0.64,
      borderWidth: 1,
      borderColor: "#e5e7eb",
    },
    tooltip: {
      shared: true,
    },
    plotOptions: {
      series: {
        marker: {
          enabled: true,
          symbol: "circle",
        },
      },
    },
    xAxis: {
      categories: setCategories(),
    },
    yAxis: [
      // Primary axis
      {
        labels: { align: "right", x: -3 },
        title: {
          text: t("產能"),
          style: {
            fontSize: "1rem",
            fontWeight: "bold",
            color: "#000000",
          },
          margin: 40,
          rotation: 0,
        },
      },
      // Secondary axis
      {
        labels: {
          align: "right",
          x: 30,
          formatter: function () {
            return Number(this.value) * 100 + "%";
          },
        },
        min: 0,
        title: {
          text: t("達成率"),
          style: {
            fontSize: "1rem",
            fontWeight: "bold",
            color: "#000000",
          },
          margin: 40,
          rotation: 0,
          x: 30,
        },
        opposite: true,
        plotLines: [
          {
            value: 0.85,
            width: 2,
            zIndex: 6,
            dashStyle: "ShortDot",
            color: "#e11d48",
            label: {
              text: "85%",
              y: -15,
              x: 20,
              style: {
                color: "red",
                fontSize: "1rem",
                textAlign: "center",
              },
            },
          },
        ],
      },
    ],
    title: {
      text: t(title),
    },
    series: [
      // Primary yAxis (cpamt)
      {
        type: "column",
        name: t("cpamt"),
        data: data && data["cpamt"] && data["cpamt"],
        color: "#38bdf8", //sky-400
      },
      // Primary yAxis (pamt)
      {
        type: "column",
        name: t("pamt"),
        data: data && data["pamt"] && data["pamt"],
        color: "#86efac", //green-300
      },

      // Secondary yAxis (ar)
      {
        type: "line",
        yAxis: 1,
        name: t("達成率"),
        data: data && data["ar"] && data["ar"],
        color: "black",

        tooltip: {
          pointFormatter: function () {
            return (
              "● " +
              t("達成率") +
              ": " +
              (Number(this.y) * 100).toFixed(2) +
              "%"
            );
          },

          valueSuffix: "%",
        },
        dataLabels: {
          enabled: true,
          y: -10,
          formatter: function () {
            return (Number(this.y) * 100).toFixed(2) + "%";
          },
        },
      },
    ],
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={"chart"}
      options={options}
    />
  );
}
