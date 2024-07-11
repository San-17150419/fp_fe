import { useRef, useState, useEffect } from "react";
import cn from "../../../util/cn";
export default function TableContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
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
    <section
      className={cn("border-3 relative flex-grow border-2 border-black p-4", className)}
      ref={tableContainerRef}
    >
      {isTableReady && (
        <div
          className="absolute inset-0 m-2 scroll-m-2 overflow-auto scroll-smooth px-2"
          style={{
            maxWidth: `${tableContainerWidth}px`,
            maxHeight: `${tableContainerHeight}px`,
          }}
        >
          {children}
        </div>
      )}
    </section>
  );
}
