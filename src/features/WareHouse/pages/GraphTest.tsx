import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import HighchartHistogram from "highcharts/modules/histogram-bellcurve";

HighchartHistogram(Highcharts);

export default function GraphTest() {
  function generateChartConfig(
    data: Array<{ x: number; y: number }>,
    title: string,
  ) {
    const defaultConfig: Highcharts.Options = {
      chart: {
        width: 400,
        height: 300,
      },
    };

    return {
      ...defaultConfig,
      title: {
        text: title,
      },
      xAxis: {
        title: {
          text: "組界",
        },
        tickPositions: data.map((d) => d.x),
      },
      yAxis: {
        title: {
          text: "頻率",
        },
      },
      plotOptions: {
        column: {
          pointPadding: 0,
          groupPadding: 0,
          borderWidth: 0,
          pointWidth: null,
        },
      },
      series: [
        {
          name: "頻率",
          data: data.map((d) => [d.x, d.y]),
          type: "column",
          color: "#7cb5ec",
        },
        {
          name: "Bell Curve",
          data: data.map((d) => ({ x: d.x, y: d.y })),
          type: "spline",
          id: "bellCurve",
          color: "#ff0000",
          marker: { enabled: false },
        },
      ],
    };
  }

  const data = [
    [
      { x: 25.69, y: 0 },
      { x: 25.74, y: 1 },
      { x: 25.79, y: 5 },
      { x: 25.84, y: 21 },
      { x: 25.89, y: 14 },
      { x: 25.94, y: 5 },
    ],
    [
      { x: 25.9, y: 0 },
      { x: 25.93, y: 0 },
      { x: 25.95, y: 18 },
      { x: 25.98, y: 24 },
      { x: 26.0, y: 29 },
      { x: 26.03, y: 7 },
    ],
    [
      { x: 25.69, y: 0 },
      { x: 25.77, y: 2 },
      { x: 25.85, y: 27 },
      { x: 25.92, y: 17 },
      { x: 26.0, y: 73 },
      { x: 26.08, y: 9 },
    ],
  ];

  return (
    <div className="bg-white p-8">
      {data.map((d, index) => {
        return (
          <div key={index} className="flex text-center">
            <table className="h-fit w-1/3">
              <thead className="border-b-2 border-t-4 border-black">
                <tr>
                  <th>組界</th>
                  <th>頻率</th>
                </tr>
              </thead>
              <tbody>
                {d.map((d) => (
                  <tr key={d.x}>
                    <td>{d.x}</td>
                    <td>{d.y}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <HighchartsReact
              highcharts={Highcharts}
              constructorType={"chart"}
              options={generateChartConfig(d, `組界常態分佈圖 ${index + 1}`)}
            />
          </div>
        );
      })}
    </div>
  );
}
