export type InsertReceiptParams = {
  doc_num: string;
  supplier_code: string;
  date_accepted: string;
  deliver_product: string;
  deliver_prodNum: string;
  id_order: string;
  order_num: string;
  order_product: string;
  order_prodType: string;
  order_prodModel: string;
  order_prodNum: string;
  amt_unit: string;
  amt_order: string;
  amt_delivered: string;
  amt_delivered_sub: string;
  amt_unit_sub: string;
  net_weight: string;
};

export type InsertReceiptResponseData = {
  post: InsertReceiptParams;
  info_check: {
    status: "PASS";
    message: string;
  };
  info_insert: {
    lastInsertedId: number;
    error: null;
  };
};
