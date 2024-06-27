import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

type HighStockTestProps = {
  processedData: [number, number][];
};

const HighStockTest: React.FC<HighStockTestProps> = ({ processedData }) => {
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
            fill: "blue",
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
    chart: {
      backgroundColor: "#ededeb",
    },
    data: {},
    time: {
      timezone: "Asia/Taipei",
    },
    rangeSelector: {
      selected: 1,
      buttons: [
        { type: "month", count: 6, text: "半年" },
        { type: "year", count: 1, text: "一年" },
        { type: "year", count: 2, text: "兩年" },
        { type: "year", count: 3, text: "三年" },
        { type: "all", text: "全部" },
      ],
      inputDateFormat: "%b%e, %Y",
      inputEditDateFormat: "%b%e, %Y",
      inputStyle: {
        color: "#2f56a3",
        fontWeight: "bolder",
      },
    },
    title: {
      text: "PP Price History",
    },
    xAxis: {
      //   units: [],
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
        name: "PP Price",
        color: "#e67784",
        data: processedData,
        tooltip: {
          valueDecimals: 2,
        },
      },
    ],
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

export default HighStockTest;
