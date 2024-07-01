import { useEffect, useState, useContext, createContext } from "react";

type HighChartType3 = {
  type: "03";
};

type HighChartType2 = {
  type: "02";
  item_id: number;
};

type HighChartType1 = {
  type: "01";
  item_id: number;
};

// 

export const HighChartContext = createContext<any>({});
