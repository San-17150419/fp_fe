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
