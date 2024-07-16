import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import bullet from "highcharts/modules/bullet";
import { useFactoryLogContext } from "../FactoryLogContext";

type BulletChartProps = {
  title: string;
  department: string;
};

export default function BulletChart({ title, department }: BulletChartProps) {
  bullet(Highcharts);
  const { postData } = useFactoryLogContext();
  const data = postData[department][title];
  const ar = data["ar"];
  const cpamt = data["cpamt"];
  const pamt = data["pamt"];
  const allSys = Object.keys(postData[department]);
  const option2: Highcharts.Options = {
    chart: {
      type: "bullet",
      inverted: true,
    },
    plotOptions: {
      bullet: {
        borderWidth: 0,
        pointPadding: 0.25,
        color: "#000",
        targetOptions: {
          width: "200%",
        },
      },
    },
    yAxis: {
      gridLineWidth: 0,
      plotBands: [
        {
          from: 0,
          to: 85,
          color: "#666",
        },
        {
          from: 85,
          to: 100,
          color: "#999",
        },
        {
          from: 100,
          to: 9e9,
          color: "#bbb",
        },
      ],
    },
    series: [
      {
        type: "bullet",
        data: [
          {
            y: 100,
            target: 80,
            color: "red",
            label: "label",
          },
          {
            y: 100,
            target: 80,
            color: "red",
          },
          {
            y: 100,
            target: 80,
            color: "red",
          },
        ],
      },
    ],
  };
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={option2} />
    </div>
  );
}
