import { useState } from "react";
import { FormEvent } from "react";
import { type MoldInfoUpdateParams, type FilterData } from "../types";
import axios from "axios";
import { Option } from "../../../Components/modd/Select/Select";

const api = import.meta.env.VITE_ENGINEER_DEPARTMENT_URL + "mold-info-update/";

type Params = {
  data: FilterData["data"][number];
  makerOptions: Array<Option>;
  propertyOptions: Array<Option>;
  siteOptions: Array<Option>;
  statusOptions: Array<Option>;
};
export default function useUpdate({
  data,
  makerOptions,
  propertyOptions,
  siteOptions,
  statusOptions,
}: Params) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<MoldInfoUpdateParams>(
    (() => {
      // delete dutydate_last in data because it is not present in MoldInfoUpdateParams. Needs to temporarily extend MoldInfoUpdateParams to include dutydate_last and make this property optional. Otherwise, typescript will not allow it to be deleted
      const copy: MoldInfoUpdateParams & { dutydate_last?: string } =
        Object.assign({}, data);
      delete copy["dutydate_last"];
      return copy as MoldInfoUpdateParams;
    })(),
  );
  const isStateInPredefinedOptions = statusOptions.some(
    (option) => option.value === data.state,
  );
  const handleUpdateMoldInfo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const target = e.target as typeof e.target & {
    //   prod_name_board: { value: string };
    //   prod_name_nocolor: { value: string };
    //   sys: { value: string };
    //   sn_num: { value: string };
    //   mold_num: { value: string };
    //   hole_num: { value: string };
    //   "site[value]": { value: string };
    //   "property[value]": { value: string };
    //   "state[value]": { value: string };
    //   "maker[value]": { value: string };
    //   dutydate_month: { value: string };
    // };
    // TODO: Do I need to inlcude all fields with latest values and updated values? Or only fields with updated values? Fields that remain unchanged should be omitted or with null values?
    // const params: MoldInfoUpdateParams = {
    //   // id_ms is required
    //   id_ms: data.id_ms,
    //   prod_name_board: target.prod_name_board.value, //名版 *
    //   prod_name_nocolor: target.prod_name_nocolor.value, //定義品名 aka 機種 *
    //   sys: target.sys.value, //模具系列 *
    //   sn_num: target.sn_num.value, //唯一碼 *
    //   mold_num: target.mold_num.value, //模號 *
    //   hole_num: Number(target.hole_num.value), //模穴數 *
    //   site: target["site[value]"].value as Site, //位置 *
    //   property: target["property[value]"].value, //財產歸屬 *
    //   state: target["state[value]"].value as MoldInfoUpdateParams["state"], //模具狀態 如開發中 *
    //   maker: target["maker[value]"].value, //製造商（代號）*
    //   dutydate_month: target.dutydate_month.value, //開模日期 input date *
    //   brand: 1, //品牌 number 1 2 原始版中沒有
    //   spare: "", //備註 原始版中沒有
    //   pnb_state: "incomplete", //名版狀態 incomplete done 原始版中沒有
    //   property_num: "", //財產編號 原始版中沒有
    //   block_num: 0, //塞穴數 原始版中沒有
    // };
    // console.log(
    //   (() => {
    //     let isEqual = true;
    //     for (const key in params) {
    //       if (
    //         params[key as keyof MoldInfoUpdateParams] !==
    //         formData[key as keyof MoldInfoUpdateParams]
    //       ) {
    //         isEqual = false;
    //         break;
    //       }
    //     }
    //     return isEqual;
    //   })(),
    // );
    try {
      const response = await axios.post(api, formData);
      window.location.reload();
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }

    // setIsModalOpen(false);
  };
  function handleChange(name: keyof MoldInfoUpdateParams, data: string) {
    setFormData((prev) => ({ ...prev, [name]: data }));
  }

  const selectConfig: SelectConfig = [
    { text: "位置", options: siteOptions, name: "site" },
    { text: "財產歸屬", options: propertyOptions, name: "property" },
    {
      text: "狀態",
      options: statusOptions,
      name: "state",
      disabled: !isStateInPredefinedOptions,
    },
    { text: "製造商代號", options: makerOptions, name: "maker" },
  ];
  const inputConfig: InputConfig = [
    { text: "名版", name: "prod_name_board", readOnly: false },
    { text: "機種", name: "prod_name_nocolor", readOnly: false },
    { text: "系列", name: "sys", readOnly: true },
    { text: "唯一碼", name: "sn_num", readOnly: true },
    { text: "模號", name: "mold_num", readOnly: true },
    { text: "模穴數", name: "hole_num", readOnly: true },
  ];

  return {
    handleUpdateMoldInfo,
    handleChange,
    isModalOpen,
    setIsModalOpen,
    selectConfig,
    inputConfig,
    setFormData,
  };
}

type SelectConfig = {
  name: Name;
  text: string;
  options: Array<Option>;
  disabled?: boolean;
}[];

type InputConfig = {
  name: Name;
  text: string;
  readOnly?: boolean;
}[];

type Name = keyof MoldInfoUpdateParams;
