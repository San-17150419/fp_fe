import { type PreData, type PostData, type FilterData } from "./";

export type Maker = PreData["preData"]["maker"][number];

export type MakerCode = Maker["list_id"];

export type MakerName = Maker["name_big5"];

export type Site = "GD" | "HP" | "DL" | "D08" | "停用";

const moldStatus = [
  "開發中",
  "製模中",
  "待生產",
  "待驗收",
  "生產中",
  "待維修",
  "維修中",
  "待轉回",
  "移轉中",
  "待報廢",
  "已報廢",
] as const;

// https://stackoverflow.com/questions/75317224/how-to-validate-a-string-literal-type-using-zod
// https://github.com/colinhacks/zod#zod-enums TODO: Do research. Maybe this can replace literal type and the value can be checked in runtime

export type MoldStatus = (typeof moldStatus)[number];

export type BlockNum = PostData["data"][number]["block_num"];

export type HoleNum = PostData["data"][number]["hole_num"];

export type MoldTime = PostData["data"][number]["mold_time"];

export type WorkTime = PostData["data"][number]["work_time"];

export type ProdAmt = PostData["data"][number]["prod_amt"];

export type MoldAmt = PostData["data"][number]["mold_amt"];

export type Dutydate = PostData["data"][number]["dutydate"];

export type Shift = PostData["data"][number]["shift"];

export type EqipName = PostData["data"][number]["eqip_name"];

export type ProdName = PostData["data"][number]["prod_name"];

export type MoldNum = PostData["data"][number]["mold_num"];

export type SnNum = PostData["data"][number]["sn_num"];

export type Property = FilterData["data"][number]["property"];

export type PnbState = FilterData["data"][number]["pnb_state"];

export type NameBoard = FilterData["data"][number]["prod_name_board"];

export type NameNocolor = FilterData["data"][number]["prod_name_nocolor"];

export type Sys =
  PreData["preData"]["series"][keyof PreData["preData"]["series"]];

export type PropertyNum = FilterData["data"][number]["property_num"];

export type DutydateMonth = FilterData["data"][number]["dutydate_month"];

export type IdMs = FilterData["data"][number]["id_ms"];

export type Spare = FilterData["data"][number]["spare"];

export type Brand = FilterData["data"][number]["brand"];
