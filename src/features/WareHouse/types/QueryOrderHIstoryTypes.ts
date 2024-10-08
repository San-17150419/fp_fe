export type QueryOrderHistoryType = "inv" | "iqc";

export type QueryOrderHistoryParams<T extends QueryOrderHistoryType> =
  T extends "inv"
    ? {
        date_start: string;
        date_end: string;
        doc_class: string;
        doc_num: string;
        order_num: string;
        order_product: string;
        status_IQC: string;
        report_IQC: string;
      }
    : {
        date_start: string; //# 收貨日(起)
        date_end: string; //# 收貨日(迄)
        doc_num: string; //# 文件編號
        order_num: string; //# 訂單編號
        deliver_product: string; //# 交付產品
      };
export type QueryOrderHIstoryResponseData<T extends QueryOrderHistoryType> =
  T extends "inv"
    ? {
        data: Array<{
          date_accepted: string;
          doc_num: string;
          supplier_code: string;
          order_num: string;
          doc_class: string;
          order_product: string;
          deliver_product: string;
          amt_delivered: number;
          date_confirm: string | null;
          amt_received: number | null;
          amt_returned: number | null;
          status_IQC: string | null;
          report_IQC: string;
        }>;
      }
    : {
        data: Array<{
          id_rr: number; //# 驗收單id
          doc_num: string; //# 文件編號
          doc_class: string; //# 文件類型
          status_IQC: string; //# 檢驗狀態
          supplier_code: string; //# 供應商
          date_accepted: string; //# 收貨日
          deliver_product: string; //# 交付產品
          deliver_prodNum: string; //# 交付產品編號
          id_order: number; //# 訂單id
          order_num: string; //# 訂單編號
          order_product: string; //# 訂單產品
          order_prodType: string; //# 訂單產品規格
          order_prodModel: string; //# 訂單產品Model
          order_prodNum: string; //# 訂單產品編號
          amt_unit: string; //# 計價單位
          amt_order: number; //# 訂單數量
          amt_delivered: number; //# 交貨數量
          net_weight: number; //# 淨重(G/PCS)
          amt_delivered_sub: number; //# 交貨數量(輔助)
          amt_unit_sub: string; //# 計價單位(輔助)
        }>;
      } & {
        post: QueryOrderHistoryParams<T>;
      };

export type InvOrderHistoryData =
  QueryOrderHIstoryResponseData<"inv">["data"][number];
export type IqcOrderHistoryData =
  QueryOrderHIstoryResponseData<"iqc">["data"][number];
