import { useEffect, useState } from "react";
import axios from "axios";
import example from "../assets/highStockType2Demo.png";
import HighStockType3 from "../Components/modd/HighChart/HighStockType3";

// Define the API URL
const API_URL = "http://192.168.123.240:9000/api/modd/line-chart";

type Data = {
  currency: string;
  id_item: number;
  item: string;
  item_tag: string;
  unit: string;
};

type Data2 = {
  currency: string;
  date: string;
  id: number;
  id_item: number;
  item: string;
  price: number;
  unit: string;
  unix_stamp: number;
};

type Data3 = {
  // # 產品系列
  sys: string;
  // # 工作日
  dutydate: string;
  // # Unix時戳 in milliseconds
  unix_stamp: number;
  // # 總工時
  work_time: number;
  // # 機均產能
  avg_pamt: number;
  // # 標準產能
  avg_capa: number;
  // # 達成率
  ar: number;
};

// function getWeekNumber(d: Date) {
//   // Get the first day of the year
//   const start = new Date(d.getFullYear(), 0, 1);
//   const diff = d.getTime() - start.getTime();
//   const oneWeek = 1000 * 60 * 60 * 24 * 7;
//   return Math.floor(diff / oneWeek) + 1;
// }

// const formatDate2 = (rawData: Data3[]): SeriesData[] => {
//   const groupedDataByYear = rawData.reduce<{ [year: number]: DataPoint }>(
//     (acc, item) => {
//      const date = new Date(item.unix_stamp);
//     },
//   );
// };

const formatData1 = (rawData: Data3[]): SeriesData[] => {
  const fixedYear = 2000; // All data will have this year
  const groupedData = rawData.reduce<{ [year: number]: DataPoint[] }>(
    (acc, item) => {
      // The unix_stamp is already in milliseconds
      const date = new Date(item.unix_stamp);
      console.log(date.toDateString());
      console.log(date.toISOString());
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth() + 1;
      const day = date.getUTCDate();
      // Create a new date with the fixed year
      const newDate = new Date(Date.UTC(fixedYear, month - 1, day));
      // const newDate = new Date(Date.UTC(fixedYear, month, day));
      // const newUnixStamp = Math.floor(newDate.getTime() / 1000);
      const newUnixStamp = Date.parse(newDate.toISOString());

      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push({
        x: newUnixStamp,
        y: item.ar,
        date: item.dutydate,
      });

      return acc;
    },
    {},
  );

  const currentYear = String(new Date().getFullYear());
  return Object.keys(groupedData).map((year) => ({
    name: year,
    data: groupedData[parseInt(year)],
    type: "line",
    color: year === currentYear ? "red" : "lightgray",
  }));
};

const formatData2 = (rawData: Data3[]): SeriesData[] => {
  const fixedYear = 2000; // All data will have this year
  const groupedData = rawData.reduce<{ [year: number]: DataPoint[] }>(
    (acc, item) => {
      // The unix_stamp is already in milliseconds, don't need to times by 1000
      const date = new Date(item.unix_stamp);
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth();
      const day = date.getUTCDate();
      const newDate = new Date(Date.UTC(fixedYear, month, day));
      const newUnixStamp = newDate.getTime(); // Get timestamp in milliseconds

      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push({
        x: newUnixStamp,
        y: item.ar,
        date: item.dutydate,
      });

      return acc;
    },
    {},
  );

  const currentYear = String(new Date().getFullYear());
  return Object.keys(groupedData).map((year) => ({
    name: year,
    data: groupedData[parseInt(year)],
    type: "line",
    color: year === currentYear ? "red" : "lightgray",
  }));
};

export default function TestPage() {
  const [data, setData] = useState<Data[]>([]);
  const [formattedData, setFormattedData] = useState<SeriesData[]>([]);
  const [title, setTitle] = useState("");

  // Fetch data when the component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(API_URL);
        setData(response.data.preData);
        console.log(response.data.preData);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  async function postRequest() {
    try {
      const response = await axios.post(
        "http://192.168.123.240:9000/api/modd/line-chart/",
        {
          type: "03",
        },
      );
      const rawData: Data3[] = response.data.data;
      const formattedData = formatData2(rawData);
      setFormattedData(formattedData);
    } catch (error) {
      console.error("Failed to post data", error);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-6 place-content-center content-center">
        {data.map((item) => (
          <p
            onClick={() => postRequest()}
            key={item.id_item}
            className="cursor-pointer border border-black hover:bg-gray-300"
          >
            {item.item}
          </p>
        ))}
      </div>
      <div className="flex gap-3">
        {formattedData.length > 0 && (
          <HighStockType3  data={formattedData} />
        )}
      </div>
      <img src={example} alt="Example" />
    </div>
  );
}

type DataPoint = {
  x: number;
  y: number;
  date: string;
};

type SeriesData = {
  name: string;
  data: DataPoint[];
  color: string;
};
