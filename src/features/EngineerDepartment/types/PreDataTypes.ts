import { type Site, type MoldStatus } from "./CommonTypes";

export type PreData = {
  preData: {
    factory: { [key: string]: string };
    maker: { list_id: string; name_big5: string }[];
    series: {
      "01": "P系列";
      "02": "PA系列";
      "03": "PC系列";
      "04": "CE系列";
      "05": "特殊系列";
      "11": "雙色系列";
      "33": "臨時模具";
      rep: "模仁";
    };
    site: Site[];
    status: MoldStatus[];
  };
};


