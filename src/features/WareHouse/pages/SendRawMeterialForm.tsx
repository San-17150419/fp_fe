import { useState } from "react";
import { toast } from "react-toastify";
import InputField from "../Form/InputField";
import SelectField from "../Form/SelectField";
import { useForm } from "@tanstack/react-form";
import axios, { isAxiosError } from "axios";
import { LuUpload } from "react-icons/lu";
import clsx from "clsx";
import {
  type InsertMeterialReturnReceiptParams,
  type CheckDOrderNumResponse,
  type InsertMeterialReturnReceiptResponse,
} from "../types";

// 送料品給第三方廠商加工的表單
export default function SendRawMeterialForm() {
  const [orders, setOrders] = useState<CheckDOrderNumResponse["order"]>([]);
  const form = useForm({
    defaultValues: {
      id_dorder: "", // # 串接料品交運單 number
      dorder_num: "", // # 料品交運單號
      date_send: "", // # 實際送交日期
      supplier_code: "", // # 供應商
      do_product: "", // # 交運單產品
      do_prodModel: "", // # 交運單產品Model No
      do_prodNum: "", // # 交運單產品編號
      process: "", // # 工序
      amt_def: "", // # 實際送交數量 number
      unit_def: "KG", // # 計數單位，固定為KG
      amt_inv: "", // # 實際送交數量(輔助) number
      unit_inv: "", // # 計數單位(輔助)
    },
    onSubmit: async (values) => {
      const params: InsertMeterialReturnReceiptParams = {
        ...values.value,
        id_dorder: Number(values.value.id_dorder),
        amt_def: Number(values.value.amt_def),
        amt_inv: Number(values.value.amt_inv),
      };
      try {
        const response = await axios.post<InsertMeterialReturnReceiptResponse>(
          "https://192.168.123.240:9000/api/rr-inv/insert-epsend-receipt",
          params,
        );
        console.log(response);
        toast.success(response.data.info_insert.status);
      } catch (error) {
        console.log(error);
        if (isAxiosError(error)) {
          toast.error(error.response?.data?.info_insert?.error);
        } else {
          toast.error(`Error ${error}`);
        }
      }
    },
  });
  function resetDoProductRelatedFields() {
    form.setFieldValue("id_dorder", "");
    form.setFieldValue("supplier_code", "");
    form.setFieldValue("do_prodModel", "");
    form.setFieldValue("do_prodNum", "");
    form.setFieldValue("do_product", "");
    form.setFieldValue("process", "");
    form.setFieldValue("amt_def", "");
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        // form.handleSubmit();
      }}
      className="mx-auto flex h-fit w-[600px] flex-col rounded-md bg-white px-12 py-4 text-gray-600 shadow-[0_0px_15px_0_rgba(0,0,0,0.2)]"
    >
      <h1 className="border-b-2 border-black py-2 text-center text-2xl font-semibold">
        輸入料品交運單(送出)
      </h1>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <form.Field
          key="date_send"
          name="date_send"
          children={(field) => (
            <InputField
              type="date"
              isRequired={true}
              field={field}
              span={2}
              text={"實際送交日期"}
            />
          )}
        />
        <form.Field
          key="dorder_num"
          name="dorder_num"
          validators={{
            onChangeAsync: async ({ value }) => {
              // TODO: Fix this is run after form submit.
              if (!value) return "料品交運單編號不可為空";
              try {
                // HP2400183-1 is full
                // HP2400189-1 not full
                // HP2400220-1 is full
                const response = await axios.post<CheckDOrderNumResponse>(
                  "https://192.168.123.240:9000/api/rr-inv/check-orderNum-do",
                  { dorder_num: value },
                );
                // if response.data.order is empty in return form means this order hasn't been placed yet.
                if (response.data.order.length === 0) {
                  // case: dorder_num is changed from valid to invalid. Clears orders to prevent stale data. do_product also need to be reset.
                  // 要上傳交運單，可是料品交運單號不存在
                  toast.error("料品交運單號不存在，請回報採購單位");
                  if (orders.length !== 0) {
                    resetDoProductRelatedFields();
                    setOrders([]);
                  }
                  return "料品交運單不存在";
                }
                setOrders(response.data.order);
                toast.success("success");
                // console.log(response);
                return undefined;
              } catch (error) {
                // case: dorder_num is changed from valid to invalid. Clears orders to prevent stale data. do_product also need to be reset.
                if (orders.length !== 0) {
                  resetDoProductRelatedFields();
                  setOrders([]);
                }
                if (isAxiosError(error)) {
                  const { message } = error.response?.data.info_check;
                  const statusCode = error.response?.status;
                  if (statusCode === 500) {
                    toast.error("internal server error");
                    return "internal server error";
                  }
                  toast.error(message || error.message);
                  return message || error.message;
                }
                return "料品交運單不存在";
              }
            },
          }}
          children={(field) => (
            <InputField
              type="text"
              isRequired={true}
              field={field}
              span={2}
              text="料品交運單號"
            />
          )}
        />

        <form.Field
          // 交運單品名
          key="do_product"
          name="do_product"
          // The values of the following fields are derived from the value of `do_product`. `supplier_code`, `do_prodModel`, `process`,`do_prodNum`,`amt_unit`,and `amt_order`. They won't be rendered in the form.
          validators={{
            onChange: ({ value }) => {
              if (!value) {
                form.setFieldValue("supplier_code", "");
                form.setFieldValue("do_prodModel", "");
                form.setFieldValue("process", "");
                form.setFieldValue("do_prodNum", "");
                form.setFieldValue("id_dorder", "");
                form.setFieldValue("amt_def", "");
                return "請選擇品名";
              }
              const currentOrderDetails = orders.find(
                (order) => order.do_product === value,
              );
              if (!currentOrderDetails) return "料品交運單不存在"; // This shuold never happen. This means the states are not updated correctly.
              const {
                supplier_code,
                do_prodModel,
                process,
                do_prodNum,
                id_dorder,
              } = currentOrderDetails;
              form.setFieldValue("supplier_code", supplier_code);
              form.setFieldValue("do_prodModel", do_prodModel);
              form.setFieldValue("process", process);
              form.setFieldValue("do_prodNum", do_prodNum);
              form.setFieldValue("id_dorder", String(id_dorder));

              // send notification if this order is full
              const isOrderFull = (() => {
                const currentOrderDetails = orders.find(
                  (order) => order.do_product === value,
                );
                // do_product is not found or selected yet, return false. This is different from `amt_def`, which return true in this case. Because you can't tell if the order is full or not when do_product is not selected.
                if (!currentOrderDetails) return false;
                // do_product is found but amt_order is not found
                if (!currentOrderDetails.amt_order) return true;
                // amt_order is found, but history is null or undefined. Which means total_sent is 0
                if (!currentOrderDetails.history) return false;
                if (!currentOrderDetails.history?.total_sent) return true;
                if (
                  currentOrderDetails.history.total_sent <
                  currentOrderDetails.amt_order
                )
                  return false;
                return true;
              })();
              if (isOrderFull) {
                toast.info(
                  "料品交運單{dorder_num}已達最大送出數，請回報採購單位",
                );
              }
              // always return undefined. I only use this to send notification, not to validate
              return undefined;
            },
          }}
          children={(field) => (
            <SelectField
              isRequired={true}
              options={(() => {
                const options = [{ id: "", text: "請選擇品名", value: "" }];
                orders.forEach((order) => {
                  options.push({
                    id: order.do_product,
                    text: order.do_product,
                    value: order.do_product,
                  });
                });
                return options;
              })()}
              field={field}
              text="交運單品名"
              span={2}
            />
          )}
        />
        <form.Subscribe
          selector={(state) => ({
            currentDoProduct: state.values.do_product,
          })}
          children={({ currentDoProduct }) => {
            const currentOrderDetails = orders.find(
              (order) => order.do_product === currentDoProduct,
            );
            const isReadOnly = (() => {
              // if do_product is not found or selected yet, return true.
              if (!currentOrderDetails) return true;
              // do_product is found but amt_order is not found, return true.
              if (!currentOrderDetails.amt_order) return true;
              //  amt_order is found, but history is null or undefined. Which means total_sent is 0
              if (!currentOrderDetails.history) return false;
              // amt_order is not undefined or null, but total_send is 0 or undefined or null, return false
              if (!currentOrderDetails.history.total_sent) return false;
              //  total_sent is smaller than amt_order, return false
              if (
                currentOrderDetails.history.total_sent <
                currentOrderDetails.amt_order
              )
                return false;
              return true;
            })();
            return (
              <form.Field
                key="amt_def"
                name="amt_def"
                validators={{
                  onChange({ value }) {
                    // TODO: Check if an upper limit is needed
                    if (!value) return "請輸入數量";
                    if (/^\d+$/.test(value) === false) return "請輸入數字";
                    return undefined;
                  },
                }}
                children={(field) => (
                  <InputField
                    readOnly={isReadOnly}
                    isRequired={true}
                    field={field}
                    span={1}
                    text="實際送回數量"
                    className={`${isReadOnly ? "caret-transparent" : ""}`}
                  />
                )}
              />
            );
          }}
        />
        <form.Field
          key="unit_def"
          name="unit_def"
          children={(field) => (
            <InputField span={1} field={field} text="單位" readOnly />
          )}
        />
        <form.Subscribe
          selector={(state) => ({
            ...state,
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
          children={({ canSubmit, isSubmitting, isDirty, ...state }) => {
            const requiredFields = [
              "id_dorder",
              "dorder_num",
              "date_send",
              "supplier_code",
              "do_product",
              "do_prodModel",
              "do_prodNum",
              "process",
              "amt_def",
              "unit_def",
              "amt_inv",
              "unit_inv",
            ];
            const isRequiredFieldsFilled = requiredFields.every(
              (field) => state.values[field as keyof typeof state.values],
            );
            const isBTNDisabled =
              !canSubmit || isSubmitting || !isDirty || !isRequiredFieldsFilled;
            console.log(state.values);
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
  );
}