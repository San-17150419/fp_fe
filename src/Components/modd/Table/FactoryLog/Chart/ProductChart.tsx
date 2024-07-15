import React, { useState } from "react";
import Modal from "../../../Modal/NonDialogModal";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useFactoryLogContext } from "../FactoryLogContext";
import { useTranslation } from "react-i18next";
import BulletChart from "./BulletChart";
type ProductChartProps = {
  title: string;
  department: string;
};

export default function ProductChart({ title, department }: ProductChartProps) {
  //   console.log(title, department);
  const { postData } = useFactoryLogContext();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const data = postData[department][title];
  const ar = data["ar"];
  const cpamt = data["cpamt"];
  const pamt = data["pamt"];
  const dataForSecondChart = console.log(ar, cpamt, pamt);

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
      text: title,
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
        name: title,
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

  return (
    <span>
      <button
        className="cursor-pointer underline shadow-sm hover:shadow-md"
        onClick={() => setIsOpen(true)}
      >
        {t(title)}
      </button>

      <Modal onClose={() => setIsOpen(false)} openModal={isOpen}>
        <div className="w-full border border-black bg-gray-300">
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={"chart"}
            options={options}
          />
        </div>
        <div>
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={"chart"}
            options={options}
          />
        </div>

        <div>
          <BulletChart title={title} department={department} />
        </div>
      </Modal>
    </span>
  );
}
