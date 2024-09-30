export type CheckOrderNumParams = {
  order_num: string;
};

export type CheckOrderNumResponseData = {
  post: CheckOrderNumParams;
  order: Array<{
    id_order: number;
    order_num: string;
    supplier_code: string;
    order_proModel: string;
    order_prodNum: string;
    order_product: string;
    amt_order: number;
    history: {
      total_delivered: number;
      total_received: number;
      total_returned: number;
    };
    product_option: Array<{
      item_name: string;
      item_code: string;
    }>;
  }>;
  info_check: {
    status: "PASS";
    message: "";
  };
};

export type OrderInfo = CheckOrderNumResponseData["order"][number];
