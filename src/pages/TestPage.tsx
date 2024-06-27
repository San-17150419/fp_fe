import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import HighStockTest from "../Components/modd/HighChart/HighStockTest";
import example from "../assets/highStockExample.png";

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
        }
      );
      console.dir(response);
      console.dir(response.data);
      console.dir(response.data.data);
      setPostResponse(response.data.data);
    } catch (error) {
      console.error("Failed to post data", error);
    }
  }

  const processedData = useMemo(
    () =>
      postResponse
        ? postResponse.map((item) => [item.unix_stamp, item.price/1000] as [number, number])
        : [],
    [postResponse]
  );

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
      {processedData.length > 0 && <HighStockTest processedData={processedData} />}
      <img src={example} alt="Example" />
    </div>
  );
}
