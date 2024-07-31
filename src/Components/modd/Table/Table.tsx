import { useEffect, useRef, useState } from "react";
import { SimpleObject, TableData } from "./type";
import Td from "./TableTd";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../../assets/fonts/NotoSansTC-Regular-normal";
import html2canvas from "html2canvas";
import React from "react";

const Th = ({ children }: { key?: string; children?: React.ReactNode }) => (
  <th className="text-nowrap border border-gray-400 p-3">{children}</th>
);
// TODO: Other possible libraries for printing: 1. https://www.npmjs.com/package/@react-pdf/renderer 2. https://www.npmjs.com/package/react-pdf (This is to display pdfs in react)

// This article is about how to add custom fonts
// https://www.devlinpeck.com/content/jspdf-custom-font#:~:text=Adding%20Custom%20Fonts%20to%20jsPDF,of%20your%20desired%20font%20file.&text=Once%20you%20have%20your%20.,to%20this%20jsPDF%20Font%20Converter

// TODO: Maybe it will be less troublesome if I just use `jsPDF`, instead of `autoTable`. Bt I don't think the laguage issue is caused by autotable. Most likely it's caused by the jsPDF library. From my understanding, the autotable library is a plugin for jsPDF, allowing users to pass html directly to it.

// https://fullstackladder.dev/blog/2016/12/29/front-end-jspdf/ is written at 2016-12-29. So it might not be up-to-date. If adding custom fonts can't solve the language issue, I might try the method mentioned in the article. However, that would mean I need to add more libraries.
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

  const handlePrintWithWindow = () => {
    window.print();
    console.log("print");
  };

  const handlePrintWithReactToPrint = useReactToPrint({
    content: () => target.current,
    // pageStyle does not work. Or at least I can't make it work.
    pageStyle: `@page { 
    @bottom-left {
      content: counter(page);
    } }`,
    documentTitle: "My Document",
    onBeforePrint: () => {},
    onAfterPrint: () => {
      console.log("onAfterPrint");
    },
  });

  const handleDownloadPdfWithJsPDFAndHtml2Canvas = async () => {
    const element = target.current;
    if (!element) return;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("print.pdf");
  };
  const handlePrintWithJsPDFAutoTable = () => {
    // I need to add a custom font for chinese characters to display correctly.
    // The default fonts provided by jsPDF can't display Chinese characters.

    // In the document, it did not said how to set the orientation. In one of the articles online I found mentioned that jsPDF can accept `landscape` and `portrait` as the parameter.
    const doc = new jsPDF("landscape");
    // If unsure what font is available, use doc.getFontList()
    // console.log(doc.getFontList());
    autoTable(doc, {
      html: "#my-table",

      styles: { font: "NotoSansTC-Regular", fontStyle: "normal" },
      //didDrawPage is called after each page is drawn. Can be used to add headers or any other content that you want on each page.
      // But this hook does not know the total number of pages before it starts drawing. So I can't add something like `pageCount/totalPages` here.
      // I am not sure if other hooks can do this since the documentation of jsPDF is not clear.
      didDrawPage: (data) => {
        console.dir(data);
        // Add page number
        const pageCount = doc.internal.pages;
        const pageSize = doc.internal.pageSize;
        const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        const pageHeight = pageSize.height
          ? pageSize.height
          : pageSize.getHeight();

        doc.setFontSize(10);
        doc.text(`Page ${data.pageNumber} `, pageWidth - 40, pageHeight - 10);
      },
    });
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

  console.log(tableData);
  // if (!Array.isArray(tableData) || tableData.length === 0) {
  //   return <Loading />;
  // }

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
      <button
        type="button"
        className="my-2 ml-2 h-10 cursor-pointer rounded-md border border-sky-300 bg-sky-300 p-2 hover:bg-sky-500"
        onClick={handleDownloadPdfWithJsPDFAndHtml2Canvas}
        aria-label="Print with window"
      >
        Print with jsPDF and html2canvas
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
