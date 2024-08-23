import axios from "axios";
import { useState, useEffect } from "react";
import Loading from "../../Loading";
import ProductList from "./ProductList";

type ProductInfo = {
  id_item: number;
  item_tag: string;
  item: string;
  unit: string;
  currency: string;
};

export default function HighChartsDataFetcher() {
  // default highchart type is 01
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
      } catch (error) {
        console.error(error);
        setError("Error fetching product list");
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
