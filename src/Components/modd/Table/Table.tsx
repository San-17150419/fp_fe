import { useEffect, useRef, useState } from "react";
import { SimpleObject, TableData } from "./type";
import Td from "./TableTd";
import Loading from "../../../pages/Loading";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Th = ({ children }: { key?: string; children?: React.ReactNode }) => (
  <th className="text-nowrap border border-gray-400 p-3">{children}</th>
);

// This article is about how to add custom fonts
// https://www.devlinpeck.com/content/jspdf-custom-font#:~:text=Adding%20Custom%20Fonts%20to%20jsPDF,of%20your%20desired%20font%20file.&text=Once%20you%20have%20your%20.,to%20this%20jsPDF%20Font%20Converter
type TableProps = {
  data: TableData;
  children?: React.ReactNode;
  header?: string[];
  onRowClick?: (data: TableData) => void;
  onRowDoubleClick?: (data: TableData) => void;
};

function Table({ data, header }: TableProps) {
  const [tableData, setTableData] = useState<TableData>(data);
  const [isPrinting, setIsPrinting] = useState(false);
  const promiseResolveRef = useRef<((value: null) => void) | null>(null);
  const target = useRef<HTMLTableElement>(null);
  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      // Resolves the Promise, letting `react-to-print` know that the DOM updates are completed
      promiseResolveRef.current(null);
    }
  }, [isPrinting]);

  const customToPrint = (printWindow: HTMLIFrameElement) => {
    const printContent =
      printWindow.contentDocument || printWindow.contentWindow?.document;
    const printedScrollContainer = printContent?.querySelector(
      ".scroll-container",
    ) as HTMLElement;

    const originScrollContainer = document.querySelector(
      ".scroll-container",
    ) as HTMLElement;

    if (!originScrollContainer)
      throw new Error("originScrollContainer is null");
    if (!printedScrollContainer)
      throw new Error("printedScrollContainer is null");

    printedScrollContainer.style.overflow = "visible";
    printedScrollContainer.style.height = "fit-content";
    if (!printWindow.contentWindow) throw new Error("contentWindow is null");
    printWindow.contentWindow.print();
  };
  useEffect(() => {
    if (Array.isArray(data)) {
      setTableData(data);
    }
  }, [data]);

  const handlePrintWithWindow = () => {
    window.print();
    console.log("print");
  };

  const handlePrintWithReactToPrint = useReactToPrint({
    content: () => target.current,
    onBeforePrint: () => {
      console.log("onBeforePrint");
    },
    onAfterPrint: () => {
      console.log("onAfterPrint");
    },
  });

  const handlePrintWithJsPDFAutoTable = () => {
    const doc = new jsPDF();
    doc.setLanguage("zh-TW");
    // TODO: 中文亂碼
    // Solution 1: Adding Custom Fonts to jsPDF (Did not work. Try again later)
    autoTable(doc, { html: "#my-table" });
    doc.save("table.pdf");
  };

  // This might not be needed?
  // useEffect(() => {
  //   const pressEnterAndPrint = (event: KeyboardEvent) => {
  //     if (event.key === "Enter") {
  //       // handlePrint();
  //       window.print();
  //       // if( target.current){
  //       //   target.current.print();
  //       // }
  //     }
  //   };

  //   document.addEventListener("keydown", pressEnterAndPrint);
  //   return () => document.removeEventListener("keydown", pressEnterAndPrint);
  // }, [handlePrint]);

  if (!Array.isArray(tableData) || tableData.length === 0) {
    return <Loading />;
  }

  const titles = header || Object.keys(tableData[0]);

  return (
    <>
      <button
        type="button"
        className="my-2 ml-2 h-10 cursor-pointer rounded-md border border-sky-300 bg-sky-300 p-2 hover:bg-sky-500"
        onClick={handlePrintWithReactToPrint}
        aria-label="Print with ReactToPrint"
      >
        Print with ReactToPrint
      </button>
      <button
        type="button"
        className="my-2 ml-2 h-10 cursor-pointer rounded-md border border-sky-300 bg-sky-300 p-2 hover:bg-sky-500"
        onClick={handlePrintWithJsPDFAutoTable}
        aria-label="Print with jsPDFAutoTable"
      >
        Print with jsPDFAutoTable
      </button>
      <button
        type="button"
        className="my-2 ml-2 h-10 cursor-pointer rounded-md border border-sky-300 bg-sky-300 p-2 hover:bg-sky-500"
        onClick={handlePrintWithWindow}
        aria-label="Print with window"
      >
        Print with window
      </button>
      <table
        id="my-table"
        ref={target}
        className="relative w-full table-auto border-separate border-spacing-0 align-middle"
      >
        <thead className="sticky top-0 bg-gray-300">
          <tr className="border border-gray-400 p-2">
            <Th>#</Th>
            {titles.map((title) => (
              <Th key={title}>{title}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((item: SimpleObject, rowIndex: number) => (
            <tr key={`row-${rowIndex}`}>
              <Td>{rowIndex + 1}</Td>

              {Object.keys(item).map((key, columnIndex) => (
                <Td key={`row-${rowIndex}-${columnIndex}`}>
                  {item[key as keyof SimpleObject]}
                </Td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Table;
