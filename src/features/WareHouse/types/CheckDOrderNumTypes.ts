export type CheckDOrderNumParams = {
  dorder_num: string;
};

export type CheckDOrderNumResponse = {
  post: CheckDOrderNumParams;
  order: {
    id_dorder: number;
    date: string;
    dorder_num: string;
    supplier_code: string;
    process: string;
    do_prodModel: string;
    do_product: string;
    amt_order: number;
    amt_unit: string;
    do_prodNum: string;
    item_size: string;
    product_no: string;
    history: {
      id_dorder: number;
      total_sent: number | null;
      total_back: number | null;
    } | null;
    product_option: {
      item_name: string;
      item_code: string;
    }[];
  }[];
  info_check: {
    status: string;
    message: string;
  };
};
