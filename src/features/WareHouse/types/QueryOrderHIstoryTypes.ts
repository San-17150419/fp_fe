export type QueryOrderHistoryParams = {
  date_start: string;
  date_end: string;
  doc_class: string;
  doc_num: string;
  order_num: string;
  order_product: string;
  status_IQC: string;
  report_IQC: string;
};

export type QueryOrderHIstoryResponseData = {
  post: QueryOrderHistoryParams;
  data: Array<{
    doc_num: string;
    supplier_code: string;
    order_num: string;
    doc_class: string;
    order_product: string;
    deliver_product: string;
    amt_delivered: number;
    date_confirm: string;
    amt_received: number;
    status_IQC: number;
    report_IQC: string;
  }>;
};

export type OrderHistoryData = QueryOrderHIstoryResponseData["data"][number];
