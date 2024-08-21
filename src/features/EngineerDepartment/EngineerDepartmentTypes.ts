export type ENGDepartmentPreData = {
  preData: {
    factory: { [key: string]: string };
    maker: { list_id: string; name_big5: string }[];
    series: { [key: string]: string };
    site: string[];
    // site: Site[];
    status: Status[];
  };
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
