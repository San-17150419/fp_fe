import clsx from "clsx";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { type Data } from "./pages/HistoryQuery";

type OrderDetailsProps = {
  data: Data;
};
function formatDataFn(value: string): string {
  return Math.trunc(Number(value)).toLocaleString();
}

export default function OrderDetails({ data }: OrderDetailsProps) {
  const formatData = {
    ...data,
    amt_order: formatDataFn(data.amt_order),
    amt_delivered: formatDataFn(data.amt_delivered),
  };
  return (
    <TabGroup className="min-w-[300px] items-center justify-center">
      <TabList className="flex justify-evenly gap-4 border-b-2">
        <Tab className="m-1 rounded-md px-2 py-1 data-[selected]:bg-blue-500 data-[selected]:text-white data-[hover]:underline">
          驗收單細節
        </Tab>
        <Tab className="m-1 rounded-md px-2 py-1 data-[selected]:bg-blue-500 data-[selected]:text-white data-[hover]:underline">
          檢驗細項
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel className="my-4 flex flex-col items-center gap-1">
          {dictionary
            .slice(0, 4)
            .map(({ key, label, getClassName, className }) => (
              <Item
                key={key}
                label={label}
                value={formatData[key]}
                getClassName={getClassName}
                className={className}
              />
            ))}
          <br />
          {dictionary
            .slice(4, 10)
            .map(({ key, label, getClassName, className }) => (
              <Item
                key={key}
                label={label}
                value={formatData[key]}
                getClassName={getClassName}
                className={className}
              />
            ))}
          <br />

          {dictionary
            .slice(10)
            .map(({ key, label, getClassName, className }) => (
              <Item
                key={key}
                label={label}
                value={formatData[key]}
                getClassName={getClassName}
                className={className}
              />
            ))}
        </TabPanel>
        <TabPanel>
          檢驗項目
          <h1 className="outline">
            {data.doc_class}| {data.order_prodModel}| {data.order_prodNum}
          </h1>
          <table className="min-w-[700px] table-fixed text-center">
            <thead>
              <tr>
                <th rowSpan={2}>檢驗項目</th>
                <th rowSpan={2}>抽樣數</th>
                <th colSpan={3} className="border-b">
                  (AC/不良數)
                </th>
                <th rowSpan={2}>檢驗記錄</th>
                <th rowSpan={2}>結果</th>
              </tr>
              <tr className="border-b">
                <th>嚴重</th>
                <th>主要</th>
                <th>次要</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }).map((_, index) => (
                <tr key={index} className="border-b even:bg-slate-100">
                  <td className="w-[80px]">A</td>
                  <td className="w-[80px]">0</td>
                  <td className="w-[50px]"></td>
                  <td className="w-[50px]"></td>
                  <td className="w-[50px]"></td>
                  <td className="flex justify-center gap-3 text-sm">
                    <div className="m-1 px-2 py-1">0.30</div>
                    <div className="m-1 px-2 py-1">0.28</div>
                    <div className="m-1 px-2 py-1">0.32</div>
                    <div className="m-1 px-2 py-1">0.30</div>
                    <div className="m-1 px-2 py-1">0.30</div>
                  </td>
                  <td className="w-[70px]">OK</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}

function Item({
  label,
  value,
  getClassName,
  className,
}: {
  label: string;
  value: any;
  getClassName?: (value: any) => string;
  className?: string;
}) {
  const computedClassName = getClassName
    ? getClassName(value)
    : className || "";

  return (
    <div className="grid w-[400px] grid-cols-2 gap-4">
      <span className="text-center">{label}</span>
      <span className={clsx("text-center", computedClassName)}>{value}</span>
    </div>
  );
}

type DictionaryItem = {
  key: keyof Data;
  label: string;
  getClassName?: (value: string) => string;
  className?: string;
};

const dictionary: Array<DictionaryItem> = [
  {
    key: "doc_num",
    label: "文件編碼",
  },
  {
    key: "doc_class",
    label: "驗收單類型",
    getClassName: (value) => (value !== "一般訂單" ? "text-red-600" : ""),
  },
  {
    key: "status_IQC",
    label: "品管驗收狀態",
    getClassName: (value) =>
      value === "已檢驗" ? "text-green-600" : "text-red-500",
  },
  {
    key: "report_IQC",
    label: "品管回報動作",
    getClassName: (value) =>
      value === "允收" ? "text-green-600" : "text-red-500",
  },
  {
    key: "date_accepted",
    label: "收貨日期",
  },
  {
    key: "order_num",
    label: "訂單編碼",
  },
  {
    key: "order_product",
    label: "訂單產品",
    className: "text-blue-700",
  },
  {
    key: "deliver_product",
    label: "交付產品",
    className: "text-blue-700",
  },
  {
    key: "order_prodType",
    label: "訂單規格",
  },
  {
    key: "order_prodModel",
    label: "產品Model",
  },
  {
    key: "amt_unit",
    label: "計數單位",
  },
  {
    key: "amt_order",
    label: "訂單數量",
  },
  {
    key: "amt_delivered",
    label: "交貨數量",
  },
];
