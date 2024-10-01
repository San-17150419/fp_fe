import { useState } from "react";
import Modal from "../Components/modd/Modal/NonDialogModal";
import { LuUpload } from "react-icons/lu";
import clsx from "clsx";
import InputField from "../features/WareHouse/Form/InputField";
import SelectField from "../features/WareHouse/Form/SelectField";
import { type Option } from "../Components/modd/Select/Select";
import { useForm } from "@tanstack/react-form";
import axios from "axios";
import { type CheckOrderNumResponseData } from "../features/WareHouse/types/CheckOrderNumTypes";
import { type CheckDocNumResponse } from "../features/WareHouse/types";
export default function Warehouse() {
  // const
  const [isOpen, setIsOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState<
    Array<CheckOrderNumResponseData["order"][number]>
  >([]);
  const [orderProductOptions, setOrderProductOptions] = useState<
    Array<Option<string>>
  >([]);
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
            asyncDebounceMs={200}
            validators={{
              onChangeAsync: async ({ value }) => {
                try {
                  const response = await axios.post<
                    CheckDocNumResponse<"receive">
                  >("https://192.168.123.240:9000/api/rr-inv/check-docNum", {
                    doc_num: value,
                    pattern: "receive",
                  });
                  console.log(response.data);
                  if (!response.data.data.doc_exist) {
                    return undefined;
                  } else {
                    return "文件編碼已存在";
                  }
                } catch (error) {
                  console.log(error);
                  return "文件編碼已存在";
                }
              },
            }}
            key="doc_num"
            name="doc_num"
            children={(field) => <InputField field={field} span={2} />}
          />
          <form.Field
            // TODO: Right now, in order to prevent sending requests too often, I am using asyncDebounceMs. But this might have negative effects on user experience. For example, when they copy and paste the order number, there will still be a 500ms delay. It is possible to reduce the delay so that it is negligible to the user, but still prevent sending requests too often. If this is still an issue, I might need to manually debounce the requests so the logic is more refined.
            // TODO: Idealy, when the order number is changed ( for example, cleared), fields that are dependent on the order number should also be cleared.
            asyncDebounceMs={500}
            validators={{
              onChangeAsync: async ({ value }) => {
                try {
                  const response = await axios.post<CheckOrderNumResponseData>(
                    "https://192.168.123.240:9000/api/rr-inv/check-orderNum",
                    {
                      order_num: value,
                    },
                  );
                  console.log(response.data);
                  if (
                    response &&
                    response.data &&
                    Array.isArray(response.data.order)
                  ) {
                    const isOrderExist = response.data.order.length > 0;
                    const productOptions: Option<string>[] =
                      response.data.order.map((item) => ({
                        value: item.order_product,
                        text: item.order_product,
                        id: item.order_product,
                      }));

                    setOrderProductOptions(productOptions);
                    setOrderDetails(response.data.order);
                    if (!isOrderExist) {
                      return "訂單號碼不存在";
                    } else {
                      // TODO: Maybe send a notification if total_delivered already exeeds amt_order? And lock the submit button.

                      form.setFieldValue(
                        "supplier_code",
                        response.data.order[0].supplier_code,
                      );
                      return undefined;
                    }
                  } else {
                    console.log("Unexpected response structure");
                    return "訂單號碼不存在";
                  }
                } catch (e) {
                  console.log("Error occurred:", e);
                  return "訂單號碼不存在"; // Catch any network or server errors
                }
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
            validators={{
              onChange({ value }) {
                const orderProdType = orderDetails.find((order) => {
                  return order.order_product === value;
                });
                if (!orderProdType) {
                  console.log("orderProdType not found");
                  const meta = form.getFieldMeta("order_prodType");
                  if (meta) {
                    console.log("field meta");
                    form.setFieldMeta("order_prodType", {
                      ...meta,
                      errors: [...meta?.errors, "訂單型號不存在"],
                    });
                  } else {
                    console.log("field meta not found");
                  }
                } else {
                  form.setFieldValue(
                    "order_prodType",
                    orderProdType.order_prodType,
                  );
                }
                // TODO: I need to set deliver_product as well. I think this is from product_option

                const orderProdModel = orderDetails.find((order) => {
                  return order.order_product === value;
                });
                if (!orderProdModel) {
                  console.log("orderProdModel not found");
                  const meta = form.getFieldMeta("order_prodModel");
                  if (meta) {
                    console.log("field meta");
                    form.setFieldMeta("order_prodModel", {
                      ...meta,
                      errors: [...meta?.errors, "訂單型號不存在"],
                    });
                  } else {
                    console.log("field meta not found");
                  }
                } else {
                  form.setFieldValue(
                    "order_prodModel",
                    orderProdModel.order_prodModel,
                  );
                }
                //TODO: Remove redundant check. And the unit should be added to deliver_product, not amt_unit_sub
                const amtUnit = orderDetails.find((order) => {
                  return order.order_product === value;
                })?.amt_unit;
                if (!amtUnit) {
                  console.log("amtUnit not found");
                  const meta = form.getFieldMeta("amt_unit");
                  if (meta) {
                    console.log("field meta");
                    form.setFieldMeta("amt_unit", {
                      ...meta,
                      errors: [...meta?.errors, "訂單型號不存在"],
                    });
                  } else {
                    console.log("field meta not found");
                  }
                } else {
                  form.setFieldValue("amt_unit", amtUnit);
                }
                // TODO: This is needed to reset deliver_product when order_product is changed. I am not sure this is the correct way to do so. form.Subscribe
                form.setFieldValue("deliver_product", "");

                return undefined;
              },
            }}
            children={(field) => (
              <SelectField
                field={field}
                options={orderProductOptions}
                span={1}
              />
            )}
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
          <form.Subscribe
            selector={(state) => ({
              currentOrderProduct: state.values.order_product,
            })}
            children={({ currentOrderProduct }) => {
              console.log("this is render");
              return (
                <form.Field
                  key="deliver_product"
                  name="deliver_product"
                  // TODO: This is not responsive as I hope. When currentProduct is changed, the value should be reset. But right now, I need to manually reset it in the onChange handler of the order_product field. (the options are updated, but the value is not changed. )
                  // The value in form, field, FormInputField, formField, and Select is the same. So this is not caused by unsync data. So I probably don't need to worry about it. As long as the value in form is correctly set, all data is correct. But I still need to do more tests to confirm it.
                  children={(field) => (
                    <SelectField
                      options={(() => {
                        const options: Option<string>[] = [
                          { value: "", text: "", id: "" },
                        ];
                        orderDetails
                          .find(
                            (order) =>
                              order.order_product === currentOrderProduct,
                          )
                          ?.product_option.map((item) => ({
                            value: item.item_code,
                            text: item.item_name,
                            id: item.item_code,
                          }))
                          .forEach((item) => options.push(item));

                        // console.log(options);
                        return options;
                      })()}
                      field={field}
                      span={2}
                    />
                  )}
                />
              );
            }}
          />
          <form.Field
            // TODO: See where can I add amt_unit to this.  I think I need to modify InputField component to do so.
            validators={{
              onChangeListenTo: ["order_product"],
              onChange: ({ value, fieldApi }) => {
                if (!/^[0-9]*$/.test(value)) return "數字格式錯誤";
                const currentOrderProduct =
                  fieldApi.form.getFieldValue("order_product");
                const history = orderDetails.find((order) => {
                  return order.order_product === currentOrderProduct;
                })?.history;
                const amtOrder = orderDetails.find((order) => {
                  return order.order_product === currentOrderProduct;
                })?.amt_order;
                if (!history) {
                  // TODO: I need to think when this happens. If I lock this field untill order_product has a value, then history should always exist?
                  console.log("history not found");
                  return undefined;
                }
                console.log("history", history);
                if (!!amtOrder) {
                  console.log(
                    amtOrder - Number(history.total_delivered) - Number(value) <
                      0,
                  );
                }
                // TODO: Refactor this.
                if (!!history.total_delivered) {
                  if (!!amtOrder) {
                    if (
                      amtOrder -
                        Number(history.total_delivered) -
                        Number(value) <
                      0
                    ) {
                      return "訂單已達收取上限";
                    } else {
                      return undefined;
                    }
                  }
                }
                return undefined;
              },
            }}
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
          {/* TODO: use form.Subscribe component to perform side effect. See if I can build a custom component on top of this. fields that are autofilled   */}
          {/* TODO: Pay atttention to how many times form.Subscribe component is re-rendered. I am not sure if the selector inside the form.Subscribe component is functioning as the selector from redux. Allows you to subscribe to a specific part of the data to optimize rendering */}
          <div className="hidden">
            {/* TODO: Check what fields are rendered or displayed to the user. If they don't need to be seen, I think I don't need to render them and simply update their value from the onChange handler in other fields (order_product and deliver_product) */}
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
              // TODO: Update isBTNDisabled logic to ensure the button is disabled when at least one field is not valid. (The problem is the validator in each fields is only run when the field is touched. So technically speaking, if field is not touched, then the field is valid.)
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