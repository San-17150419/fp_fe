export type Data = {
  dutydate: string;
  shift: string;
  eqip_name: string;
  prod_name: string;
  mold_num: string;
  sn_num: string;
  single_weight: number;
  hole_num: number;
  block_num: number;
  mold_time: number;
  material_1: string;
  worker: string;
  work_time: string;
  mold_amt: number;
  prod_amt: number;
};

export interface ResponseTableData {
  demoData: Data[];
}

// No nested object
export type SimpleObject = {
  [key: string]: string | number | boolean;
};

export type TableData = SimpleObject[];
