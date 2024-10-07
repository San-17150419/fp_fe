import { useState } from "react";
import Modal from "../../../Components/modd/Modal/NonDialogModal";
import { LuUpload } from "react-icons/lu";
import clsx from "clsx";
import InputField from "../Form/InputField";
import SelectField from "../Form/SelectField";
import { type Option } from "../../../Components/modd/Select/Select";
import { useForm } from "@tanstack/react-form";
import axios, { isAxiosError } from "axios";
import { type CheckOrderNumResponseData } from "../types/CheckOrderNumTypes";
import { type CheckDocNumResponse } from "../types";

export default function ProductRecieveForm() {
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
    id_order: 0,
    order_num: "",
    order_product: "",
    order_prodType: "",
    order_prodModel: "",
    order_prodNum: "",
    amt_unit: "",
    amt_order: 0,
    amt_delivered: 0,
    amt_delivered_sub: "",
    amt_unit_sub: "PCS",
    net_weight: "",
  };

  const form = useForm({
    defaultValues: defaultData,
    onSubmit: async (values) => {
      const value = {
        ...values.value,
        amt_delivered: Number(values.value.amt_delivered),
      };
      console.log("this is from submit ");
      const api = "https://192.168.123.240:9000/api/rr-inv/insert-receipt";
      try {
        const response = await axios.post(api, value);
        console.log(values.value);
        console.log(response);
        toast.success("Success");
      } catch (error) {
        console.log(error);
        if (isAxiosError(error)) {
          console.log(error?.response?.data?.info_check?.message);
          toast.error(`Error ${error?.response?.data?.info_check?.message}`);
        } else {
          toast.error(`Error ${error}`);
        }
        // toast.error(`Error ${error.data.info_check.message}`);
      }
    },
  });

  function resetFormDataRelatedToOrderNum() {
    if (orderDetails.length === 0) return;
    form.setFieldValue("order_product", "");
    setOrderDetails([]);
    form.setFieldValue("supplier_code", "");
    form.setFieldValue("order_prodType", "");
    form.setFieldValue("order_prodModel", "");
    form.setFieldValue("deliver_product", "");
    form.setFieldValue("amt_delivered", 0);
    form.setFieldValue("amt_unit", "");
    form.setFieldValue("deliver_prodNum", "");
    form.setFieldValue("amt_order", 0);
    form.setFieldValue("id_order", 0);
    form.setFieldValue("order_num", "");
  }
  console.log(form.store.state.values);
  return (
    <>
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="mx-auto flex h-fit w-[600px] flex-col rounded-md bg-white px-12 py-4 text-gray-600 shadow-[0_0px_15px_0_rgba(0,0,0,0.2)]"
      >
        <h1 className="border-b-2 border-black py-2 text-center text-2xl font-semibold">
          輸入驗收單
        </h1>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <form.Field
            key="date_accepted"
            name="date_accepted"
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
            children={(field) => (
              <InputField isRequired={true} field={field} span={2} />
            )}
          />
          <form.Field
            // TODO: Right now, in order to prevent sending requests too often, I am using asyncDebounceMs. But this might have negative effects on user experience. For example, when they copy and paste the order number, there will still be a 500ms delay. It is possible to reduce the delay so that it is negligible to the user, but still prevent sending requests too often. If this is still an issue, I might need to manually debounce the requests so the logic is more refined.
            // TODO: Idealy, when the order number is changed ( for example, cleared), fields that are dependent on the order number should also be cleared.
            asyncDebounceMs={500}
            validators={{
              onChangeAsync: async ({ value }) => {
                if (!value) return undefined;
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
                    console.log(response);
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
                      resetFormDataRelatedToOrderNum();
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
            children={(field) => (
              <InputField isRequired={true} field={field} span={2} />
            )}
          />
          <form.Field
            key="supplier_code"
            name="supplier_code"
            children={(field) => (
              <InputField isRequired={true} field={field} span={1} />
            )}
          />

          <form.Field
            key="order_product"
            name="order_product"
            validators={{
              onChange({ value }) {
                const detailsOfCurrentOrder = orderDetails.find(
                  (order) => order.order_product === value,
                );
                if (!detailsOfCurrentOrder) {
                  // if the order_product can't be found in the orderDetails, something is very wrong.
                  throw new Error(
                    "orderProduct not found. This is a bug. Please report it.",
                  );
                }
                const order_prodType = detailsOfCurrentOrder.order_prodType;
                console.log(order_prodType);
                if (!order_prodType && order_prodType !== "") {
                  throw new Error(
                    "order_prodType not found. This is a bug. Please report it.",
                  );
                }
                form.setFieldValue("order_prodType", order_prodType);

                const order_prodModel = detailsOfCurrentOrder.order_prodModel;
                if (!order_prodModel) {
                  throw new Error(
                    "order_prodModel not found. This is a bug. Please report it.",
                  );
                }

                form.setFieldValue("order_prodModel", order_prodModel);

                const amt_unit = detailsOfCurrentOrder.amt_unit;
                if (!amt_unit) {
                  throw new Error(
                    "amt_order not found. This is a bug. Please report it.",
                  );
                }

                form.setFieldValue("amt_unit", amt_unit);

                const id_order = detailsOfCurrentOrder.id_order;
                if (!id_order) {
                  throw new Error(
                    "id_order not found. This is a bug. Please report it.",
                  );
                }

                form.setFieldValue("id_order", id_order);

                const amt_order = detailsOfCurrentOrder.amt_order;
                if (!amt_order) {
                  throw new Error(
                    "amt_order not found. This is a bug. Please report it.",
                  );
                }
                form.setFieldValue("amt_order", amt_order);

                // TODO: This is needed to reset deliver_product when order_product is changed. I am not sure this is the correct way to do so. form.Subscribe
                form.setFieldValue("deliver_product", "");
                form.setFieldValue(
                  "order_prodNum",
                  detailsOfCurrentOrder.order_prodNum,
                );

                return undefined;
              },
            }}
            children={(field) => (
              <SelectField
                field={field}
                isRequired={true}
                options={orderProductOptions}
                span={1}
              />
            )}
          />
          <form.Field
            key="order_prodType"
            name="order_prodType"
            children={(field) => (
              <InputField isRequired={true} field={field} span={1} />
            )}
          />
          <form.Field
            key="order_prodModel"
            name="order_prodModel"
            children={(field) => (
              <InputField isRequired={true} field={field} span={1} />
            )}
          />
          <form.Subscribe
            selector={(state) => ({
              currentOrderProduct: state.values.order_product,
            })}
            children={({ currentOrderProduct }) => {
              console.log("this is render");
              return (
                <form.Field
                  validators={{
                    onChange({ value }) {
                      const deliverProductOption = orderDetails
                        .find(
                          (order) =>
                            order.order_product === currentOrderProduct,
                        )
                        ?.product_option.find(
                          (option) => option.item_name === value,
                        );
                      deliverProductOption &&
                        form.setFieldValue(
                          "deliver_prodNum",
                          deliverProductOption?.item_code,
                        ) &&
                        form.setFieldValue(
                          "deliver_product",
                          deliverProductOption?.item_name,
                        );

                      return undefined;
                    },
                  }}
                  key="deliver_product"
                  name="deliver_product"
                  // TODO: This is not                   isRequired={true} responsive as I hope. When currentProduct is changed, the value should be reset. But right now, I need to manually reset it in the onChange handler of the order_product field. (the options are updated, but the value is not changed. )
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
                            value: item.item_name,
                            text: item.item_name,
                            id: item.item_code,
                          }))
                          .forEach((item) => options.push(item));

                        return options;
                      })()}
                      field={field}
                      span={2}
                      isRequired={true}
                      labelStyle={"text-red-500"}
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
                if (!/^[0-9]*$/.test(String(value))) {
                  return "格式錯誤，請輸入數字";
                }
                const orderProduct =
                  fieldApi.form.getFieldValue("order_product");
                const orderProductDetails = orderDetails.find(
                  (order) => order.order_product === orderProduct,
                );

                if (!orderProductDetails) {
                  return "訂單不存在";
                }

                const { history, amt_order } = orderProductDetails;

                if (!history) {
                  return "訂單歷史不存在";
                }

                const totalDelivered = Number(history.total_delivered) || 0;
                const remaining = amt_order - totalDelivered;

                if (remaining < 0) {
                  return "訂單已達收取上限";
                }

                return undefined;
              },
            }}
            key="amt_delivered"
            name="amt_delivered"
            children={(field) => (
              <InputField
                isRequired={true}
                field={field}
                span={2}
                valueType="number"
              />
            )}
          />

          <form.Field
            key="amt_delivered_sub"
            name="amt_delivered_sub"
            children={(field) => <InputField field={field} span={1} />}
          />
          <form.Field
            key="amt_unit"
            name="amt_unit"
            children={(field) => (
              <InputField isRequired={true} field={field} span={1} />
            )}
          />
          <form.Field
            key="amt_unit_sub"
            name="amt_unit_sub"
            children={(field) => (
              <InputField isRequired={true} field={field} span={1} />
            )}
          />
          <form.Subscribe
            selector={(state) => ({
              ...state,
              canSubmit: state.canSubmit,
              isSubmitting: state.isSubmitting,
            })}
            children={({ canSubmit, isSubmitting, isDirty, ...state }) => {
              const isBTNDisabled = !canSubmit || isSubmitting || !isDirty;
              console.log(state.values);
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
