import { useState } from "react";
import Modal from "../Components/modd/Modal/NonDialogModal";
import { LuUpload } from "react-icons/lu";
import clsx from "clsx";
import Form from "../features/WareHouse/Form/Form";
import InputField from "../features/WareHouse/Form/InputField";
import FormFieldContent from "../features/WareHouse/Form/FormField";
import { useForm, mergeForm, useTransform } from "@tanstack/react-form";
import axios from "axios";
import { type CheckOrderNumResponseData } from "../features/WareHouse/types/CheckOrderNumTypes";
export default function Warehouse() {
  // const
  const [isOpen, setIsOpen] = useState(false);
  // const [state, action] = useActionState(someAction, initialFormState)
  const defaultData = {
    doc_num: "",
    supplier_code: "",
    date_accepted: "",
    deliver_product: "",
    deliver_prodNum: "",
    id_order: "",
    order_num: "",
    order_product: "",
    order_prodType: "",
    order_prodModel: "",
    order_prodNum: "",
    amt_unit: "",
    amt_order: "",
    amt_delivered: "",
    amt_delivered_sub: "",
    amt_unit_sub: "",
    net_weight: "",
  };

  const form = useForm({
    defaultValues: defaultData,
  });

  return (
    <div className="-mx-24 mb-5 flex justify-between gap-2">
      <button type="button" onClick={() => setIsOpen(true)}>
        Open
      </button>
      <form
        action=""
        className="flex h-fit min-w-[600px] flex-col rounded-md bg-white px-12 py-4 text-gray-600 shadow-[0_0px_15px_0_rgba(0,0,0,0.2)]"
      >
        <h1 className="border-b-2 border-black py-2 text-center text-2xl font-semibold">
          輸入驗收單
        </h1>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <form.Field
            key="date_accepted"
            name="date_accepted"
            children={(field) => (
              <InputField type="date" field={field} span={2} />
            )}
          />
          <form.Field
            asyncDebounceMs={1000}
            validators={{
              onChangeAsync: async ({ value }) => {
                console.log("A request is sent to server");
                const response = await axios
                  .post(
                    "https://192.168.123.240:9000/api/rr-inv/check-docNum",
                    {
                      doc_num: value,
                      // pattern: "return",
                      pattern: "receive",
                    },
                  )
                  .catch((e) => {
                    console.log(e);
                    return "驗收單號不存在";
                  });

                console.log(response);
                return undefined;
              },
            }}
            key="doc_num"
            name="doc_num"
            children={(field) => <InputField field={field} span={2} />}
          />
          <form.Field
            asyncDebounceMs={500}
            validators={{
              onChangeAsync: async ({ value }) => {
                const response = await axios
                  .post<CheckOrderNumResponseData>(
                    "https://192.168.123.240:9000/api/rr-inv/check-orderNum",
                    {
                      order_num: value,
                    },
                  )
                  .catch((e) => {
                    console.log(e);
                    return "訂單號碼不存在";
                  });
                if (typeof response !== "string") {
                  console.log(response.data.order[0].supplier_code);
                  const isOrderExist = response.data.order.length > 0;
                  if (!isOrderExist) {
                    return "訂單號碼不存在";
                  }
                  form.setFieldValue(
                    "supplier_code",
                    response.data.order[0].supplier_code,
                  );
                }

                console.log(response);
                return undefined;
              },
            }}
            key="order_num"
            name="order_num"
            children={(field) => <InputField field={field} span={2} />}
          />
          <form.Field
            key="supplier_code"
            name="supplier_code"
            children={(field) => <InputField field={field} span={1} />}
          />
          <form.Field
            key="order_product"
            name="order_product"
            children={(field) => <InputField field={field} span={1} />}
          />
          <form.Field
            key="order_prodType"
            name="order_prodType"
            children={(field) => <InputField field={field} span={1} />}
          />
          <form.Field
            key="order_prodModel"
            name="order_prodModel"
            children={(field) => <InputField field={field} span={1} />}
          />
          <form.Field
            key="deliver_product"
            name="deliver_product"
            children={(field) => <InputField field={field} span={2} />}
          />
          <form.Field
            key="deliver_prodNum"
            name="deliver_prodNum"
            children={(field) => <InputField field={field} span={2} />}
          />
          <form.Field
            key="amt_delivered_sub"
            name="amt_delivered_sub"
            children={(field) => <InputField field={field} span={1} />}
          />
          <form.Field
            key="amt_unit"
            name="amt_unit"
            children={(field) => <InputField field={field} span={1} />}
          />
          <div className="hidden">
            <form.Field
              key="amt_unit_sub"
              name="amt_unit_sub"
              children={(field) => <InputField field={field} span={1} />}
            />
            <form.Field
              key="id_order"
              name="id_order"
              children={(field) => <InputField field={field} span={2} />}
            />
            <form.Field
              key="order_prodNum"
              name="order_prodNum"
              children={(field) => <InputField field={field} span={2} />}
            />

            <form.Field
              key="amt_order"
              name="amt_order"
              children={(field) => <InputField field={field} span={2} />}
            />
            <form.Field
              key="amt_delivered"
              name="amt_delivered"
              children={(field) => <InputField field={field} span={2} />}
            />

            <form.Field
              key="net_weight"
              name="net_weight"
              children={(field) => <InputField field={field} span={2} />}
            />
          </div>
          <form.Subscribe
            selector={(state) => ({
              ...state,
              canSubmit: state.canSubmit,
              isSubmitting: state.isSubmitting,
            })}
            children={({ canSubmit, isSubmitting, isDirty }) => {
              const isBTNDisabled = !canSubmit || isSubmitting || !isDirty;
              return (
                <>
                  <button
                    type="submit"
                    disabled={isBTNDisabled}
                    className={clsx(
                      "col-span-2 my-4 flex items-center justify-center gap-4 rounded-md bg-gray-600 py-4 text-lg text-white shadow-[0_10px_25px_0_rgba(0,0,0,0.2)]",
                      {
                        "cursor-not-allowed opacity-50": isBTNDisabled,
                      },
                    )}
                  >
                    <LuUpload size={24} />
                    確認上傳
                  </button>
                </>
              );
            }}
          />
        </div>
      </form>
      <form
        action=""
        className="flex h-fit min-w-[600px] flex-col rounded-md bg-white px-12 py-4 text-gray-600 shadow-[0_0px_15px_0_rgba(0,0,0,0.2)]"
      >
        <h1 className="border-b-2 border-black py-2 text-center text-2xl font-semibold">
          輸入驗收單
        </h1>
        <div className="grid w-full grid-cols-2 gap-x-4 space-y-3 py-2">
          <label
            htmlFor=""
            className="col-span-2 flex flex-col gap-4 border-b-2 text-sm"
          >
            <span>收貨日期 **</span>
            <input type="date" name="" id="" required />
          </label>
          <label
            htmlFor=""
            className="col-span-2 flex flex-col gap-4 border-b-2 text-sm"
          >
            <span>文件編碼 *</span>
            <input type="text" name="" id="" />
          </label>
          <label
            htmlFor=""
            className="col-span-2 flex flex-col gap-4 border-b-2 text-sm"
          >
            <span>訂單編碼 *</span>
            <input type="text" name="" id="" />
          </label>
          <label htmlFor="" className="flex flex-col gap-4 border-b-2 text-sm">
            <span>廠商代號 *</span>
            <select name="" id=""></select>
            {/* <Select options={[]} className=" px-4" /> */}
          </label>
          <label htmlFor="" className="flex flex-col gap-4 border-b-2 text-sm">
            <span>訂單品名 *</span>
            <select name="" id=""></select>
          </label>
          <label htmlFor="" className="flex flex-col gap-4 border-b-2 text-sm">
            <span>品名規格 *</span>
            <select name="" id=""></select>
          </label>
          <label htmlFor="" className="flex flex-col gap-4 border-b-2 text-sm">
            <span>Model_No *</span>
            <select name="" id=""></select>
          </label>
          <label
            htmlFor=""
            className="col-span-2 flex flex-col gap-4 border-b-2"
          >
            <span className="text-red-400">交付產品 *</span>
            <select name="" id=""></select>
          </label>
          <label
            htmlFor=""
            className="col-span-2 flex flex-col gap-4 border-b-2"
          >
            <span>交貨數量 *</span>
            <select name="" id=""></select>
          </label>
          <label htmlFor="" className="flex flex-col gap-4 border-b-2 text-sm">
            <span>交貨數量(輔助) </span>
            <select name="" id=""></select>
          </label>
          <label htmlFor="" className="flex flex-col gap-4 border-b-2 text-sm">
            <span>單位 </span>
            <select name="" id=""></select>
          </label>
        </div>

        <button className="col-span-2 my-4 flex items-center justify-center gap-4 rounded-md bg-gray-600 py-4 text-lg text-white shadow-[0_10px_25px_0_rgba(0,0,0,0.2)]">
          <LuUpload size={24} />
          確認上傳
        </button>
      </form>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <table className="w-fit table-auto border-separate border-spacing-0 text-nowrap bg-white align-middle">
          <thead>
            <tr>
              <Th rowSpan={2}>檢驗項目</Th>
              <Th rowSpan={2}>抽樣數</Th>
              <Th colSpan={3}>(AC/不良數)</Th>
              <Th rowSpan={2}>檢驗記錄</Th>
              <Th rowSpan={2}>結果</Th>
            </tr>
            <tr>
              <Th>嚴重</Th>
              <Th>主要</Th>
              <Th>次要</Th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 12 }).map((_, index) => (
              <tr key={index}>
                <Td>A</Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td>
                  <input
                    type="text"
                    name="1"
                    id="1"
                    title="1"
                    className="w-1/5 rounded-md border"
                  />
                  <input
                    type="text"
                    name="1"
                    id="2"
                    title="1"
                    className="w-1/5 rounded-md border"
                  />
                  <input
                    type="text"
                    name="1"
                    id="3"
                    title="1"
                    className="w-1/5 rounded-md border"
                  />
                  <input
                    type="text"
                    name="1"
                    id="4"
                    title="1"
                    className="w-1/5 rounded-md border"
                  />
                  <input
                    type="text"
                    name="1"
                    id="5"
                    title="1"
                    className="w-1/5 rounded-md border"
                  />
                </Td>
                <Td></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>
    </div>
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
