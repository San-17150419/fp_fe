type ReceivePost = {
  pattern: "receive";
  doc_num: string;
};

type ReturnPost = {
  pattern: "return";
  doc_num: string;
};

type ReceiptData = {
  doc_status: string;
  doc_num: string;
  doc_class: string;
  status_IQC: string;
  report_IQC: string;
  supplier_code: string;
  date_accepted: string;
  date_confirm: string;
  deliver_product: string;
  deliver_prodNum: string;
  id_order: number;
  order_num: string;
  order_product: string;
  order_prodType: string;
  order_prodModel: string;
  order_prodNum: string;
  amt_unit: string;
  amt_order: number;
  amt_delivered: number;
  amt_returned: number;
  amt_received: number;
  unitPrice: number | null;
  payment: number | null;
  id_inv: number;
  id_epb: number | null;
  net_weight: number;
  amt_delivered_sub: number;
  amt_unit_sub: string;
  stamp: string;
  id_rr: number;
};

type HistoryData = {
  id_order: number;
  order_num: string;
  order_product: string;
  order_prodNum: string;
  amt_order: number;
  amt_unit: string;
  total_delivered: number;
  total_received: number;
  total_returned: number;
};

type ReturnData = {
  doc_exist: boolean;
  receipt: ReceiptData;
  order: null | {
    id_order: number;
    order_num: string;
    supplier_code: string;
    order_prodModel: string;
    order_prodNum: string;
    order_product: string;
    amt_order: number;
    amt_unit: string;
  };
  history: HistoryData;
};

type InfoCheck = {
  status: string;
  message: string;
};

// Common structure for both `receive` and `return` patterns
type CheckDocNumResponseBase = {
  info_check: InfoCheck;
};

type ReceiveDocNumResponse = CheckDocNumResponseBase & {
  post: ReceivePost;
  data: {
    doc_exist: boolean;
    result: "available" | "unavailable";
  };
};

type ReturnDocNumResponse = CheckDocNumResponseBase & {
  post: ReturnPost;
  data: ReturnData;
};

export type CheckDocNumResponse<T extends Pattern> = T extends "receive"
  ? ReceiveDocNumResponse
  : ReturnDocNumResponse;

export type CheckReturnDocNumParams = {
  doc_returned: string;
};

export type CheckDocNumResponseData = {
  post: CheckReturnDocNumParams;
  result: "available" | "unavailable";
  info_check: InfoCheck;
};

export type Pattern = "receive" | "return";
