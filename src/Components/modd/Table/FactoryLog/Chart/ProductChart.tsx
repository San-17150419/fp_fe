import React, { useEffect, useState } from "react";
import Modal from "../../../Modal/NonDialogModal";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useFactoryLogContext } from "../FactoryLogContext";
import { useTranslation } from "react-i18next";
import BulletChart from "./BulletChart";
import axios from "axios";
import TempChart from "./TempChart";
type ProductChartProps = {
  title: string;
  department: string;
};

export default function ProductChart({
  title: sysName,
  department,
}: ProductChartProps) {
  const { postData, rawData } = useFactoryLogContext();
  const [eventData, setEventData] = useState<any>({});
  const post = rawData?.post;
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const data = postData[department][sysName];
  const [isEventDataReady, setisEventDataReady] = useState(false);

  const options: Highcharts.Options = {
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

  //   {
  //     "factory"   : "GD",
  //     "department": "INJ",
  //     "sys"       : "CE系列",
  //     "date_start": "2023-01-01",
  //     "date_end"  : "9999-12-31"
  // }
  const fetchEventData = async () => {
    if (!rawData?.post) return;

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
      setisEventDataReady(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <span>
      <button
        type="button"
        className="cursor-pointer underline shadow-sm hover:shadow-md desktop:text-base"
        onClick={() => {
          setIsOpen(true);
          fetchEventData();
        }}
      >
        {t(sysName)}
      </button>

      <Modal onClose={() => setIsOpen(false)} openModal={isOpen}>
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={"chart"}
          options={options}
        />
        {/* <HighchartsReact
          highcharts={Highcharts}
          constructorType={"chart"}
          options={options}
        /> */}

        {/* <div>
          <BulletChart title={title} department={department} />
        </div> */}
        <div>
          {isEventDataReady && (
            <TempChart department="CE" rawData={eventData} />
          )}
        </div>
      </Modal>
    </span>
  );
}
