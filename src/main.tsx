import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthProvider from "./stores/AuthContext";
import "./i18n";
import { ErrorPage, FactoryLogPage, Loading, ModelOverview } from "./pages";
import { ThemeProvider } from "./stores/ThemeContext";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { toast } from "react-toastify";
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Set custom error message through query meta
      const errorMessage = query.meta?.errorMmessage || error.message;
      toast.error(`something went wrong ${errorMessage}`, {
        position: "top-center",
        autoClose: 5000,
        closeButton: true,
      });
    },
  }),
});
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
      {
        path: "/EngineerDepartment",
        lazy: async () => {
          let { default: EngineerDepartment } = await import(
            "./pages/EngineerDepartment"
          );
          return {
            Component: EngineerDepartment,
          };
        },
        children: [
          {
            index: true,
            element: <ModelOverview />,
          },
        ],
      },
      {
        path: "/Warehouse",
        children: [
          {
            index: true,
            lazy: async () => {
              let { default: Warehouse } = await import("./pages/Warehouse");
              return {
                Component: Warehouse,
              };
            },
          },
          {
            path: "product-recieve-form",
            lazy: async () => {
              let { default: RecieveForm } = await import(
                "./features/WareHouse/pages/RecieveForm"
              );
              return {
                Component: RecieveForm,
              };
            },
          },
          {
            path: "product-return-form",
            lazy: async () => {
              let { default: ReturnForm } = await import(
                "./features/WareHouse/pages/ReturnForm"
              );
              return {
                Component: ReturnForm,
              };
            },
          },
          {
            path: "deliver-history-query",
            lazy: async () => {
              let { default: HistoryQuery } = await import(
                "./features/WareHouse/pages/HistoryQuery"
              );
              return {
                Component: () => <HistoryQuery version={"inv"} />,
              };
            },
          },
          {
            path: "deliver-history-query-iqc",
            lazy: async () => {
              let { default: HistoryQuery } = await import(
                "./features/WareHouse/pages/HistoryQuery"
              );
              return {
                Component: () => <HistoryQuery version={"iqc"} />,
              };
            },
          },
          {
            path: "graph-testing",
            lazy: async () => {
              let { default: GraphTest } = await import(
                "./features/WareHouse/pages/GraphTest"
              );
              return {
                Component: GraphTest,
              };
            },
          },
          {
            path: "receive-material-form",
            lazy: async () => {
              let { default: RawMaterialReceiveFormt } = await import(
                "./features/WareHouse/pages/ReceiveMaterialForm"
              );
              return {
                Component: RawMaterialReceiveFormt,
              };
            },
          },
          {
            path: "send-raw-material-form",
            lazy: async () => {
              let { default: RawMaterialReturnForm } = await import(
                "./features/WareHouse/pages/SendRawMeterialForm"
              );
              return {
                Component: RawMaterialReturnForm,
              };
            },
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <ErrorPage />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router}></RouterProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
