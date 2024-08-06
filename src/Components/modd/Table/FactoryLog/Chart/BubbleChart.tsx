import HighchartsReact from "highcharts-react-official";
import Highcharts, { type Series } from "highcharts";
import HC_more from "highcharts/highcharts-more";
import { FactoryEventReponse } from "../FactoryLogDataType";
import BrokenAxis from "highcharts/modules/broken-axis";
import { stringify } from "flatted";

HC_more(Highcharts);

// TODO:https://jsfiddle.net/menXU/1/ label collision
BrokenAxis(Highcharts);
// TODO: Add some type of something to indicate certain data is abnormal. Such as ar or cpamt is null when they should be a number. I am not sure how to deal with this using typescript. In theory, those data should not be null. If I want to enhance type safety, I should use union type to include null and undefined. But if I do this, I will need to add a lot of null and undefined check in the code.
type BubbleChartProps = {
  eventData: FactoryEventReponse;
};
export default function BubbleChart({ eventData }: BubbleChartProps) {
  function generateBubbleData(): {
    x: number;
    y: number;
    z: number;
    name: string;
  }[] {
    const bubbleData: { x: number; y: number; z: number; name: string }[] = [];
    const calculateZ = (z: number | undefined) => {
      const normalizedZ = z ?? 0;
      // return (normalizedZ + 1) * (normalizedZ + 1);
      return normalizedZ;
    };

    eventData.data_mold.forEach((event) => {
      bubbleData.push({
        x: event["ar"] * 100,
        y: event["mamt"],
        z: calculateZ(event["count_repaired"]),
        name: event["sn_num"],
      });
    });

    // console.dir(bubbleData);
    return bubbleData;
  }

  function findMedian(arr: number[]) {
    const sortedArr = arr.sort((a, b) => a - b);
    const middle = Math.floor(sortedArr.length / 2);
    if (sortedArr.length % 2 === 0) {
      return (sortedArr[middle - 1] + sortedArr[middle]) / 2;
    } else {
      return sortedArr[middle];
    }
  }

  function findAverage(arr: number[]) {
    const sum = arr.reduce((a, b) => a + b, 0);
    return sum / arr.length;
  }
  console.log(findMedian(eventData.data_mold.map((event) => event["mamt"])));
  console.log("find z max value");
  console.log(Math.max(...generateBubbleData().map((event) => event["z"])));
  const options: Highcharts.Options = {
    chart: {
      type: "bubble",
      plotBorderWidth: 1,

      height: 650,
      zooming: {
        type: "xy",
      },
      events: {
        load: function () {
          staggerDataLabels(this.series[0]);
        },
        redraw: function () {
          const series = this.series[0];
          setTimeout(() => {
            staggerDataLabels(series);
          }, 1000);
        },
      },
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: true,
    },

    title: {
      text: "達成率/總模次/維修次數",
    },

    xAxis: {
      title: {
        text: "達成率",
      },
      max:
        Math.max(
          100,
          Math.max(...generateBubbleData().map((event) => event["x"])),
        ) + 5,
      min: Math.min(...generateBubbleData().map((event) => event["x"])) - 5,
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
          zIndex: 3,
        },
      ],
    },

    yAxis: {
      type: "logarithmic",
      startOnTick: false,
      endOnTick: false,
      title: {
        style: {
          fontSize: "1.25rem",
        },
        text: "總模次",
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
          value: findMedian(eventData.data_mold.map((event) => event["mamt"])),
          // value: findAverage(eventData.data_mold.map((event) => event["mamt"])),
          label: {
            rotation: 0,
            style: {
              fontStyle: "italic",
            },
            text: "中間值",
            // text: "平均值",
          },
          zIndex: 3,
        },
      ],
    },

    tooltip: {
      useHTML: true,
      headerFormat: "<table>",
      // https://github.com/highcharts/highcharts/issues/20778
      // the type definition of formatter doesn't include the z index
      formatter: function () {
        console.log(this);
        return `唯一碼: ${this.point.name} <br> 達成率: ${this.point.x.toFixed(2)} % <br> 總模次: ${this.point.y?.toFixed(2)} <br> 維修次數: ${this.point.options.z} 次`;
        // return `唯一碼: ${this.point.name} <br> 達成率: ${this.point.x.toFixed(2)} % <br> 總模次: ${this.point.y?.toFixed(2)} <br> 維修次數: ${this.point.options.z! - 1} 次`;
      },
    },

    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: "{point.name}",
          allowOverlap: false,
        },
      },
    },

    series: [
      {
        type: "bubble",
        maxSize:
          Math.max(...generateBubbleData().map((event) => event["z"])) * 10 +
          10,
        minSize: 10,
        sizeBy: "width",
        // sizeByAbsoluteValue: true,
        dataGrouping: {
          enabled: false,
        },
        jitter: {
          x: 1.5,
        },
        dataLabels: {
          align: "center",
          verticalAlign: "top",
          enabled: true,
          allowOverlap: true,

          y: -15,
          style: {
            color: "black",
            textOutline: "none",
            fontWeight: "bold",
            fontSize: "0.5rem",
          },
        },

        // data: generateBubbleData().slice(0, 2),
        data: generateBubbleData(),
      },
      // An invisible series for maintaining visual consistency. In bubble charts, the size of the bubble is relative to the z value. Bubbles that have the lowsest z value have the smallest size which is `minSize`. If in chart A, the lowest z value is 2, then bubbles with z values of 2 will be the smallest. In chart B, the lowest z value is 0, then bubbles with z values of 0 will be the smallest. If you caompare chart A and chart B, it will looks like bubbles with z values of 2 in chart A have the same size as bubbles with z values of 0 in chart B. Visually, it can be misleading. By adding an invisible series that garantees the lowest z value is always 0, it maintains the visual consistency across charts.
      {
        type: "bubble",
        data: [[999, 9999999999999, 0]],
        legendIndex: 0,
        visible: false,
        showInLegend: false,
      },
    ],
  };
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}

function staggerDataLabels(series: Highcharts.Series) {
  console.log("from staggerDataLabels");
  if (series.points.length < 2) {
    return;
  }
  for (let i = 0; i < series.points.length - 1; i++) {
    const pointA = series.points[i];
    const pointB = series.points[i + 1];
    console.log(pointA, pointB);
    // if one of the points is undefined, skip the loop
    if (!pointA || !pointB) {
      return;
    }
    // Need to be careful after this. datalabels are type any. So there won't be any warning from typescript
    const dataLabelA = (pointA as any).dataLabel;
    const dataLabelB = (pointB as any).dataLabel;
    const diff = dataLabelB.y - dataLabelA.y;
    const h = dataLabelA.height + 4;
    if (!dataLabelA || !dataLabelB) {
      return;
    }
    if (isLabelOnLabel(pointA, pointB)) {
      if (diff < 0)
        dataLabelA.translate(
          dataLabelA.translateX,
          dataLabelA.translateY - (h + diff),
        );
      else
        dataLabelB.translate(
          dataLabelB.translateX,
          dataLabelB.translateY - (h - diff),
        );
    }
  }
}

type PartialDataLabel = {
  x: number;
  y: number;
  width: number;
  height: number;
};
function isLabelOnLabel(
  pointA: Highcharts.Point,
  pointB: Highcharts.Point,
): boolean {
  const dataLabelA: PartialDataLabel = (pointA as any).dataLabel;
  const dataLabelB: PartialDataLabel = (pointB as any).dataLabel;
  const al = dataLabelA.x - dataLabelA.width / 2;
  const ar = dataLabelA.x + dataLabelA.width / 2;
  const bl = dataLabelB.x - dataLabelB.width / 2;
  const br = dataLabelB.x + dataLabelB.width / 2;
  console.log(al, ar, bl, br);

  const at = dataLabelA.y;
  const ab = dataLabelA.y + dataLabelA.height;
  const bt = dataLabelB.y;
  const bb = dataLabelB.y + dataLabelB.height;
  console.log("from isLabelOnLabel");
  console.log(pointA, pointB);
  if (bl > ar || br < al) {
    return false;
  } //overlap not possible
  if (bt > ab || bb < at) {
    return false;
  } //overlap not possible
  if (bl > al && bl < ar) {
    return true;
  }
  if (br > al && br < ar) {
    return true;
  }

  if (bt > at && bt < ab) {
    return true;
  }
  if (bb > at && bb < ab) {
    return true;
  }

  return false;
}
