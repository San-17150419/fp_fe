import { MakerCode, Site, MoldStatus } from "./CommonTypes";

export type FilterData = {
  post: {
    sys: string;
    sn_num: string;
    prod_name_board: string;
    mold_num: string;
    property: string;
    site: Site;
  };
  data: {
    sn_num: string;
    site: Site;
    state: MoldStatus;
    sys: string;
    property: string;
    brand: number;
    prod_name_board: string;
    pnb_state: "incomplete" | "done";
    prod_name_nocolor: string;
    mold_num: string;
    hole_num: number;
    block_num: number;
    property_num: string;
    maker: MakerCode;
    dutydate_month: string;
    spare: string;
    id_ms: number;
    dutydate_last: string;
  }[];
};

export type FilterDataParams = {
  site: Site | "";
  sys: string | "";
  sn_num: string | "";
  property: string | "";
  prod_name_board: string | "";
  mold_num: string | "";
};
