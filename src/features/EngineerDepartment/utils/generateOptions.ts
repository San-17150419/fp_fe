import { Site, type PreData } from "../types";
// import { type SelectOption } from "../../../Components/modd/Select/selectType";
import { v4 as uuidv4 } from "uuid";

type Option = {
  text: string;
  value: string;
  id: string;
};
export const generateFilterOptionsForENGD = (
  preData: PreData["preData"],
): {
  makerOptions: Option[];
  seriesOptions: Option[];
  siteOptions: Option[];
  factoryOptions: Option[];
} => {
  const makerOptions = preData.maker.map((value) => {
    return {
      value: value.list_id,
      text: `${value.list_id}-${value.name_big5}`,
      id: uuidv4(),
    };
  });
  makerOptions.unshift({ value: "", text: "製造商代號", id: uuidv4() });

  const seriesOptions = Object.keys(preData.series).map((key) => ({
    value: key,
    text: preData.series[key as keyof typeof preData.series],
    id: uuidv4(),
  }));

  seriesOptions.unshift({ value: "", text: "全部系列", id: uuidv4() });
  const factoryOptions = Object.keys(preData.factory).map((key) => ({
    value: key,
    text: preData.factory[key as keyof typeof preData.factory],
    id: uuidv4(),
  }));

  factoryOptions.unshift({ value: "", text: "財產歸屬", id: uuidv4() });
  const siteOptions = preData.site.map((key) => ({
    value: key,
    text: key,
    id: uuidv4(),
  }));

  siteOptions.unshift({
    value: "" as Site,
    text: "位置" as Site,
    id: uuidv4(),
  });

  return { makerOptions, seriesOptions, siteOptions, factoryOptions };
};

