export type InsertMeterialReturnReceiptParams = {
  id_dorder: number; //# 串接料品交運單
  dorder_num: string; //# 料品交運單號
  date_send: string; //# 實際送交日期
  supplier_code: string; //# 供應商
  do_product: string; //# 交運單產品
  do_prodModel: string; //# 交運單產品Model No
  do_prodNum: string; //# 交運單產品編號
  process: string; //# 工序
  amt_def: number; //# 實際送交數量
  unit_def: string; //# 計數單位，固定為KG
  amt_inv: number; //# 實際送交數量(輔助)
  unit_inv: string; //# 計數單位(輔助)
};

export type InsertMeterialReturnReceiptResponse = {
  post: InsertMeterialReturnReceiptParams;
  info_insert: {
    status: "Succeed" | "Failed";
    lastInsertedId: number;
    error: string;
    status_http: number;
  };
  info_check: {
    status: string;
    message: string;
  };
};
