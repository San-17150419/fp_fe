import {
  type IdMs,
  type SnNum,
  type Site,
  type Sys,
  type Property,
  type PnbState,
  type NameBoard,
  type NameNocolor,
  type MoldNum,
  type HoleNum,
  type BlockNum,
  type PropertyNum,
  type MakerCode,
  type DutydateMonth,
  type Spare,
  type Brand,
  type MoldStatus
} from "./CommonTypes";

export type MoldInfoUpdateParams = {
  id_ms: IdMs; // Not sure if it is string or number. From filterData, it should be a number. This is also the only required field.
  sn_num: SnNum | null;
  site: Site | null;
  state: MoldStatus | null;
  sys: Sys | null;
  property: Property | null;
  brand: Brand | null;
  prod_name_board: NameBoard | null;
  pnb_state: PnbState | null;
  prod_name_nocolor: NameNocolor | null;
  mold_num: MoldNum | null;
  hole_num: HoleNum | null;
  block_num: BlockNum | null;
  property_num: PropertyNum | null;
  maker: MakerCode | null; //
  dutydate_month: DutydateMonth | null;
  spare: Spare | null;
};

//This should cover both case 2 and case 3. The only difference is in case 3, no row is affected. So affected_rows should be 0. I will separate them if needed.

export type MoldInfoUpdateResponse =
  | MoldInfoUpdateSuccessResponse
  | MoldInfoUpdateErrorResponse;

export type MoldInfoUpdateSuccessResponse = {
  post: MoldInfoUpdateParams;
  info_check: {
    status: true;
    detail: string;
  };
  info_update: {
    affected_rows: number;
    error: null;
    detail: string;
  };
};

export type MoldInfoUpdateErrorResponse =
  | MoldInfoUpdateDataBaseErrorResponse
  | MoldInfoUpdateMissingKeyErrorResponse;

export type MoldInfoUpdateMissingKeyErrorResponse = {
  post: MoldInfoUpdateParams;
  info_check: {
    status: false;
    detail: string;
  };
};

export type MoldInfoUpdateDataBaseErrorResponse = {
  post: MoldInfoUpdateParams;
  info_check: {
    status: true;
    detail: string;
  };
  info_update: {
    affected_rows: null;
    error: string;
    detail: null;
  };
};
