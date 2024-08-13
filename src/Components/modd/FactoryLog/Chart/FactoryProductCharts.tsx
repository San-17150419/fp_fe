import { useState } from "react";
import Modal from "../../Modal/NonDialogModal";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Factory, type FactoryEventReponse } from "../FactoryLogDataType";
import BubbleChart from "./BubbleChart";
import useWindowDimensions from "../../../../hooks/useWindowDimensions";
type ProductChartProps = {
  factory: Factory;
  duration: { date_start: string; date_end: string }[];
  postData: Record<string, any>;
  title: string;
  department: string;
};

// This component is responsible for fetching the event data from the server.
export default function ProductChart({
  factory,
  postData,
  duration,
  title: sysName,
  department,
}: ProductChartProps) {
  const { width } = useWindowDimensions();
  const [eventData, setEventData] = useState<FactoryEventReponse | null>(null);
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const data = postData[sysName];
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

  Highcharts.setOptions({
    lang: {
      thousandsSep: ",",
    },
  });
  const options: Highcharts.Options = {
    credits: {
      enabled: false,
    },
    chart: {
      height: 600,
      width: width * 0.67,
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
          text: "產能",
          style: {
            fontSize: "1rem",
            fontWeight: "bold",
            color: "#000000",
          },
          margin: 40,
          rotation: 0,
          x: 20,
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
          text: "達成率",
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
      text: t(sysName),
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
              "● " + t("產能") + ": " + (Number(this.y) * 100).toFixed(2) + "%"
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

  const fetchEventData = async () => {
    try {
      const response = await axios.post(
        "http://192.168.123.240:9000/api/fj/event-data/",
        {
          factory: factory,
          department,
          sys: sysName,
          date_start: duration[0].date_start,
          date_end: duration[0].date_end,
        },
      );
      setEventData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <span>
      <button
        type="button"
        className="cursor-pointer text-xs underline shadow-sm hover:shadow-md focus:text-red-500"
        onClick={() => {
          setIsOpen(true);
          fetchEventData();
        }}
      >
        {t(sysName)}
      </button>

      <Modal onClose={() => setIsOpen(false)} isOpen={isOpen}>
        <div className="flex h-full flex-col gap-4">
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={"chart"}
            options={options}
          />
          <hr />
          {/* <div>
            {eventData && (
              <TempChart department={sysName} rawData={eventData} />
            )}
          </div>
          <hr /> */}
          {department === "INJ" && eventData && (
            <BubbleChart eventData={eventData} />
          )}
        </div>
        <hr />
        {/* <div>
          {eventData && (
            <ProgressChart eventData={eventData}>
              <div>this is title </div>
            </ProgressChart>
          )}
        </div> */}
      </Modal>
    </span>
  );
}
