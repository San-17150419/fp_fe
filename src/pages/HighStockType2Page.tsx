import { useEffect, useState } from "react";
import axios from "axios";
import example from "../assets/highStockType2Demo.png";
import HighStockType2 from "../Components/modd/HighChart/HighStockType2";

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

function getWeekNumber(d: Date) {
  // Get the first day of the year
  const start = new Date(d.getFullYear(), 0, 1);
  const diff = d.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.floor(diff / oneWeek) + 1;
}

const formatData = (rawData: Data2[]): SeriesData[] => {
  const groupedData = rawData.reduce<{ [year: number]: DataPoint[] }>(
    (acc, item) => {
      const date = new Date(item.unix_stamp);
      const year = date.getFullYear();
      const weekNumber = getWeekNumber(date);

      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push({ x: weekNumber, y: item.price });
      return acc;
    },
    {},
  );

  const colors = [
    "green",
    "red",
    "blue",
    "purple",
    "orange",
    "cyan",
    "magenta",
    "yellow",
    "black",
  ];
  return Object.keys(groupedData).map((year, index) => ({
    name: year,
    data: groupedData[parseInt(year)],
    type: "line",
    color: colors[index % colors.length],
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

  async function postRequest(id_item: number) {
    try {
      const response = await axios.post(
        "http://192.168.123.240:9000/api/modd/line-chart/",
        {
          id_item,
          type: "02",
        },
      );
      const rawData: Data2[] = response.data.data;
      console.log(rawData);
      const formattedData = formatData(rawData);
      setFormattedData(formattedData);
      setTitle(response.data.data[0].item);

      console.log(formattedData);
    } catch (error) {
      console.error("Failed to post data", error);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-6 place-content-center content-center">
        {data.map((item) => (
          <p
            onClick={() => postRequest(item.id_item)}
            key={item.id_item}
            className="cursor-pointer border border-black hover:bg-gray-300"
          >
            {item.item}
          </p>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {formattedData.length > 0 && (
          <HighStockType2 title={title} data={formattedData} />
        )}
      </div>
      <img src={example} alt="Example" />
    </div>
  );
}

type DataPoint = {
  x: number;
  y: number;
};

type SeriesData = {
  name: string;
  data: DataPoint[];
  color: string;
};
