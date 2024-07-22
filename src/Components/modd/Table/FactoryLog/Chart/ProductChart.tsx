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
  const { postData, rawData } = useFactoryLogContext();
  const [eventData, setEventData] = useState<FactoryEventReponse | null>(null);
  const post = rawData?.post;
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const data = postData[department][sysName];
  const [isEventDataReady, setisEventDataReady] = useState(false);

  const options: Highcharts.Options = {
    credits: {
      enabled: false,
    },
    xAxis: {
      categories: ["區間一", "區間二", "區間三", "區間四"],
    },
    yAxis: [
      // Primary axis
      { labels: { align: "right", x: -3 } },
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
      },
    ],
    title: {
      text: sysName,
    },
    series: [
      {
        type: "column",
        name: "cpamt",
        data: data && data["cpamt"] && data["cpamt"],
        color: "blue",
      },
      {
        type: "column",
        name: "pamt",
        data: data && data["pamt"] && data["pamt"],
        color: "green",
      },
      {
        type: "line",
        yAxis: 1,
        name: sysName,
        data: data && data["ar"] && data["ar"],
        color: "black",
        label: {
          formatter: function () {
            return Number(this.name) * 100 + "%";
          },
        },
        tooltip: {
          valueDecimals: 2,
          valueSuffix: "%",
          pointFormatter: function () {
            return (Number(this.y) * 100).toFixed(2) + "%";
          },
        },
      },
      {
        type: "line",
        yAxis: 1,
        name: "標準達成率",
        data: [0.85, 0.85, 0.85, 0.85],
        color: "red",
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
        className="cursor-pointer underline shadow-sm hover:shadow-md focus:text-red-500 desktop:text-base"
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

          <div>
            {eventData && (
              <TempChart department={sysName} rawData={eventData} />
            )}
          </div>
          <div>
            {eventData && (
              <ProgressChart eventData={eventData}>
                <div>this is title </div>
              </ProgressChart>
            )}
          </div>
        </div>
      </Modal>
    </span>
  );
}
