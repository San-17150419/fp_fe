import { useEffect, useState } from "react";
import axios from "axios";
import HighStockType3 from "../Components/modd/HighChart/HighStockType3";
import { processData } from "../Components/modd/HighChart/util/formatData";
import {
  ItemPreData,
  Type3RawData,
  Type3ChartData,
} from "../Components/modd/HighChart/highChartTypes";

const API_URL = "http://192.168.123.240:9000/api/modd/line-chart";

export default function TestPage() {
  const [items, setItems] = useState<ItemPreData[]>([]);
  const [chartSeriesData, setChartSeriesData] = useState<Type3ChartData[]>([]);
  const [selectedProperty, setSelectedProperty] =
    useState<keyof Type3RawData>("ar");
  const [rawChartData, setRawChartData] = useState<Type3RawData[]>([]); // Store raw chart data

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await axios.get(API_URL);
        setItems(response.data.preData);
        console.log(response.data.preData);
      } catch (error) {
        console.error(error);
      }
    }
    fetchItems();
  }, []);

  async function fetchChartData(property: keyof Type3RawData) {
    try {
      const response = await axios.post(
        "http://192.168.123.240:9000/api/modd/line-chart/",
        {
          type: "03",
        },
      );
      const rawData: Type3RawData[] = response.data.data;
      setRawChartData(rawData); // Store the raw chart data
      const processedData = processData(rawData, "weekly", property, 1970);
      setChartSeriesData(processedData);
    } catch (error) {
      console.error("Failed to fetch chart data", error);
    }
  }

  const numericProperties = (data: Type3RawData[]): (keyof Type3RawData)[] => {
    const sampleItem = data[0];
    return Object.keys(sampleItem).filter(
      (key) => typeof sampleItem[key as keyof Type3RawData] === "number",
    ) as (keyof Type3RawData)[];
  };

  return (
    <div>
      <div className="grid grid-cols-6 place-content-center content-center">
        {items.map((item) => (
          <p
            onClick={() => fetchChartData(selectedProperty)}
            key={item.id_item}
            className="cursor-pointer border border-black hover:bg-gray-300"
          >
            {item.item}
          </p>
        ))}
      </div>
      {rawChartData.length > 0 && (
        <div className="my-3 flex gap-3">
          <label htmlFor="property-select">Select Property:</label>
          <select
            id="property-select"
            value={selectedProperty}
            onChange={(e) => {
              setSelectedProperty(e.target.value as keyof Type3RawData);
              fetchChartData(e.target.value as keyof Type3RawData); // Fetch new chart data when the property changes
            }}
          >
            {numericProperties(rawChartData).map((property) => (
              <option key={property} value={property}>
                {property}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="flex gap-3">
        {chartSeriesData.length > 0 && (
          <HighStockType3 data={chartSeriesData} />
        )}
      </div>
    </div>
  );
}
