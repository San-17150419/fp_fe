import {
  type Sys,
  type Property,
  type PnbState,
  type NameBoard,
  type NameNocolor,
  type MoldNum,
  type HoleNum,
  type BlockNum,
  type PropertyNum,
  type Maker,
  type DutydateMonth,
  type Spare,
  type SnNum,
  type Site,
  type MoldStatus,
} from "./CommonTypes";

export type MoldInfoInsertParams = {
  sn_num: SnNum;
  site: Site;
  state: MoldStatus;
  sys: Sys;
  property: Property;
  brand: string;
  prod_name_board: NameBoard;
  pnb_state: PnbState;
  prod_name_nocolor: NameNocolor;
  mold_num: MoldNum;
  hole_num: HoleNum;
  block_num: BlockNum;
  property_num: PropertyNum;
  maker: Maker["list_id"];
  dutydate_month: DutydateMonth;
  spare: Spare;
};

export type MoldInfoInsertResponse =
  | MoldInfoInsertSuccessResponse
  | MoldInfoInsertErrorResponse;

type InfoCheck = {
  status: boolean;
  detail: string;
};

export type MoldInfoInsertMissingKeyErrorResponse = {
  post: MoldInfoInsertParams;
  info_check: InfoCheck;
};
export type MoldInfoInsertSuccessResponse = {
  post: MoldInfoInsertParams;
  info_check: InfoCheck & {
    status: true;
  };
  info_insert: {
    lastInsertedId: number;
    error: null;
  };
};
export type MoldInfoInsertSQLErrorResponse = {
  post: MoldInfoInsertParams;
  info_check: {
    status: true;
    detail: string;
  };
  info_insert: {
    lastInsertedId: null;
    error: string;
  };
};

export type MoldInfoInsertErrorResponse =
  | MoldInfoInsertSQLErrorResponse
  | MoldInfoInsertMissingKeyErrorResponse;
