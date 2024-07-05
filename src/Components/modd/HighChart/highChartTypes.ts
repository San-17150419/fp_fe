export type DataWithDefaultKey = { unix_stamp?: number } & Record<string, any>;
export type DataWithUnixStamp = DataWithDefaultKey & { unix_stamp: number };
export type ItemPreData = {
  currency: string;
  id_item: number;
  item: string;
  item_tag: string;
  unit: string;
};

export type Type3RawData = {
  sys: string;
  dutydate: string;
  unix_stamp: number;
  work_time: number;
  avg_pamt: number;
  avg_capa: number;
  ar: number;
};

export type Type3ChartData = {
  name: string;
  data: [number, number][];
  type: string;
  color?: string;
};

export type Type2RawData = {
  currency: string;
  date: string;
  id: number;
  id_item: number;
  item: string;
  price: number;
  unit: string;
  unix_stamp: number;
};
