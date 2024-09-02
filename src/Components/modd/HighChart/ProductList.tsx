import { useState } from "react";
import axios from "axios";
import Select from "../Select/Select";
type ProductInfo = {
  id_item: number;
  item_tag: string;
  item: string;
  unit: string;
  currency: string;
};

type ProductDetails = {
  id: number;
  date: string;
  id_item: number;
  price: number;
  item: string;
  currency: string;
  unit: string;
  unix_stamp: number;
};

type ProductListProps = {
  data: ProductInfo[];
};

export default function ProductList({ data }: ProductListProps) {
  const [productDetails, setProductDetails] = useState<ProductDetails[] | null>(
    null,
  );

  const options = data.map((item) => {
    return { id: item.id_item, value: item.item, text: item.item };
  });

  async function postRequest(id_item: number) {
    try {
      const response = await axios.post(
        "http://192.168.123.240:9000/api/modd/line-chart/",
        {
          id_item,
          type: "01",
        },
      );
      setProductDetails(response.data); // Assuming the response contains the product details
    } catch (error) {
      console.error("Failed to post data", error);
    }
  }

  return (
    <div className="w-full">
      <div>
        <Select name="product" options={options}></Select>
      </div>
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
      {productDetails && (
        <div>
          <h2>Product Details</h2>
          {/* Render product details here */}
        </div>
      )}
    </div>
  );
}
