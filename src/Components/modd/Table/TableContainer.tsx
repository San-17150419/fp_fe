import { useRef, useState, useEffect } from "react";
import TableFetcher from "./TableFetcher";
import { getTableData } from "./api";
export default function TableContainer() {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [tableContainerWidth, setTableContainerWidth] = useState<number>();
  const [tableContainerHeight, setTableContainerHeight] = useState<number>();
  const [isTableReady, setIsTableReady] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (tableContainerRef.current) {
        const rect = tableContainerRef.current.getBoundingClientRect();
        setTableContainerHeight(rect.height);
        setTableContainerWidth(rect.width);
        setIsTableReady(true);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <section className="relative flex-grow" ref={tableContainerRef}>
      {isTableReady && (
        <div
          className="absolute inset-0 overflow-auto"
          style={{
            maxWidth: `${tableContainerWidth}px`,
            maxHeight: `${tableContainerHeight}px`,
          }}
        >
          <TableFetcher fetchData={getTableData}></TableFetcher>
        </div>
      )}
    </section>
  );
}
