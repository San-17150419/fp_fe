import { type Site, type MoldStatus } from "./CommonTypes";

export type PreData = {
  preData: {
    factory: { [key: string]: string };
    maker: { list_id: string; name_big5: string }[];
    series: { [key: string]: string };
    site: Site[];
    status: MoldStatus[];
  };
};
