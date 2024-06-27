import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import {
  ErrorPage,
  InputPage,
  SelectPage,
  DataTablePage,
  DefaultPage,
  BFFPatternPage,
  DataTableWithDialogModalPage,
  TestPage
} from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <DefaultPage /> },
      { path: "input", element: <InputPage /> },
      { path: "select", element: <SelectPage /> },
      { path: "table-non-dialog", element: <DataTablePage /> },
      { path: "table-dialog", element: <DataTablePage /> },
      { path: "bff", element: <BFFPatternPage /> },
      { path: "table-dialog-modal", element: <DataTableWithDialogModalPage /> },
      { path: "test", element: <TestPage /> },
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
