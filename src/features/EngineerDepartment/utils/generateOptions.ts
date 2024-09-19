import {
  type PreData,
  type Maker,
  Sys,
  Site,
  MoldStatus,
  PropertyNum,
} from "../types";
// import { type SelectOption } from "../../../Components/modd/Select/selectType";
import { v4 as uuidv4 } from "uuid";
import { type Option } from "../../../Components/modd/Select/Select";

// Generates dropdown options for a select component used in the Engineer Department's filter.
// Each category (maker, series, site, factory) gets a list of options derived from preData, with an additional placeholder option for each.
// Placeholder options have empty string values and are displayed as text labels.
export const createEngineerFilterOptions = (
  preData: PreData["preData"],
): {
  makerOptions: Option<Maker["list_id"]>[];
  seriesOptions: Option<Sys>[];
  siteOptions: Option<Site>[];
  propertyOptions: Option<PropertyNum>[];
  statusOptions: Option<MoldStatus>[];
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
    ...Object.entries(preData.series).map(([_, value]) => ({
      value: value,
      text: value,
      id: uuidv4(),
    })),
  ] as Option<Sys>[];
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
  ] as Option<Site>[];

  const statusOptions = [
    { value: "", text: "無", id: uuidv4() },
    ...preData.status.map((status) => ({
      value: status,
      text: status,
      id: uuidv4(),
    })),
  ] as Option<MoldStatus>[];

  return {
    makerOptions,
    seriesOptions,
    siteOptions,
    propertyOptions,
    statusOptions,
  };
};
