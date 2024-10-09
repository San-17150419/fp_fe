export type InsertMaterialReceiptParams = {
  id_dorder: number;
  doc_num: string;
  dorder_num: string;
  date_back: string;
  supplier_code: string;
  deliver_product: string;
  deliver_prodNum: string;
  do_product: string;
  do_prodModel: string;
  do_prodNum: string;
  process: string;
  amt_unit: string;
  amt_order: number;
  amt_def: number;
  unit_def: string;
  net_weight: string;
  amt_inv: string;
  unit_inv: string;
};

export type InsertMaterialReceiptResponse = {
  post: InsertMaterialReceiptParams;
  info_insert: {
    status: "Succeed" | "Failed";
    lastInsertedId: number;
    error: string;
    status_http: number;
    lastInsertedId_rr: number;
  };
  info_check: {
    status: string;
    message: string;
  };
};
