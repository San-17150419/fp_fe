import axios from "axios";
import { useState, useEffect } from "react";
import Loading from "../../Loading";
import ProductList from "./ProductList";
type HighChartType = "01" | "02" | "03";

type ProductInfo = {
  id_item: number;
  item_tag: string;
  item: string;
  unit: string;
  currency: string;
};

export default function HighChartsDataFetcher() {
  // default highchart type is 01
  const [type, setType] = useState<HighChartType>("01");
  const [itemId, setItemId] = useState<number>(0);
  const [data, setData] = useState<ProductInfo[] | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsoading] = useState<boolean>(true);

  //   Fetch product list on component mount
  useEffect(() => {
    async function fetchProductList() {
      try {
        const response = await axios.get(
          `http://192.168.123.240:9000/api/modd/line-chart/`,
        );
        setData(response.data.preData);
        setIsoading(false);
        console.log(response.data.preData);
      } catch (error) {
        console.error(error);
      }
    }
    fetchProductList();
  }, []);

  if (!data || isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex h-full flex-col">
      <div>{error ? error : ""}</div>
      {data && <ProductList data={data} />}
      <div className="flex-grow"></div>
    </div>
  );
}
