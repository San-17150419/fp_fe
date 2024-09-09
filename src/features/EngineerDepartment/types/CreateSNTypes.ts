import { type Sys, type MoldNum } from "./CommonTypes";
export type GetNewSNParams = {};

export type BaseRequest = {
  sys: Sys;
};

type SeriesRequest = BaseRequest & {
  sys: Exclude<Sys, "模仁">;
  mold_num: MoldNum;
  sn_target?: "";
};

type MurenRequest = BaseRequest & {
  sys: "模仁";
  mold_num?: "";
  sn_target: string;
};

export type GetNewSNPForSys<T> = T extends "模仁"
  ? MurenRequest
  : SeriesRequest;

type BaseResponse<T> = {
  post: GetNewSNPForSys<T>;
  sn_num: string;
};

type SeriesResponse<T> = T extends "雙色系列"
  ? BaseResponse<T> & { post: { sys: "雙色系列" }; sn_num_sub: string }
  : BaseResponse<T>;
// type SeriesResponse<T> = BaseResponse<T> & {
//   post: { sys: "雙色系列" };
//   sn_num_sub: string;
// };

// Combine response types into a union
export type GetNewSNPForSysResponse<T> = SeriesResponse<T>;
