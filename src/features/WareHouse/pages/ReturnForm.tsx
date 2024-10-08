import { useState } from "react";
import Modal from "../../../Components/modd/Modal/NonDialogModal";
import { LuUpload } from "react-icons/lu";
import clsx from "clsx";
import InputField from "../Form/InputField";
import SelectField from "../Form/SelectField";
import { type Option } from "../../../Components/modd/Select/Select";
import { useForm } from "@tanstack/react-form";
import axios from "axios";
import { type CheckOrderNumResponseData } from "../types/CheckOrderNumTypes";
import { type CheckDocNumResponse } from "../types";

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

  const form = useForm({
    defaultValues: defaultData,
  });
  console.log(form.store.state.values);
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
            validators={{
              onChangeAsync: async ({ value }) => {
                try {
                  const response = await axios.post<
                    CheckDocNumResponse<"return">
                  >(`https://192.168.123.240:9000/api/rr-inv/check-docNum`, {
                    doc_num: value,
                    pattern: "return",
                  });
                  return undefined;
                } catch {
                  return "此文件編號不存在";
                }
              },
            }}
            key="doc_returned"
            name="doc_returned"
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
            children={(field) => (
              <InputField
                type="number"
                isRequired={true}
                field={field}
                span={2}
              />
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
            children={(field) => (
              <InputField
                type="number"
                isRequired={true}
                field={field}
                span={2}
              />
            )}
          />

          <form.Field
            key="amt_returned_sub"
            name="amt_returned_sub"
            children={(field) => (
              <InputField
                type="number"
                isRequired={true}
                field={field}
                span={2}
              />
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
