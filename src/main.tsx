import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthProvider from "./stores/AuthContext";
import "./i18n";
import { ErrorPage, FactoryLogPage, Loading } from "./pages";
import { ThemeProvider } from "./stores/ThemeContext";

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
        path: "/table-dialog",
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
        path: "/select",
        lazy: async () => {
          let { default: SelectPage } = await import("./pages/SelectPage");
          return {
            Component: SelectPage,
          };
        },
      },
      {
        path: "/tab",
        lazy: async () => {
          let { default: TabPage } = await import("./pages/TabPage");
          return {
            Component: TabPage,
          };
        },
      },
      {
        path: "/test",
        lazy: async () => {
          let { default: TestPage } = await import("./pages/Test");
          return {
            Component: TestPage,
          };
        },
      },
      {
        path: "/highcharts",
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
        path: "/highstock-type-1",
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
        path: "/highstock-type-2",
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
        path: "/highstock-type-3",
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
        path: "/input",
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
      {
        path: "/login",
        lazy: async () => {
          let { default: LoginPage } = await import("./pages/LoginPage");
          return {
            Component: LoginPage,
          };
        },
      },
      {
        path: "/protected",
        lazy: async () => {
          let { default: ProtectedPage } = await import(
            "./pages/ProtectedPage"
          );
          return {
            Component: ProtectedPage,
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
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router}></RouterProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();