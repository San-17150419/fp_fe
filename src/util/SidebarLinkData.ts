import { ReactElement } from "react";
import {
  DefaultPage,
  InputPage,
  SelectPage,
  DataTablePage,
  BFFPatternPage,
  DataTableWithDialogModalPage,
  HighStockType1Page,
  HighStockType3Page,
  ButtonPage,
  HighStockType2Page,
  HighChartsPage,
} from "../pages";

type LinkData = {
  index?: boolean; // made index optional
  text: string;
  path: string;
  element: () => ReactElement;
};

const options: LinkData[] = [
  { index: true, text: "Home", path: "/", element: DefaultPage },
  { text: "Input", path: "/input", element: InputPage },
  { text: "Select", path: "/select", element: SelectPage },
  {
    text: "Table Non-Dialog",
    path: "/table-non-dialog",
    element: DataTablePage,
  },
  {
    text: "Table Dialog",
    path: "/table-dialog",
    element: DataTableWithDialogModalPage,
  },
  { text: "BFF Pattern", path: "/bff", element: BFFPatternPage },
  {
    text: "Highstock Type 1",
    path: "/highchart-type-1",
    element: HighStockType1Page,
  },
  {
    text: "Highstock Type 2",
    path: "/highchart-type-2",
    element: HighStockType2Page,
  },
  {
    text: "Highstock Type 3",
    path: "/highchart-type-3",
    element: HighStockType3Page,
  },
  { text: "Button", path: "/button", element: ButtonPage },
  { text: "Highcharts", path: "/highcharts", element: HighChartsPage },
];

export default options;
