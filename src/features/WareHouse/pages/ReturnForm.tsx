import { useState } from "react";
import Modal from "../../../Components/modd/Modal/NonDialogModal";
import { LuUpload } from "react-icons/lu";
import { useState } from "react";
import clsx from "clsx";
import InputField from "../Form/InputField";
import SelectField from "../Form/SelectField";
import { useForm, type FieldMeta } from "@tanstack/react-form";
import axios, { isAxiosError } from "axios";
import {
  type CheckDocNumResponseData,
  type CheckDocNumResponse,
} from "../types";
export default function ProductRetrunForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState<
    Array<CheckOrderNumResponseData["order"][number]>
  >([]);
  const [orderProductOptions, setOrderProductOptions] = useState<
    Array<Option<string>>
  >([]);
  const defaultData = {
    date_returned: "2024-09-25", //# 退貨日期
    cause: "品管驗退", //# 退貨原因
    doc_returned: "TEST-RTDOC-0925", //# 退貨文件編號
    doc_received: "TEST-DOC-0925", //# 交貨文件編號
    id_rr: "14653", //# 驗收單id，來源於交貨文件編號成立時
    amt_returned: 200, //# 退貨數量
    amt_unit: "KG", //# 計數單位
    info: "TEST-INSERT-DOCRT", //# 備註
    net_weight: "0.01", //# 淨重
    amt_returned_sub: "5000", //# 退貨數量(輔助)
    amt_unit_sub: "PCS", //# 計數單位(輔助)
  };

  const [maxReturnedAmount, setMaxReturnedAmount] = useState(0);
  const [receipt, setReceipt] = useState<
    CheckDocNumResponse<"return">["data"]["receipt"] | null
  >(null);
  const form = useForm({
    defaultValues: defaultData,
  function resetDocReceivedRelatedFields() {
    console.log("reset");
    form.setFieldMeta("amt_returned", {
      ...(form.getFieldMeta("amt_returned") as FieldMeta),
      errorMap: { onChange: undefined },
      errors: [],
    });
    form.setFieldMeta("id_rr", {
      ...(form.getFieldMeta("id_rr") as FieldMeta),
      errorMap: { onChange: undefined },
      errors: [],
    });
    form.setFieldValue("amt_unit", "");
    form.setFieldValue("id_rr", "");
    form.setFieldValue("amt_unit", "");
    form.setFieldValue("amt_returned", "");
  }

  return (
    <>

      <form
        action=""
        className="flex h-fit min-w-[600px] flex-col rounded-md bg-white px-12 py-4 text-gray-600 shadow-[0_0px_15px_0_rgba(0,0,0,0.2)]"
      >
        <h1 className="border-b-2 border-black py-2 text-center text-2xl font-semibold">
          輸入退貨單
        </h1>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <form.Field
            key="date_returned"
            name="date_returned"
            children={(field) => (
              <InputField
                type="date"
                isRequired={true}
                field={field}
                span={1}
              />
            )}
          />
          <form.Field
            key="cause"
            name="cause"
            children={(field) => (
              <SelectField
                options={(() => {
                  const cause = ["品管驗退", "挑選", "特採"];
                  return cause.map((item) => ({
                    text: item,
                    value: item,
                    id: item,
                  }));
                })()}
                field={field}
                span={1}
              />
            )}
          />
          <form.Field
            key="doc_returned"
            name="doc_returned"
            validators={{
              onBlurListenTo: ["doc_received"],
              onChangeAsync: async ({ value }) => {
                if (!value) {
                  console.log("no value");

                  return "退貨文件編號不可為空";
                }
                // check if the doc number for return is available
                try {
                  const response = await axios.post<CheckDocNumResponseData>(
                    `https://192.168.123.240:9000/api/rr-inv/check-docNum-rt`,
                    {
                      doc_returned: value,
                    },
                  );
                  console.log(response);
                  if (response.data.result === "available") {
                    return undefined;
                  } else {
                    return "退貨文件編號已存在";
                  }
                } catch {
                  return "退貨文件編號已存在";
                }
              },
              onBlur: ({ value, fieldApi }) => {
                if (
                  value &&
                  value === fieldApi.form.getFieldValue("doc_received")
                ) {
                  return "退貨文件編號與交貨文件編號不能相同";
                }
                return undefined;
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
            key="doc_received"
            name="doc_received"
            validators={{
              onBlurAsyncDebounceMs: 0,
              onBlurAsync: async ({ value }) => {
                if (!value) {
                  console.log("this is enter");
                  setReceipt(null);
                  resetDocReceivedRelatedFields();
                  return "交貨文件編碼不可為空";
                }
                try {
                  const response = await axios.post<
                    CheckDocNumResponse<"return">
                  >(`https://192.168.123.240:9000/api/rr-inv/check-docNum`, {
                    doc_num: value,
                    pattern: "return",
                  });

                  const id_rr = response.data.data.receipt.id_rr;
                  if (!id_rr) {
                    resetDocReceivedRelatedFields();
                    setReceipt(null);
                    return "交貨文件編碼不存在";
                  }
                  const amt_unit = response.data.data.receipt.amt_unit;
                  setReceipt(response.data.data.receipt);
                  form.setFieldValue("amt_unit", amt_unit);
                  form.setFieldValue("id_rr", String(id_rr));
                  setMaxReturnedAmount(
                    response.data.data.receipt.amt_delivered,
                  );
                } catch (error) {
                  resetDocReceivedRelatedFields();
                  if (isAxiosError(error)) {
                    const errorCode = error.response?.status;
                    if (
                      errorCode === 400 &&
                      error.response?.data.info_check.message.includes(
                        "required field",
                      )
                    ) {
                      return (
                        // This scenario should not occur because if the value is empty, the request won't be sent.
                        // The error response indicates a missing required field, which should have been prevented by the earlier validation.
                        "請立即回報 \n" +
                        error.response?.data.info_check.message
                      );
                    }
                  }
                  console.log(error);
                  return "交貨文件編碼不存在";
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
            key="id_rr"
            name="id_rr"
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
            key="amt_returned"
            name="amt_returned"
            validators={{
              onChangeListenTo: ["doc_received"],
              onChange: ({ value }) => {
                if (!value) {
                  return undefined;
                }
                if (!/^[0-9]+$/.test(value)) {
                  return "退貨數量只能為數字";
                }
                console.log(form.getFieldMeta("amt_returned"));
                if (Number(value) === 0) {
                  return undefined;
                }
                if (receipt === null && Number(value) !== 0) {
                  console.log(value);
                  console.log(Number(value) === 0);
                  form.setFieldValue("amt_returned", "");
                  return "請先選擇交貨文件編碼";
                }
                if (Number(value) > maxReturnedAmount) {
                  return "退貨數量已超出該驗收單交貨數量";
                }
                if (receipt && receipt.amt_delivered)
                  if (Number(value) > receipt?.amt_delivered) {
                    return "退貨數量已超出該驗收單交貨數量";
                  }

                return undefined;
              },
            }}
            children={(field) => (
              <InputField isRequired={true} field={field} span={2} />
            )}
          />

          <form.Field
            key="amt_unit"
            name="amt_unit"
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
            key="net_weight"
            name="net_weight"
            validators={{
              onChange: ({ value }) => {
                if (!value) {
                  return undefined;
                }
                if (!/^[0-9]+$/.test(value)) {
                  return "淨重只能為數字";
                }
                return undefined;
              },
            }}
            children={(field) => (
              <InputField isRequired={true} field={field} span={2} />
            )}
          />

          <form.Field
            key="amt_returned_sub"
            name="amt_returned_sub"
            validators={{
              onChange: ({ value }) => {
                if (!value) {
                  return undefined;
                }
                if (!/^[0-9]+$/.test(value)) {
                  return "退貨數量(輔助)只能為數字";
                }
                return undefined;
              },
            }}
            children={(field) => (
              <InputField isRequired={true} field={field} span={2} />
            )}
          />

          <form.Field
            key="amt_unit_sub"
            name="amt_unit_sub"
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
            key="info"
            name="info"
            children={(field) => (
              <InputField
                type="text"
                isRequired={true}
                field={field}
                span={2}
              />
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
    </>
  );
}
