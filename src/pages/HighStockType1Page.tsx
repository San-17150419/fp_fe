import  { useEffect, useState, useMemo } from "react";
import axios from "axios";
import HighStockType1 from "../Components/modd/HighChart/HighStockType1";
import { format, startOfMonth } from "date-fns";
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

export default function TestPage() {
  const [data, setData] = useState<Data[]>([]);
  const [postResponse, setPostResponse] = useState<Data2[] | null>(null);
  const [title, setTitle] = useState<string>("");

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
          type: "01",
        },
      );
      setTitle(response.data.data[0].item);
      setPostResponse(response.data.data);
    } catch (error) {
      console.error("Failed to post data", error);
    }
  }

  const processedData = useMemo(() => {
    if (!postResponse) return [];

    // Group data by month
    const groupedData: { [key: string]: { priceSum: number; count: number } } =
      {};
    postResponse.forEach((item) => {
      const month = format(new Date(item.unix_stamp), "yyyy-MM");
      if (!groupedData[month]) {
        groupedData[month] = { priceSum: 0, count: 0 };
      }
      groupedData[month].priceSum += item.price;
      groupedData[month].count += 1;
    });

    // Calculate average price for each month
    const aggregatedData = Object.keys(groupedData).map((month) => {
      const { priceSum, count } = groupedData[month];
      const averagePrice = priceSum / count;
      const startOfMonthTimestamp = startOfMonth(new Date(month)).getTime();
      return [startOfMonthTimestamp, averagePrice] as [number, number];
    });

    return aggregatedData;
  }, [postResponse]);

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
        {/* <HighChartTest /> */}

        {/* <HighStockTest2 /> */}
        {processedData.length > 0 && (
          <HighStockType1 processedData={processedData} title={title} />
        )}
        {/* {processedData.length > 0 && (
          <HighStockWithDynamicComputation processedData={processedData} />
        )} */}
      </div>

    </div>
  );
}
