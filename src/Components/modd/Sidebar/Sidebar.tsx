import { useState, Fragment, useRef, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { GoSidebarCollapse } from "react-icons/go";
import { NavLink, useLocation } from "react-router-dom";
import cn from "../../../util/cn";

export default function Sidebar() {
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const links: [string, string][] = [
    ["工廠日誌", "/"],
    ["工程部", "/EngineerDepartment"],
    // ["表單", "/test"],
    // ["按鈕", "/button"],
    // ["標籤", "/tab"],
    // ["圖表", "/highcharts"],
    // ["圖表2", "/highstock-type-1"],
    // ["圖表3", "/highstock-type-2"],
    // ["圖表4", "/highstock-type-3"],
    // ["輸入", "/input"],
    // ["登入", "/login"],
    // ["保護頁面", "/protected"],
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [lastVisited, setLastVisited] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarRef]);

  useEffect(() => {
    setLastVisited(location.pathname);
  }, [location]);

  return (
    <div
      className="relative z-10 flex items-start justify-start bg-white px-2 pt-4"
      ref={sidebarRef}
    >
      <button
        className={cn(
          "cursor-pointer p-0 transition-all duration-100 hover:bg-sky-600",
          // "z-10 cursor-pointer p-0 outline transition-all duration-100 hover:bg-sky-600",
          !isOpen && "rotate-180",
          isOpen && "rotate-0",
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
        type="button"
      >
        <GoSidebarCollapse size={32} />
      </button>

      <Transition
        show={isOpen}
        enter="transition-all ease-out duration-500"
        enterFrom="transform opacity-0 "
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-100"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        as={Fragment}
      >
        <div
          // 48px is from p-2 in navbar and the size of the button.
          className={cn(
            "absolute left-12 top-0 z-50 flex h-full min-w-max max-w-80 flex-col gap-1 bg-white px-4 py-6 transition-all duration-300",
            !isOpen && "hidden w-0",
          )}
        >
          {links.map(([text, path]) => (
            <NavLink
              key={text}
              to={path}
              className={({ isActive }) =>
                cn(
                  "block rounded-full px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200",
                  isActive && "bg-yellow-200", // Highlight last visited link
                  lastVisited === path && "bg-yellow-200",
                )
              }
              onClick={() => {
                setLastVisited(path);
              }}
            >
              {text}
            </NavLink>
          ))}
        </div>
      </Transition>
    </div>
  );
}
