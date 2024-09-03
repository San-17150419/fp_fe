import { type PreData } from "../types";
// import { type SelectOption } from "../../../Components/modd/Select/selectType";
import { v4 as uuidv4 } from "uuid";

type Option = {
  text: string;
  value: string;
  id: string;
};

// Generates dropdown options for a select component used in the Engineer Department's filter.
// Each category (maker, series, site, factory) gets a list of options derived from preData, with an additional placeholder option for each.
// Placeholder options have empty string values and are displayed as text labels.
export const createEngineerFilterOptions = (
  preData: PreData["preData"],
): {
  makerOptions: Option[];
  seriesOptions: Option[];
  siteOptions: Option[];
  propertyOptions: Option[];
  statusOptions: Option[];
} => {
  const makerOptions = [
    {
      value: "",
      text: "製造商代號",
      id: uuidv4(),
    },
    ...preData.maker.map(({ list_id, name_big5 }) => ({
      value: list_id,
      text: `${list_id}-${name_big5}`,
      id: uuidv4(),
    })),
  ];
  const seriesOptions = [
    {
      value: "",
      text: "全部系列",
      id: uuidv4(),
    },
    ...Object.entries(preData.series).map(([key, value]) => ({
      value: key,
      text: value,
      id: uuidv4(),
    })),
  ];
  const propertyOptions = [
    {
      value: "",
      text: "財產歸屬",
      id: uuidv4(),
    },
    ...Object.entries(preData.factory).map(([key, value]) => ({
      value: key,
      text: value,
      id: uuidv4(),
    })),
  ];
  const siteOptions = [
    { value: "", text: "位置", id: uuidv4() },
    ...preData.site.map((site) => ({
      value: site,
      text: site,
      id: uuidv4(),
    })),
  ];

  const statusOptions = [
    { value: "", text: "無", id: uuidv4() },
    ...preData.status.map((status) => ({
      value: status,
      text: status,
      id: uuidv4(),
    })),
  ];

  return {
    makerOptions,
    seriesOptions,
    siteOptions,
    propertyOptions,
    statusOptions,
  };
};
