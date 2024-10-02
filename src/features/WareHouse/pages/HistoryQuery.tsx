import React from "react";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { report } from "process";
import InputField from "../Form/InputField";
import SelectField from "../Form/SelectField";
import axios from "axios";
import Loading from "../../../Components/Loading";
import { type QueryOrderHIstoryResponseData } from "../types/QueryOrderHIstoryTypes";

export default function HistoryQuery() {
  const { data, isPending } = useQuery({
    queryKey: ["deliveryData"],
    queryFn: async () => {
      const api = "https://192.168.123.240:9000/api/rr-inv/filterData";
      const response = await axios.post<QueryOrderHIstoryResponseData>(api, {
        date_start: "",
        date_end: "",
        doc_class: "",
        doc_num: "",
        order_num: "",
        order_product: "",
        status_IQC: "",
        report_IQC: "",
      });
      console.log(response.data);
      return response.data;
    },
  });
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

  return (
    <>
      {isPending ? <Loading /> : null}
      {/* <form className="flex w-full gap-4 outline">
        <form.Field
          name="date_start"
          children={(field) => {
            return <InputField field={field} span={1} />;
          }}
        />
        <form.Field
          name="date_end"
          children={(field) => {
            return <InputField field={field} span={1} />;
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
      </form> */}
      <table className="w-full">
        <thead>
          <tr>
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
          </tr>
        </thead>
        <tbody>
          {data &&
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
            ))}
        </tbody>
      </table>
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
      className="h-[75px] min-w-[85px] max-w-[300px] text-nowrap border border-gray-400 p-3 text-center"
    >
      {children}
    </th>
  );
}

function Td({
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
    <td
      colSpan={colSpan || 1}
      rowSpan={rowSpan || 1}
      className="h-[75px] min-w-[100px] max-w-[800px] text-nowrap border border-gray-400 p-2 text-center"
    >
      {children}
    </td>
  );
}
