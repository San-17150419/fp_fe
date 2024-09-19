import { type Option } from "../../../Components/modd/Select/Select";
import {
  Maker,
  MoldStatus,
  Property,
  Site,
  type FilterData,
  type MoldInfoUpdateParams,
} from "../types";
export function getFilterConfig(
  currentMoldData: FilterData["data"][number],
  makerOptions: Option<Maker["list_id"]>[],
  propertyOptions: Option<Property>[],
  siteOptions: Option<Site>[],
  statusOptions: Option<MoldStatus>[],
) {
  const isStateInPredefinedOptions = statusOptions.some(
    (option) => option.value === currentMoldData.state,
  );
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

  return { selectConfig, inputConfig };
}

type SelectConfig = {
  name: Name;
  text: string;
  options: Array<Option<MoldInfoUpdateParams[Name]>>;
  disabled?: boolean;
}[];

type InputConfig = {
  name: Name;
  text: string;
  readOnly?: boolean;
}[];

type Name = keyof MoldInfoUpdateParams;
