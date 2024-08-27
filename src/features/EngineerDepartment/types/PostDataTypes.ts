import { Site } from "./CommonTypes";

export type PostData = {
  post: {
    dutydate_last: string;
    site: Site;
    sn_num: string;
  };
  data: {
    block_num: number;
    hole_num: number;
    mold_amt: number;
    mold_time: number;
    prod_amt: number;
    dutydate: string;
    shift: string;
    eqip_name: string;
    prod_name: string;
    mold_num: string;
    work_time: number;
    sn_num: string;
  }[];
};

export type PostDataParams = {
  sn_num: string;
  site: Site;
  dutydate_last: string;
};
