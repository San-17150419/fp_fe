import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
type HighStockType1Props = {
  processedData: [number, number][];
  title: string;
};

const HighStockType1: React.FC<HighStockType1Props> = ({
  processedData,
  title,
}) => {
  // Set HighCharts global options

  Highcharts.setOptions({
    time: {
      timezone: "Asia/Taipei",
    },
    global: {
      buttonTheme: {
        style: {
          color: "black",
        },
        states: {
          hover: {
            fill: "#9ca3af",
          },
          select: {
            fill: "#cccccc",
            style: {
              color: "black",
              fontWeight: "bold",
            },
          },
        },
      },
    },
    lang: {
      months: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
      ],
      weekdays: ["日", "一", "二", "三", "四", "五", "六"],
      shortMonths: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
      ],
      rangeSelectorTo: "→",
      rangeSelectorFrom: "",
      zoomIn: "放大",
      zoomOut: "縮小",
      resetZoom: "重設縮放",
      resetZoomTitle: "重設縮放",
      rangeSelectorZoom: "範圍",
      viewData: "查看資料",
      contextButtonTitle: "圖表",
    },
  });

  const options: Highcharts.Options = {
    legend: {
      enabled: true,
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      itemStyle: {
        fontWeight: "bolder",
      },
    },
    chart: {
      backgroundColor: "#ededeb",
      type: "stock",
    },
    data: {},
    time: {
      timezone: "Asia/Taipei",
    },
    rangeSelector: {
      selected: 1,
      buttonTheme: {
        style: {
          color: "black",
        },
      },
      buttons: [
        { type: "month", count: 6, text: "半年" },
        { type: "year", count: 1, text: "一年" },
        { type: "year", count: 2, text: "兩年" },
        { type: "year", count: 3, text: "三年" },
        { type: "all", text: "全部" },
      ],
      inputDateFormat: "%B %e, %Y",
      inputEditDateFormat: "%B %e, %Y",
      inputStyle: {
        color: "#2f56a3",
        fontWeight: "bolder",
        fontSize: "10px",
      },
    },
    title: {
      text: title,
      style: {
        fontWeight: "900",
      },
      y: 40,
    },
    xAxis: {
      dateTimeLabelFormats: {
        millisecond: "%y 年 %b ",
        second: "%y 年 %b ",
        minute: "%y 年 %b ",
        hour: "%y 年 %b ",
        day: "%y 年 %b ",
        week: "%y 年 %b ",
        month: "%y 年 %b ",
        year: "%y 年 %b ",
      },
      width: "100%",
      labels: {
        style: {
          fontSize: "10px",
        },
      },
    },
    yAxis: [
      {
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: "RMB/MT",
          style: {
            fontWeight: "bolder",
          },
        },
        height: "100%",
        lineWidth: 4,
        resize: {
          enabled: true,
        },
        //the color of the rightmost yAxis
        lineColor: "transparent",
      },
    ],
    tooltip: {
      split: true,
      dateTimeLabelFormats: {
        millisecond: "%b %e, %Y",
        second: "%b %e, %Y",
        minute: "%b %e, %Y",
        hour: "%b %e, %Y",
        day: "%b %e, %Y",
        week: "%b %e, %Y",
        month: "%b %e, %Y",
        year: "%b %e, %Y",
      },
    },
    series: [
      {
        type: "line",
        name: `${title}`,
        color: "#e67784",
        data: processedData,
        tooltip: {
          valueDecimals: 2,
        },
      },
    ],
    navigator: {
      xAxis: {
        dateTimeLabelFormats: {
          millisecond: "%b %e, %Y",
          second: "%b %e, %Y",
          minute: "%b %e, %Y",
          hour: "%b %e, %Y",
          day: "%b %e, %Y",
          week: "%b %e, %Y",
          month: "%Y",
          year: "%Y",
        },
      },
    },
    annotations: [
      {
        labels: [
          {
            point: {
              x: 3,
              y: 129.2,
              xAxis: 3,
              yAxis: 129.2,
            },
            text: "x: {x}<br/>y: {y}",
          },
          {
            point: {
              x: 0,
              y: 0,
              xAxis: 0,
              yAxis: 0,
            },
            text: "x: {point.plotX} px<br/>y: {point.plotY} px",
          },
          {
            point: {
              x: 5,
              y: 100,
              xAxis: 0,
              yAxis: 0,
            },
            text: "x: {x}<br/>y: {point.plotY} px",
          },
        ],
      },
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              enabled: true,
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
            },
          },
        },
      ],
    },
  };

  return (
    <div className="bg-gray-300">
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={options}
      />
    </div>
  );
};

export default HighStockType1;
