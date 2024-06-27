import HighchartsReact, {
  HighchartsReactRefObject,
  HighchartsReactProps,
} from "highcharts-react-official";
import * as Highcharts from "highcharts";
import { useRef, useState } from "react";

const options: Highcharts.Options = {
  title: {
    text: "測試",
  },
  series: [
    {
      type: "line",
      data: [1, 2, 3, 7, 7],
    },
  ],
};

export default function HighChartTest(props: HighchartsReactProps) {
  const chartComponentRef = useRef<HighchartsReactRefObject>(null);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={chartComponentRef}
      {...props}
    />
  );
}
