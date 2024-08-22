export type ENGDepartmentPreData = {
  preData: {
    factory: { [key: string]: string };
    maker: { list_id: string; name_big5: string }[];
    series: { [key: string]: string };
    // site: string[];
    site: Site[];
    status: Status[];
  };
};

export type ENGDepartmentPostData = {
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

export type ENGDepartmentPreDataParams = {
  site: Site | "";
  sys: string | "";
  sn_num: string | "";
  property: string | "";
  prod_name_board: string | "";
  mold_num: string | "";
};

export type ENGDepartmentPostDataParams = {
  sn_num: string;
  site: Site;
  dutydate_last: string;
};

export type Maker = ENGDepartmentPreData["preData"]["maker"][number];

export type Site = "GD" | "HP" | "DL" | "D08" | "停用";

export type ENGDepartmentFilterData = {
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
    state: Status;
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
    maker: string;
    dutydate_month: string;
    spare: string;
    id_ms: number;
    dutydate_last: string;
  }[];
};

type Status =
  | "開發中"
  | "製模中"
  | "待生產"
  | "待驗收"
  | "生產中"
  | "待維修"
  | "維修中"
  | "待轉回"
  | "移轉中"
  | "待報廢"
  | "已報廢";
