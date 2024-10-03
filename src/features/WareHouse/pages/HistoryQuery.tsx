import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import InputField from "../Form/InputField";
import SelectField from "../Form/SelectField";
import axios from "axios";
import Loading from "../../../Components/Loading";
import { type QueryOrderHIstoryResponseData } from "../types/QueryOrderHIstoryTypes";
import OrderDetails from "../OrderDetails";
import clsx from "clsx";
import Modal from "../../../Components/modd/Modal/NonDialogModal";


type HistoryQueryProps = {
  version: "inv" | "iqc";
};

const configuration = {
  inv: {
    filters: [
      "date_start",
      "doc_num",
      "order_num",
      "order_product",
      "status_IQC",
      "report_IQC",
    ],
    columns: [
      "date_accepted",
      "date_confirm",
      "status_IQC",
      "report_IQC",
      "doc_class",
      "deliver_product",
      "order_product",
      "amt_delivered",
      "amt_received",
      "amt_returned",
      // 訂單細節
      // ""
    ],
  },
  iqc: {
    filters: [
      "date_start",
      "date_end",
      "report_IQC",
      "doc_num",
      "order_num",
      "deliver_product",
    ],
    columns: [
      "date_accepted",
      "doc_num",
      "supplier_code",
      "order_num",
      "doc_class",
      "deliver_product",
      "amt_delivered",
      "date_confirm",
      "amt_received",
      "status_IQC",
      "report_IQC",
    ],
  },
};

export default function HistoryQuery({ version }: HistoryQueryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentOrdeId, setCurrentOrdeId] = useState<number | null>();
  // const { data, isPending } = useQuery({
  //   queryKey: ["deliveryData"],
  //   queryFn: async () => {
  //     const api = "https://192.168.123.240:9000/api/rr-inv/filterData";
  //     const response = await axios.post<QueryOrderHIstoryResponseData>(api, {
  //       date_start: "",
  //       date_end: "",
  //       doc_class: "",
  //       doc_num: "",
  //       order_num: "",
  //       order_product: "",
  //       status_IQC: "",
  //       report_IQC: "",
  //     });
  //     console.log(response.data);
  //     return response.data;
  //   },
  // });
  const form = useForm({
    defaultValues: {
      date_start: "",
      date_end: "",
      doc_class: "",
      doc_num: "",
      order_num: "",
      order_product: "",
      status_IQC: "",
      report_IQC: "",
    },
    onSubmit: (values) => {
      const api = "https://192.168.123.240:9000/api/rr-inv/filterData";
    },
  });

  const lists: string[] = [
    "文件編碼",
    "驗收單類型",
    "品管驗收狀態",
    "品管回報動作",
    "收貨日期",
    "訂單編碼",
    "訂單產品",
    "交付產品",
    "訂單規格",
    "產品Model",
    "計術單位",
    "訂單數量",
    "交貨數量",
  ];

  return (
    <>
      {/* {isPending ? <Loading /> : null} */}
      <button type="button" onClick={() => setIsOpen(true)}>
        open
      </button>
      <form className="flex w-full gap-4">
        <form.Field
          name="date_start"
          children={(field) => {
            return <InputField type="date" field={field} span={1} />;
          }}
        />
        <form.Field
          name="date_end"
          children={(field) => {
            return <InputField type="date" field={field} span={1} />;
          }}
        />
        <form.Field
          name="doc_class"
          children={(field) => {
            return <InputField field={field} span={1} />;
          }}
        />
        <form.Field
          name="doc_num"
          children={(field) => {
            return <InputField field={field} span={1} />;
          }}
        />
        <form.Field
          name="order_num"
          children={(field) => {
            return <InputField field={field} span={1} />;
          }}
        />
        <form.Field
          name="order_product"
          children={(field) => {
            return <InputField field={field} span={1} />;
          }}
        />
      </form>
      <table className="w-full">
        <thead>
          <tr className="">
            <Th>收穫日期</Th>
            <Th>文件編碼</Th>
            <Th>交貨廠商</Th>
            <Th>訂單號碼</Th>
            <Th>訂單類別</Th>
            <Th>訂單品名</Th>
            <Th>交貨數量</Th>
            <Th>驗收日期</Th>
            <Th>驗收數量</Th>
            <Th>驗退數量</Th>
            <Th>檢驗狀態</Th>
            <Th>檢驗結果</Th>
            <Th>驗收單細節</Th>
          </tr>
        </thead>
        <tbody>
          {/* {data &&
            data.data.map((key) => (
              // data.data.splice(1000, 100).map((key) => (
              <tr>
                <Td>{key.doc_num}</Td>
                <Td>{key.doc_num}</Td>
                <Td>{key.supplier_code}</Td>
                <Td>{key.order_num}</Td>
                <Td>{key.doc_class}</Td>
                <Td>{key.order_product}</Td>
                <Td>{key.deliver_product}</Td>
                <Td>{key.date_confirm}</Td>
                <Td>{key.amt_delivered}</Td>
                <Td>{key.amt_delivered - key.amt_received}</Td>
                <Td>{key.status_IQC}</Td>
                <Td>{key.report_IQC}</Td>
              </tr>
            ))} */}
          {testData.map((key) => (
            <tr key={key.doc_num} className={clsx("even:bg-gray-300")}>
              <Td>{key.date_accepted}</Td>
              <Td>{key.doc_num}</Td>
              <Td>{key.supplier_code}</Td>
              <Td>{key.order_num}</Td>
              <Td className={clsx(key.doc_class === "額外工序" && "text-red-600")}>{key.doc_class}</Td>
              <Td>{key.order_product}</Td>
              {/* Conver string to number, remove decimal, and add thousand separator */}
              <Td>{Math.trunc(Number(key.amt_delivered)).toLocaleString()}</Td>
              <Td className="text-blue-600">{key.date_confirm}</Td>
              {/* Conver string to number, remove decimal, and add thousand separator  */}
              <Td className="text-blue-600">
                {Math.trunc(Number(key.amt_received)).toLocaleString()}
              </Td>
              <Td className="text-red-600">
                {Math.trunc(Number(key.amt_returned)).toLocaleString()}
              </Td>
              <Td
                className={key.status_IQC === "未檢驗" ? "text-blue-600" : ""}
              >
                {key.status_IQC}
              </Td>
              <Td
                className={
                  key.report_IQC === "未定義"
                    ? "text-blue-600"
                    : key.report_IQC === "退貨"
                      ? "text-red-600"
                      : key.report_IQC === "允收"
                        ? "text-green-600"
                        : ""
                }
              >
                {key.report_IQC}
              </Td>
              <Td onClick={() => setIsOpen(true)}>
                <button
                  className="bg-black p-2 text-sm text-white"
                  type="button"
                  onClick={() => setCurrentOrdeId(key.id)}
                >
                  驗收單細節
                </button>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {currentOrdeId && testData.find((key) => key.id === currentOrdeId) && (
          <OrderDetails
            data={testData.find((key) => key.id === currentOrdeId) as Data}
          />
        )}
      </Modal>
    </>
  );
}

function Th({
  children,
  rowSpan,
  colSpan,
}: {
  key?: string;
  children?: React.ReactNode;
  rowSpan?: number;
  colSpan?: number;
}) {
  return (
    <th
      colSpan={colSpan || 1}
      rowSpan={rowSpan || 1}
      className="h-[75px] min-w-[85px] max-w-[300px] text-nowrap border-b border-black p-3 text-center"
    >
      {children}
    </th>
  );
}

function Td({
  children,
  rowSpan,
  colSpan,
  className,
  onClick,
}: {
  key?: string;
  children?: React.ReactNode;
  rowSpan?: number;
  colSpan?: number;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <td
      colSpan={colSpan || 1}
      rowSpan={rowSpan || 1}
      className={clsx(
        "min-w-[100px] max-w-[800px] text-nowrap p-2 text-center",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </td>
  );
}
