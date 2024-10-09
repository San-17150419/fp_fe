import InputField from "../Form/InputField";
import SelectField from "../Form/SelectField";
import { useForm } from "@tanstack/react-form";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { type CheckDOrderNumResponse } from "../types";
export default function RawMaterialReceiveFormt() {
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
                  if (response.data.order.length === 0)
                    return "料品交運單不存在";
                  // toast.success(response.data.post);
                  toast.success("success");
                  console.log(response);
                  return undefined;
                } catch (error) {
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
            key="deliver_product"
            name="deliver_product"
            children={(field) => (
              <InputField
                type="text"
                isRequired={true}
                field={field}
                span={2}
              />
            )}
          />
        </div>
      </form>
    </>
  );
}
