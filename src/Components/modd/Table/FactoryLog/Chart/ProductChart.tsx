import React, { useEffect, useState } from "react";
import Modal from "../../../Modal/NonDialogModal";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useFactoryLogContext } from "../FactoryLogContext";
import { useTranslation } from "react-i18next";
import BulletChart from "./BulletChart";
import axios from "axios";
import TempChart from "./TempChart";
import ProgressBar from "./ProgressBar";
import ProgressChart from "./ProgressChart";
import { type FactoryEventReponse } from "../FactoryLogDataType";
import BubbleChart from "./BubbleChart";
type ProductChartProps = {
  title: string;
  department: string;
};

// This component is responsible for fetching the event data from the server.
// How do I decide the date_start and date_end?
export default function ProductChart({
  title: sysName,
  department,
}: ProductChartProps) {
  const { postData, rawData, duration } = useFactoryLogContext();
  const [eventData, setEventData] = useState<FactoryEventReponse | null>(null);
  const post = rawData?.post;
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const data = postData[department][sysName];

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
  const [isEventDataReady, setisEventDataReady] = useState(false);

  const options: Highcharts.Options = {
    credits: {
      enabled: false,
    },
    tooltip: {
      shared: true,
    },
    xAxis: {
      // categories: ["區間一", "區間二", "區間三", "區間四"],
      categories: setCategories(),
    },
    yAxis: [
      // Primary axis
      { labels: { align: "right", x: -3 }, title: { text: "產能" } },
      // Secondary axis
      {
        labels: {
          align: "right",
          x: -3,

          formatter: function () {
            return Number(this.value) * 100 + "%";
          },
        },
        min: 0,
        title: { text: "達成率" },
        opposite: true,
        plotLines: [
          {
            value: 0.85,
            width: 2,
            color: "#e11d48",
            zIndex: 5,
            label: {
              text: "85%",
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
        label: {
          formatter: function () {
            return "產能" + Number(this.name) * 100 + "%";
          },
        },

        tooltip: {
          valueDecimals: 2,
          valueSuffix: "%",

          pointFormatter: function () {
            return "產能: " + (Number(this.y) * 100).toFixed(2) + "%";
          },
        },
      },
    ],
  };

  const fetchEventData = async () => {
    if (!rawData?.post) return;
    // Use date_start as the date_end
    // Calculate the date_start based on the date_type. For example, if the date_type is "half-year", the date_start should be 6 months ago.
    // The problem right now is I am not sure if the event data will have missing data like rawData.
    const startDate = new Date(rawData.post.date_start);
    const interval = rawData.post.date_type === "half-year" ? 6 : 4;
    const endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() - interval,
      startDate.getDate(),
    )
      .toISOString()
      .split("T")[0];

    try {
      const response = await axios.post(
        "http://192.168.123.240:9000/api/fj/event-data/",
        {
          factory: rawData.post.factory,
          department,
          sys: sysName,
          date_start: endDate,
          date_end: rawData.post.date_start,
        },
      );

      setEventData(response.data);
      console.log(response.data);
      setisEventDataReady(true);
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
          <div>
            {eventData && (
              <TempChart department={sysName} rawData={eventData} />
            )}
          </div>
          <hr />
          <div>
            {eventData && (
              <ProgressChart eventData={eventData}>
                <div>this is title </div>
              </ProgressChart>
            )}
          </div>
          <BubbleChart />
        </div>
      </Modal>
    </span>
  );
}
