import { type PreData } from "../types";
import { type SelectOption } from "../../../Components/modd/Select/selectType";

export const generateOptions = (
  preData: PreData["preData"],
): {
  makerOptions: SelectOption[];
  seriesOptions: SelectOption[];
  siteOptions: SelectOption[];
  factoryOptions: SelectOption[];
} => {
  const makerOptions = preData.maker.map((value) => {
    return {
      value: value.list_id,
      text: `${value.list_id}-${value.name_big5}`,
    };
  });
  const seriesOptions = Object.keys(preData.series).map((key) => ({
    value: key,
    text: preData.series[key as keyof typeof preData.series],
  }));

  const factoryOptions = Object.keys(preData.factory).map((key) => ({
    value: key,
    text: preData.factory[key as keyof typeof preData.factory],
  }));
  const siteOptions = preData.site.map((key) => ({
    value: key,
    text: key,
  }));
  return { makerOptions, seriesOptions, siteOptions, factoryOptions };
};

