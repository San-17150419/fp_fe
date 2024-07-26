import { useState, Fragment, useRef, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { GoSidebarCollapse } from "react-icons/go";
import { NavLink, useLocation } from "react-router-dom";
import options from "../../../util/SidebarLinkData";
import cn from "../../../util/cn";

export default function Sidebar() {
  const sidebarRef = useRef<HTMLDivElement | null>(null);

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
    <div className="relative flex w-10 bg-white px-2 pt-4" ref={sidebarRef}>
      <GoSidebarCollapse
        size={24}
        className={cn(
          "mx-auto ml-auto mt-2 cursor-pointer transition-all duration-300",
          !isOpen && "rotate-180",
          isOpen && "rotate-0",
        )}
        onClick={() => setIsOpen(!isOpen)}
      />
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
          
          className={cn(
            "absolute left-10 top-0 z-50 h-full min-w-max max-w-80 bg-white px-4 py-6 transition-all duration-300",
            !isOpen && "invisible w-0",
          )}
        >
          {options.map((option) => (
            <NavLink
              key={option.text}
              to={option.path}
              className={({ isActive }) =>
                cn(
                  "block rounded-full px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200",
                  isActive && "bg-yellow-200",// Highlight last visited link
                )
              }
              onClick={() => setLastVisited(option.path)}
            >
              {option.text}
            </NavLink>
          ))}
        </div>
      </Transition>
    </div>
  );
}
