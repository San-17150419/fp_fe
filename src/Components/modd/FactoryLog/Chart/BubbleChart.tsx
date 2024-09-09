import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import HC_more from "highcharts/highcharts-more";
import { FactoryEventReponse } from "../types/factoryLogDataType";
import BrokenAxis from "highcharts/modules/broken-axis";
import useWindowDimensions from "../../../../hooks/useWindowDimensions";
import { useTranslation } from "react-i18next";
import { generateBubbleChartConfig } from "../utils/bubbleChartUtils";

type BubbleChartProps = {
  eventData: FactoryEventReponse;
  xKey?: string;
  key: "data_mold" | "data";
  yKey?: string;
  zKey?: string | null;
};
HC_more(Highcharts);
BrokenAxis(Highcharts);
export default function BubbleChart({
  eventData,
  key,
  xKey,
  yKey,
  zKey,
}: BubbleChartProps) {
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  const filteredData = (() => {
    if (key === "data") {
      return eventData[key]
        .filter((event) => !!event["ar"])
        .map((event) => {
          return {
            ...event,
            pamt: key === "data" && Math.trunc(event.pamt),
          };
        });
    }
    if (key === "data_mold") {
      return eventData[key]
        .filter((event) => !!event["ar"])
        .map((event) => {
          return {
            ...event,
            mamt: key === "data_mold" && Math.trunc(event.mamt),
          };
        });
    }
  })();
  const sysName = eventData.post.sys;
  const { xMin, xMax, yMedian, generateSeries } = generateBubbleChartConfig(
    filteredData,
    xKey,
    yKey,
    zKey,
  );
  console.dir(generateSeries());

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
    chart: {
      type: "bubble",
      plotBorderWidth: 1,
      height: 600,
      width: width * 0.64,
      borderWidth: 1,
      borderColor: "#e5e7eb",
      zooming: {
        type: "xy",
      },
    },
    subtitle: {
      text: `${eventData.post.date_start} ~ ${eventData.post.date_end}`,
      style: {
        color: "#666666",
        padding: "15px",
        margin: "15px",
        top: "10px",
      },
      align: "center",
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: true,
    },
    title: {
      text: `${t(sysName)} ${t("達成率")}/${t("總模次")}/${t("維修次數")} `,
    },
    xAxis: {
      title: {
        text: t("達成率"),
      },
      max: xMax + 5 <= 100 ? 100 : xMax + 5,
      min: xMin - 5,
      lineColor: "black",
      lineWidth: 1,
      labels: {
        format: "{value} %",
      },
      plotLines: [
        {
          color: "black",
          width: 2,
          value: 85,
          label: {
            rotation: 0,
            y: 15,
            style: {
              fontStyle: "italic",
            },
            text: "標準產能 (85%)",
          },
          zIndex: 8,
        },
      ],
    },
    yAxis: {
      startOnTick: false,
      endOnTick: false,
      title: {
        style: {
          fontSize: "1rem",
          fontWeight: "bold",
          color: "#000000",
        },
        text: t("總模次"),

        margin: 40,
        rotation: 0,
      },
      labels: {
        style: {
          fontSize: "0.75rem",
        },
      },
      maxPadding: 0.1,
      plotLines: [
        {
          color: "black",
          width: 2,
          value: yMedian,
          label: {
            rotation: 0,
            style: {
              fontStyle: "italic",
            },
            text: t("中間值"),
          },
          zIndex: 8,
        },
      ],
    },
    tooltip: {
      borderWidth: 0,
      padding: 0,
      useHTML: true,
      headerFormat: "<table>",
      // For me, enable followPointer is not a good experience. It feels like you're lagging.
      // followPointer: true,
      // https://github.com/highcharts/highcharts/issues/20778
      // the type definition of formatter doesn't include the z index
      formatter: function () {
        // thousandsSep somehow does not work here. I am not sure why. Maybe because I am using html? Or formatter?
        return `<div style="text-align:left; padding: 0.25rem; background-color: #FFFFFF";  display: flex; flex-direction: column; > <p>● ${t("唯一碼")}: ${this.point.name}</p> <br> <p>● ${t("達成率")}: ${this.point.x.toFixed(2)} % </p><br> <p>● ${t("總模次")}: ${Number(this.point.y?.toFixed(0)).toLocaleString()} </p><br> <p>● ${t("維修次數")}: ${this.point.options.z} 次</p></div>`;
      },
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: "{point.name}",
          allowOverlap: false,
        },
        marker: {
          fillOpacity: 1,
        },
      },
    },
    series: generateSeries(),
  };

  return (
    // <div className="flex w-[95%] justify-center border border-gray-200">
    <HighchartsReact highcharts={Highcharts} options={options} />
    // </div>
  );
}
