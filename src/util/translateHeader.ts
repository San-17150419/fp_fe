type EnglishToChinese = {
  [key: string]: string;
};

const test: EnglishToChinese = {
  dutydate: "工作日",
  shift: "班別",
  eqip_name: "機台",
  prod_name: "產品",
  mold_num: "模號",
  sn_num: "模具唯一碼",
  single_weight: "單重",
  hole_num: "模穴數",
  block_num: "塞穴數",
  mold_time: "週程",
  material_1: "原料01",
  material_2: "原料02",
  worker: "作業員",
  work_time: "實際作業",
  mold_amt: "開合數",
  // prod_amt: "產能",
};

export default function translateHeader(
  headers: EnglishToChinese = test,
): string[] {
  return Object.values(headers);
}

// dutydate,       # 工作日
// shift,          # 班別
// eqip_name,      # 機台
// prod_name,      # 產品
// mold_num,       # 模號
// sn_num,         # 模具唯一碼
// single_weight,  # 單重
// hole_num,       # 模穴數
// block_num,      # 塞穴數
// mold_time,      # 週程
// material_1,     # 原料01
// material_2      # 原料02
// worker,         # 作業員
// work_time,      # 實際作業
// mold_amt,       # 開合數
// prod_amt        # 產能
