import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./i18n";
import {
  ErrorPage,
  ButtonPage,

  FactoryLogPage,

  Loading,

} from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    loader: () => <Loading />,
    children: [
      {
        index: true,
        element: <FactoryLogPage />,
        // lazy: async () => {
        //   let { default: FactoryLogPage } = await import("./pages/FactoryLog");
        //   return {
        //     Component: FactoryLogPage,
        //   };
        // },
      },
      {
        path: "button",
        lazy: async () => {
          let { default: ButtonPage } = await import("./pages/ButtonPage");
          return {
            Component: ButtonPage,
          };
        },
      },
      {
        path: "data-table",
        // element: <DataTablePage />,
        lazy: async () => {
          let { default: DataTablePage } = await import(
            "./pages/DataTablePage"
          );
          return {
            Component: DataTablePage,
          };
        },
      },
      {
        path: "select",
        // element: <SelectPage />,
        lazy: async () => {
          let { default: SelectPage } = await import("./pages/SelectPage");
          return {
            Component: SelectPage,
          };
        },
      },
      {
        path: "tab",
        // element: <TabPage />,
        lazy: async () => {
          let { default: TabPage } = await import("./pages/TabPage");
          return {
            Component: TabPage,
          };
        },
      },
      {
        path: "test",
        // element: <TestPage />,
        lazy: async () => {
          let { default: TestPage } = await import("./pages/Test");
          return {
            Component: TestPage,
          };
        },
      },
      {
        path: "highcharts",
        // element: <HighChartsPage />,
        lazy: async () => {
          let { default: HighChartsPage } = await import(
            "./pages/HighChartsPage"
          );
          return {
            Component: HighChartsPage,
          };
        },
      },
      {
        path: "highstock-type1",
        // element: <HighStockType1Page />,
        lazy: async () => {
          let { default: HighStockType1Page } = await import(
            "./pages/HighStockType1Page"
          );
          return {
            Component: HighStockType1Page,
          };
        },
      },
      {
        path: "highstock-type2",
        // element: <HighStockType2Page />,
        lazy: async () => {
          let { default: HighStockType2Page } = await import(
            "./pages/HighStockType2Page"
          );
          return {
            Component: HighStockType2Page,
          };
        },
      },
      {
        path: "highstock-type3",
        // element: <HighStockType3Page />,
        lazy: async () => {
          let { default: HighStockType3Page } = await import(
            "./pages/HighStockType3Page"
          );
          return {
            Component: HighStockType3Page,
          };
        },
      },
      {
        path: "input",
        // element: <InputPage />,
        lazy: async () => {
          let { default: InputPage } = await import("./pages/InputPage");
          return {
            Component: InputPage,
          };
        },
      },
      {
        path: "layout-test",
        // element: <LayoutTestPage />,
        lazy: async () => {
          let { default: LayoutTestPage } = await import(
            "./pages/LayoutTestPage"
          );
          return {
            Component: LayoutTestPage,
          };
        },
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
