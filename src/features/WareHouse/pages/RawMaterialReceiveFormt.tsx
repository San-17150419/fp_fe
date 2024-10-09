import InputField from "../Form/InputField";
import { useState } from "react";
import SelectField from "../Form/SelectField";
import { useForm } from "@tanstack/react-form";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { type CheckDOrderNumResponse } from "../types";
export default function RawMaterialReceiveFormt() {
  const [orders, setOrders] = useState<CheckDOrderNumResponse["order"]>([]);
  const form = useForm({
    defaultValues: {
      // 'id_dorder',
      // 'doc_num',
      // 'dorder_num',
      // 'date_back',
      // 'supplier_code',
      // 'deliver_product',
      // 'deliver_prodNum',
      // 'do_product',
      // 'do_prodModel',
      // 'do_prodNum',
      // 'process',
      // "amt_unit",
      // "amt_order",
      // 'amt_def',
      // 'unit_def',
      id_dorder: "", //number # 串接料品交運單
      doc_num: "", //
      dorder_num: "", // # 料品交運單號
      date_back: "", // # 實際回貨日期
      supplier_code: "", // # 供應商
      deliver_product: "", //
      deliver_prodNum: "", //
      do_product: "", // # 交運單產品
      do_prodModel: "", // # 交運單產品Model No
      do_prodNum: "", // # 交運單產品編號
      process: "", // # 工序
      amt_unit: "", //
      amt_order: "", //number
      amt_def: "", // # 實際送交數量
      unit_def: "KG", // # 計數單位，固定為KG
      net_weight: "", // 不用
      amt_inv: "", // 不用
      unit_inv: "", // 不用
    },
  });

  return (
    <>
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="mx-auto flex h-fit w-[600px] flex-col rounded-md bg-white px-12 py-4 text-gray-600 shadow-[0_0px_15px_0_rgba(0,0,0,0.2)]"
      >
        <h1 className="border-b-2 border-black py-2 text-center text-2xl font-semibold">
          輸入料品交運單(回貨)
        </h1>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <form.Field
            key="date_back"
            name="date_back"
            children={(field) => (
              <InputField
                type="date"
                isRequired={true}
                field={field}
                span={2}
              />
            )}
          />
          <form.Field
            key="id_dorder"
            name="id_dorder"
            children={(field) => (
              <InputField
                type="text"
                isRequired={true}
                field={field}
                span={2}
              />
            )}
          />
          <form.Field
            key="dorder_num"
            name="dorder_num"
            validators={{
              onChangeAsync: async ({ value }) => {
                if (!value) return "料品交運單編號不可為空";
                try {
                  // HP2400183-1
                  const response = await axios.post<CheckDOrderNumResponse>(
                    "https://192.168.123.240:9000/api/rr-inv/check-orderNum-do",
                    { dorder_num: value },
                  );
                  if (response.data.order.length === 0) {
                    if (orders.length !== 0) {
                      setOrders([]);
                    }
                    return "料品交運單不存在";
                  }
                  // toast.success(response.data.post);
                  setOrders(response.data.order);
                  toast.success("success");
                  console.log(response);
                  return undefined;
                } catch (error) {
                  if (orders.length !== 0) {
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
              />
            )}
          />
          <form.Field
            key="doc_num"
            name="doc_num"
            children={(field) => (
              <InputField
                type="text"
                isRequired={true}
                field={field}
                span={2}
              />
            )}
          />
          <form.Field
            // 交運單品名
            key="do_product"
            name="do_product"
            children={(field) => (
              <SelectField
                isRequired={true}
                options={(() => {
                  console.log("this is from do_product");
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
                span={2}
              />
            )}
          />
          <form.Subscribe
            selector={(state) => ({
              currentDoProduct: state.values.do_product,
            })}
            children={({ currentDoProduct }) => {
              const options = [{ id: "", text: "請選擇交付產品", value: "" }];
              if (currentDoProduct && orders) {
                const currentProductOrders = orders.find(
                  (order) => order.do_product === currentDoProduct,
                );
                if (currentProductOrders) {
                  currentProductOrders.product_option.forEach((option) => {
                    options.push({
                      id: option.item_code,
                      text: option.item_name,
                      value: option.item_code,
                    });
                  });
                }
              }
              return (
                <form.Field
                  // 交付產品，after do_product is selected, polulated the options from product_option under that do_product
                  key="deliver_product"
                  name="deliver_product"
                  children={(field) => (
                    <SelectField
                      isRequired={true}
                      options={options}
                      field={field}
                      span={2}
                    />
                  )}
                />
              );
            }}
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
                    onChange(value) {
                      if (!value) return "請輸入數量";
                    },
                  }}
                  children={(field) => (
                    <InputField
                      readOnly={isReadOnly}
                      isRequired={true}
                      field={field}
                      span={1}
                      className={`${isReadOnly ? "caret-transparent" : ""}`}
                    />
                  )}
                />
              );
            }}
          />
        </div>
      </form>
    </>
  );
}
