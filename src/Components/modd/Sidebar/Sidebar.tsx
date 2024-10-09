import { useState, useRef, useEffect } from "react";
import { GoSidebarCollapse } from "react-icons/go";
import cn from "../../../util/cn";
import { motion } from "framer-motion";
import LinkGroup from "./LinkGroup";
export default function Sidebar() {
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const linkContents: { [groupName: string]: [string, string][] } = {
    工廠日誌: [["工廠日誌", "/"]],
    工程部: [["工程部", "/EngineerDepartment"]],
    倉庫: [
      // ["交貨驗收單", "/Warehouse"],
      ["交貨驗收單", "/Warehouse/product-recieve-form"],
      ["退貨驗收單", "/Warehouse/product-return-form"],
      ["檢索驗收單", "/Warehouse/deliver-history-query"],
      ["檢索驗收單IQC", "/Warehouse/deliver-history-query-iqc"],
      ["圖表測試", "/Warehouse/graph-testing"],
      ["料品交運送出單", "/Warehouse/send-raw-material-form"],
      ["料品交運回貨單", "/Warehouse/receive-material-form"],
    ],
  };
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [sidebarRef]);

  return (
    <>
      <aside
        className={cn("transition-all duration-1000", isOpen ? "bg-white" : "")}
        ref={sidebarRef}
      >
        <button
          className={cn(
            "cursor-pointer hover:bg-sky-600",
            !isOpen && "rotate-180",
            isOpen && "rotate-0",
          )}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle sidebar"
          type="button"
        >
          <GoSidebarCollapse size={32} />
        </button>

        <motion.div
          {...framerSidebarBackground}
          key="sidebar"
          className={cn(
            "z-50 flex min-w-max max-w-80 flex-col gap-1 bg-white px-2 py-3",
            !isOpen && "hidden w-0",
          )}
        >
          {Object.entries(linkContents).map(([groupName, links]) => (
            <LinkGroup key={groupName} links={links} groupName={groupName} />
          ))}
        </motion.div>
      </aside>
    </>
  );
}
const framerSidebarBackground = {
  initial: { opacity: 0, width: 0, marginLeft: "280px" },
  animate: { opacity: 1, width: "auto", marginLeft: 0 },
  exit: { opacity: 0, width: 0, transition: { duration: 0.3 } },
  transition: { duration: 0.5, ease: "easeOut" },
};
