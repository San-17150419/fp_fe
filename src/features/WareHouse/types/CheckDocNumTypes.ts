type ReceivePost = {
  type: "receive";
  doc_num: string;
};

type ReturnPost = {
  type: "return";
  doc_num: string;
};


type ReturnData = {
  receipt: {
    id: number;
    doc_status: string;
    doc_num: string;
    doc_class: string;
    status_IQC: string;
    report_IQC: string;
    supplier_code: string;
    date_accepted: string;
    date_confirm: string | null;
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
    amt_returned: number | null;
    amt_received: number | null;
    unitPrice: number | null;
    id_inv: number | null;
    id_epb: number | null;
    net_weight: number;
    amt_delivered_sub: number;
    amt_unit_sub: string;
    stamp: string | null;
  };
  order: {
    id_order: number;
    order_num: string;
    supplier_code: string;
    order_prodModel: string;
    order_prodNum: string;
    order_product: string;
    order_prodType: string;
    amt_unit: string;
    amt_order: number;
  };
  history: {
    id_order: number;
    order_num: string;
    order_product: string;
    order_prodNum: string;
    amt_order: number;
    amt_unit: string;
    total_delivered: number;
    // This can be null
    total_received: number | null;
    // This can be null
    total_returned: number | null;
  };
  info_check: {
    status: string;
    message: "";
  };
};

type Pattern = "receive" | "return";

export type CheckDocNumParams = {
  docNum: string;
  pattern: Pattern;
};

export type CheckDocNumResponse<T extends Pattern> = {
  post: T extends "receive" ? ReceivePost : ReturnPost;
  data: T extends "receive"
    ? { doc_exist: boolean; result: "available" | "unavailable" }
    : {
        post: {
          pattern: "return";
          doc_num: string;
        };
        data: ReturnData;
      };
  result: T extends "receive" ? "available" | "unavailable" : never;
  info_check: {
    status: string;
    message: "";
  };
};
