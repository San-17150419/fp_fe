import InputField from "../Form/InputField";
import { useState } from "react";
import SelectField from "../Form/SelectField";
import { useForm } from "@tanstack/react-form";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";
import {
  type CheckDOrderNumResponse,
  type CheckDocNumResponse,
  type InsertMaterialReceiptParams,
  type InsertMaterialReceiptResponse,
} from "../types";
import { LuUpload } from "react-icons/lu";
import clsx from "clsx";

// 料品經由第三方廠商加工後的收貨紀錄
export default function ReceiveMaterialForm() {
  const [orders, setOrders] = useState<CheckDOrderNumResponse["order"]>([]);
  const form = useForm({
    defaultValues: {
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
      amt_def: "", // # 實際送交數量 number
      unit_def: "KG", // # 計數單位，固定為KG
      net_weight: "", // 不用
      amt_inv: "", // 不用
      unit_inv: "", // 不用
    },
    onSubmit: async (values) => {
      // convert data to correct format
      const params: InsertMaterialReceiptParams = {
        ...values.value,
        id_dorder: Number(values.value.id_dorder),
        amt_order: Number(values.value.amt_order),
        amt_def: Number(values.value.amt_def),
      };
      console.log(params);
      try {
        const response = await axios.post<InsertMaterialReceiptResponse>(
          "https://192.168.123.240:9000/api/rr-inv/insert-epback-receipt",
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
    form.setFieldValue("deliver_prodNum", "");
    form.setFieldValue("deliver_product", "");
    form.setFieldValue("do_prodModel", "");
    form.setFieldValue("do_prodNum", "");
    form.setFieldValue("do_product", "");
    form.setFieldValue("process", "");
    form.setFieldValue("amt_def", "");
    form.setFieldValue("amt_unit", "");
    form.setFieldValue("amt_order", "");
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
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
                text={"實際送回日期"}
              />
            )}
          />
          <form.Field
            key="doc_num"
            name="doc_num"
            validators={{
              onChangeAsync: async ({ value }) => {
                if (!value) return "料品交運單號不可為空";
                try {
                  const response = await axios.post<
                    CheckDocNumResponse<"receive">
                  >("https://192.168.123.240:9000/api/rr-inv/check-docNum", {
                    doc_num: value,
                    pattern: "receive",
                  });
                  if (response.data.data.doc_exist) return "料品交運單號已存在";
                  return undefined;
                } catch (error) {
                  if (isAxiosError(error)) {
                    // console.log(error?.response?.data?.info_check?.message);
                    return error?.response?.data?.info_check?.message;
                  }
                  // console.log(error);
                  return "料品交運單號已存在";
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
            key="dorder_num"
            name="dorder_num"
            validators={{
              onChangeAsync: async ({ value }) => {
                // TODO: Fix this is run after form submit.
                if (!value) return "料品交運單編號不可為空";
                console.log("this is run");
                try {
                  // HP2400183-1 is full
                  // HP2400189-1 not full
                  // HP2400220-1 is full
                  const response = await axios.post<CheckDOrderNumResponse>(
                    "https://192.168.123.240:9000/api/rr-inv/check-orderNum-do",
                    { dorder_num: value },
                  );
                  // check 1: if dorder_num exist. If response.data.order.length is 0, dorder_num does not exist.
                  if (response.data.order.length === 0) {
                    // case: dorder_num is changed from valid to invalid. Clears orders to prevent stale data. do_product also need to be reset.
                    // 廠商加工完，但交運單不存在
                    toast.error("料品交運單{dorder_num}不存在，請回報管理者");
                    if (orders.length !== 0) {
                      resetDoProductRelatedFields();
                      setOrders([]);
                    }
                    return "料品交運單不存在";
                  } else {
                    response.data.order;
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
                  form.setFieldValue("amt_order", "");
                  form.setFieldValue("do_prodNum", "");
                  form.setFieldValue("id_dorder", "");
                  form.setFieldValue("amt_unit", "");
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
                  amt_order,
                  do_prodNum,
                  id_dorder,
                  amt_unit,
                } = currentOrderDetails;
                form.setFieldValue("supplier_code", supplier_code);
                form.setFieldValue("do_prodModel", do_prodModel);
                form.setFieldValue("process", process);
                form.setFieldValue("amt_order", String(amt_order));
                form.setFieldValue("do_prodNum", do_prodNum);
                form.setFieldValue("id_dorder", String(id_dorder));
                form.setFieldValue("amt_unit", amt_unit);

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
              const options = [{ id: "", text: "請選擇交付產品", value: "" }];
              if (currentDoProduct && orders) {
                const currentProductOrders = orders.find(
                  (order) => order.do_product === currentDoProduct,
                );
                if (currentProductOrders) {
                  currentProductOrders.product_option.forEach((option) => {
                    options.push({
                      id: option.item_name,
                      text: option.item_name,
                      value: option.item_name,
                    });
                  });
                }
              }
              return (
                <form.Field
                  // 交付產品，after do_product is selected, polulated the options from product_option under that do_product
                  key="deliver_product"
                  name="deliver_product"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) {
                        form.setFieldValue("deliver_prodNum", "");
                        return "請選擇交付產品";
                      }
                      if (!currentDoProduct) return undefined;
                      if (!orders) return "請先輸入料品交運單號";

                      const currentProductDetails = orders.find(
                        (order) => order.do_product === currentDoProduct,
                      );
                      if (currentProductDetails) {
                        form.setFieldValue(
                          "deliver_prodNum",
                          currentProductDetails.product_option.find(
                            (option) => option.item_name === value,
                          )?.item_code as string,
                        );
                      }

                      return undefined;
                    },
                  }}
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
          <form.Subscribe
            selector={(state) => ({
              currentDoProduct: state.values.do_product,
            })}
            children={({ currentDoProduct }) => {
              const currentOrderDetails = orders.find(
                (order) => order.do_product === currentDoProduct,
              );
              const value = currentOrderDetails?.amt_unit ?? "";
              return (
                <form.Field
                  key="amt_unit"
                  name="amt_unit"
                  // the value of amt_unit in form is not updated when do_product is changed. Even though the value variable in form.Subscribe is updated. Now, it is being manually updated in do_product field.
                  children={(field) => (
                    <InputField
                      type="text"
                      isRequired={true}
                      readOnly
                      value={value}
                      field={field}
                      span={1}
                    />
                  )}
                />
              );
            }}
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
                "doc_num",
                "dorder_num",
                "date_back",
                "supplier_code",
                "deliver_product",
                "deliver_prodNum",
                "do_product",
                "do_prodModel",
                "do_prodNum",
                "process",
                "amt_unit",
                "amt_order",
                "amt_def",
                "unit_def",
              ];
              const isRequiredFieldsFilled = requiredFields.every(
                (field) => state.values[field as keyof typeof state.values],
              );
              const isBTNDisabled =
                !canSubmit ||
                isSubmitting ||
                !isDirty ||
                !isRequiredFieldsFilled;
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
      {/* Do not commit content below this line */}
      <div className="absolute bottom-0 right-0 w-1/4 whitespace-pre bg-white">
        {JSON.stringify(
          {
            post: {
              dorder_num: "HP2400183-1",
            },
            order: [
              {
                id_dorder: 6070,
                date: "2024-09-25",
                dorder_num: "HP2400183-1",
                supplier_code: "PL06",
                process: "電鍍(电镀)",
                do_prodModel: "铜管",
                do_product: "KPA8H-TE",
                amt_order: 134,
                amt_unit: "KG",
                do_prodNum: "BH-0202",
                item_size: "None",
                product_no: "KPA8H-T",
                history: {
                  id_dorder: 6070,
                  total_sent: 134,
                  total_back: null,
                },
                product_option: [
                  {
                    item_name: "KPA8H-TE",
                    item_code: "BH-0202",
                  },
                ],
              },
            ],
            info_check: {
              status: "PASS",
              message: "",
            },
          },
          null,
          4,
        )}
      </div>
    </>
  );
}